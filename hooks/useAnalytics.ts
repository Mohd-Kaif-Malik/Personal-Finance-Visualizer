"use client";

import { useState, useEffect } from 'react';

export interface AnalyticsData {
  monthlyData: Array<{
    month: string;
    amount: number;
  }>;
  categoryData: Array<{
    name: string;
    value: number;
  }>;
  budgetComparison: Array<{
    category: string;
    budget: number;
    actual: number;
    percentage: number;
  }>;
  recentTransactions: Array<{
    _id: string;
    amount: number;
    date: string;
    description: string;
    category: string;
    type: string;
  }>;
  summary: {
    totalExpenses: number;
    totalBudget: number;
    budgetUtilization: number;
  };
}

export const useAnalytics = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async (month?: number, year?: number) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (month) params.append('month', month.toString());
      if (year) params.append('year', year.toString());
      
      const response = await fetch(`/api/analytics?${params}`);
      if (!response.ok) throw new Error('Failed to fetch analytics');
      
      const analyticsData = await response.json();
      setData(analyticsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return {
    data,
    loading,
    error,
    fetchAnalytics,
  };
};