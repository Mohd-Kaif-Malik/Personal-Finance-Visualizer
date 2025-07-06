export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const transactionsCol = db.collection('transactions');
    const body = await request.json();
    const { description, amount, category, type, date } = body;

    const result = await transactionsCol.findOneAndUpdate(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          description,
          amount,
          category,
          type,
          date: new Date(date),
        },
      },
      { returnDocument: 'after' }
    );

    if (!result || !result.value) {
      return NextResponse.json(
        { error: 'Failed to update transaction' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.value);
  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to update transaction' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const transactionsCol = db.collection('transactions');
    const result = await transactionsCol.deleteOne({ _id: new ObjectId(params.id) });

    if (!result || result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Failed to delete transaction' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json(
      { error: 'Failed to delete transaction' },
      { status: 500 }
    );
  }
}