"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  PlusCircle, 
  List, 
  PieChart, 
  Target, 
  TrendingUp,
  DollarSign,
  Calendar,
  Settings
} from 'lucide-react';

import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';
import Dashboard from '@/components/Dashboard';
import BudgetManager from '@/components/BudgetManager';
import { useTransactions, Transaction } from '@/hooks/useTransactions';
import { useAnalytics } from '@/hooks/useAnalytics';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  
  const { 
    transactions, 
    loading: transactionsLoading, 
    addTransaction, 
    updateTransaction, 
    deleteTransaction 
  } = useTransactions();
  
  const { data: analyticsData, loading: analyticsLoading, fetchAnalytics } = useAnalytics();

  const handleAddTransaction = async (transactionData: Omit<Transaction, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addTransaction(transactionData);
      setShowTransactionForm(false);
      fetchAnalytics(); // Refresh analytics
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const handleUpdateTransaction = async (transactionData: Omit<Transaction, '_id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingTransaction) return;
    
    try {
      await updateTransaction(editingTransaction._id, transactionData);
      setEditingTransaction(null);
      fetchAnalytics(); // Refresh analytics
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteTransaction(id);
      fetchAnalytics(); // Refresh analytics
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setActiveTab('add');
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Personal Finance Visualizer
              </h1>
              <p className="text-gray-600">
                Track your expenses, manage budgets, and visualize your financial journey
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-sm">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date().toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </Badge>
              <Button 
                onClick={() => {
                  setActiveTab('add');
                  setEditingTransaction(null);
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Transaction
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:grid-cols-4">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">Transactions</span>
            </TabsTrigger>
            <TabsTrigger value="budget" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Budget</span>
            </TabsTrigger>
            <TabsTrigger value="add" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Add</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {analyticsData ? (
              <Dashboard data={analyticsData} loading={analyticsLoading} />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Getting Started
                  </CardTitle>
                  <CardDescription>
                    Welcome to your Personal Finance Visualizer
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <DollarSign className="h-16 w-16 mx-auto mb-4 text-blue-600 opacity-50" />
                    <h3 className="text-xl font-semibold mb-2">Start Tracking Your Finances</h3>
                    <p className="text-gray-600 mb-6">
                      Add your first transaction to see your financial insights and charts
                    </p>
                    <Button 
                      onClick={() => setActiveTab('add')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Your First Transaction
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <TransactionList
              transactions={transactions}
              onEdit={handleEditTransaction}
              onDelete={handleDeleteTransaction}
              loading={transactionsLoading}
            />
          </TabsContent>

          <TabsContent value="budget" className="space-y-6">
            <BudgetManager />
          </TabsContent>

          <TabsContent value="add" className="space-y-6">
            <TransactionForm
              onSubmit={editingTransaction ? handleUpdateTransaction : handleAddTransaction}
              onCancel={editingTransaction ? handleCancelEdit : undefined}
              initialData={editingTransaction}
              isEditing={!!editingTransaction}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}