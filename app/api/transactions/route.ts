export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const transactionsCol = db.collection('transactions');

    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');
    let query: any = {};

    if (month && year) {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const transactions = await transactionsCol
      .find(query)
      .sort({ date: -1 })
      .toArray();

    return NextResponse.json(transactions || []);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const transactionsCol = db.collection('transactions');
    const body = await request.json();
    const { description, amount, category, type, date } = body;

    if (!description || !amount || !category || !type || !date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await transactionsCol.insertOne({
      description,
      amount,
      category,
      type,
      date: new Date(date),
      created_at: new Date(),
      updated_at: new Date(),
    });

    if (!result.acknowledged) {
      return NextResponse.json(
        { error: 'Failed to create transaction' },
        { status: 500 }
      );
    }

    const newTransaction = await transactionsCol.findOne({ _id: result.insertedId });
    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}