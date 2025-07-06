export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db(); // defaults to 'personal-finance' from your URI
    const transactionsCol = db.collection('transactions');
    const budgetsCol = db.collection('budgets');

    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');
    const currentMonth = month ? parseInt(month) : new Date().getMonth() + 1;
    const currentYear = year ? parseInt(year) : new Date().getFullYear();

    // Monthly spending data for last 6 months
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - 1 - i, 1);
      const nextDate = new Date(currentYear, currentMonth - i, 1);

      const transactions = await transactionsCol.find({
        type: 'expense',
        date: { $gte: date, $lt: nextDate }
      }).toArray();

      const total = transactions.reduce((sum, t) => sum + t.amount, 0);

      monthlyData.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        amount: total,
      });
    }

    // Category-wise spending for current month
    const startDate = new Date(currentYear, currentMonth - 1, 1);
    const endDate = new Date(currentYear, currentMonth, 0);

    const expenseTransactions = await transactionsCol.find({
      type: 'expense',
      date: { $gte: startDate, $lte: endDate }
    }).toArray();

    const categoryMap = new Map();
    expenseTransactions.forEach((transaction) => {
      const current = categoryMap.get(transaction.category) || 0;
      categoryMap.set(transaction.category, current + transaction.amount);
    });

    const categoryData = Array.from(categoryMap.entries()).map(([name, value]) => ({
      name,
      value,
    }));

    // Budgets for current month
    const budgets = await budgetsCol.find({
      month: currentMonth,
      year: currentYear
    }).toArray();

    // Budget vs actual
    const budgetComparison = budgets.map((budget) => {
      const actualSpending = categoryMap.get(budget.category) || 0;
      return {
        category: budget.category,
        budget: budget.amount,
        actual: actualSpending,
        percentage: budget.amount > 0 ? (actualSpending / budget.amount) * 100 : 0,
      };
    });

    // Recent transactions
    const recentTransactions = await transactionsCol.find({})
      .sort({ date: -1 })
      .limit(5)
      .toArray();

    // Totals
    const totalExpenses = categoryData.reduce((sum, cat) => sum + cat.value, 0);
    const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);

    return NextResponse.json({
      monthlyData,
      categoryData,
      budgetComparison,
      recentTransactions,
      summary: {
        totalExpenses,
        totalBudget,
        budgetUtilization: totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0,
      },
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}