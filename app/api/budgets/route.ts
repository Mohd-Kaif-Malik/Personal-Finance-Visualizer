export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db(); // defaults to 'personal-finance'
    const budgetsCol = db.collection('budgets');

    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    let query: any = {};
    if (month && year) {
      query.month = parseInt(month);
      query.year = parseInt(year);
    }

    const budgets = await budgetsCol.find(query).toArray();

    return NextResponse.json(budgets || []);
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch budgets' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const budgetsCol = db.collection('budgets');

    const body = await request.json();
    const { category, amount, month, year } = body;

    if (!category || !amount || !month || !year) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await budgetsCol.insertOne({
      category,
      amount,
      month,
      year,
    });

    if (!result.acknowledged) {
      return NextResponse.json(
        { error: 'Failed to create budget' },
        { status: 500 }
      );
    }

    const newBudget = await budgetsCol.findOne({ _id: result.insertedId });

    return NextResponse.json(newBudget, { status: 201 });
  } catch (error) {
    console.error('Error creating budget:', error);
    return NextResponse.json(
      { error: 'Failed to create budget' },
      { status: 500 }
    );
  }
}