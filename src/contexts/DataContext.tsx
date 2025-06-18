import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { GameSession, CashTransaction, DashboardStats } from '../types';
import { supabase } from '../lib/supabase';

interface DataContextType {
  // Game Sessions
  gameSessions: GameSession[];
  addGameSession: (session: Omit<GameSession, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateGameSession: (id: string, updates: Partial<GameSession>) => Promise<void>;
  getActiveSessions: () => GameSession[];
  getCompletedSessions: (startDate?: Date, endDate?: Date) => GameSession[];
  getCompletedSessionsLast24Hours: () => GameSession[];
  
  // Cash Transactions
  cashTransactions: CashTransaction[];
  addCashTransaction: (transaction: Omit<CashTransaction, 'id' | 'createdAt'>) => Promise<void>;
  getCurrentCashBalance: () => number;
  
  // Dashboard
  getDashboardStats: () => DashboardStats;
  
  // Loading states
  loading: boolean;
  error: string | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export function DataProvider({ children }: DataProviderProps) {
  const [gameSessions, setGameSessions] = useState<GameSession[]>([]);
  const [cashTransactions, setCashTransactions] = useState<CashTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load game sessions
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('game_sessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (sessionsError) throw sessionsError;

      // Load cash transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('cash_transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (transactionsError) throw transactionsError;

      // Transform data to match frontend types
      const transformedSessions: GameSession[] = (sessionsData || []).map(session => ({
        id: session.id,
        customerName: session.customer_name,
        controllerCount: session.controller_count,
        gameType: session.game_type,
        startTime: new Date(session.start_time),
        endTime: session.end_time ? new Date(session.end_time) : undefined,
        duration: session.duration || undefined,
        calculatedPrice: session.calculated_price,
        totalPrice: session.total_price,
        cashReceived: session.cash_received,
        onlineReceived: session.online_received,
        status: session.status,
        isMismatch: session.is_mismatch || false,
        mismatchReason: session.mismatch_reason || undefined,
        createdAt: new Date(session.created_at),
        updatedAt: new Date(session.updated_at)
      }));

      const transformedTransactions: CashTransaction[] = (transactionsData || []).map(transaction => ({
        id: transaction.id,
        gameSessionId: transaction.game_session_id || undefined,
        txnAmount: transaction.txn_amount,
        totalCurrAmount: transaction.total_curr_amount,
        description: transaction.description,
        txnType: transaction.txn_type,
        txnDate: new Date(transaction.txn_date),
        createdAt: new Date(transaction.created_at)
      }));

      setGameSessions(transformedSessions);
      setCashTransactions(transformedTransactions);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const addGameSession = async (sessionData: Omit<GameSession, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { data, error } = await supabase
        .from('game_sessions')
        .insert({
          customer_name: sessionData.customerName,
          controller_count: sessionData.controllerCount,
          game_type: sessionData.gameType,
          start_time: sessionData.startTime.toISOString(),
          end_time: sessionData.endTime?.toISOString() || null,
          duration: sessionData.duration || null,
          calculated_price: sessionData.calculatedPrice,
          total_price: sessionData.totalPrice,
          cash_received: sessionData.cashReceived,
          online_received: sessionData.onlineReceived,
          status: sessionData.status,
          is_mismatch: sessionData.isMismatch || false,
          mismatch_reason: sessionData.mismatchReason || null
        })
        .select()
        .single();

      if (error) throw error;

      // Add to local state
      const newSession: GameSession = {
        id: data.id,
        customerName: data.customer_name,
        controllerCount: data.controller_count,
        gameType: data.game_type,
        startTime: new Date(data.start_time),
        endTime: data.end_time ? new Date(data.end_time) : undefined,
        duration: data.duration || undefined,
        calculatedPrice: data.calculated_price,
        totalPrice: data.total_price,
        cashReceived: data.cash_received,
        onlineReceived: data.online_received,
        status: data.status,
        isMismatch: data.is_mismatch || false,
        mismatchReason: data.mismatch_reason || undefined,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };

      setGameSessions(prev => [newSession, ...prev]);
    } catch (err) {
      console.error('Error adding game session:', err);
      throw err;
    }
  };

  const updateGameSession = async (id: string, updates: Partial<GameSession>) => {
    try {
      const updateData: any = {};
      
      if (updates.customerName !== undefined) updateData.customer_name = updates.customerName;
      if (updates.controllerCount !== undefined) updateData.controller_count = updates.controllerCount;
      if (updates.gameType !== undefined) updateData.game_type = updates.gameType;
      if (updates.startTime !== undefined) updateData.start_time = updates.startTime.toISOString();
      if (updates.endTime !== undefined) updateData.end_time = updates.endTime?.toISOString() || null;
      if (updates.duration !== undefined) updateData.duration = updates.duration;
      if (updates.calculatedPrice !== undefined) updateData.calculated_price = updates.calculatedPrice;
      if (updates.totalPrice !== undefined) updateData.total_price = updates.totalPrice;
      if (updates.cashReceived !== undefined) updateData.cash_received = updates.cashReceived;
      if (updates.onlineReceived !== undefined) updateData.online_received = updates.onlineReceived;
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.isMismatch !== undefined) updateData.is_mismatch = updates.isMismatch;
      if (updates.mismatchReason !== undefined) updateData.mismatch_reason = updates.mismatchReason;

      const { error } = await supabase
        .from('game_sessions')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setGameSessions(prev => 
        prev.map(session => 
          session.id === id 
            ? { ...session, ...updates, updatedAt: new Date() }
            : session
        )
      );
    } catch (err) {
      console.error('Error updating game session:', err);
      throw err;
    }
  };

  const getActiveSessions = () => {
    return gameSessions.filter(session => session.status === 'ACTIVE');
  };

  const getCompletedSessions = (startDate?: Date, endDate?: Date) => {
    let completed = gameSessions.filter(session => session.status === 'COMPLETED');
    
    if (startDate && endDate) {
      completed = completed.filter(session => {
        const sessionDate = new Date(session.createdAt);
        return sessionDate >= startDate && sessionDate <= endDate;
      });
    }
    
    return completed.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const getCompletedSessionsLast24Hours = () => {
    const now = new Date();
    const oneDayAgo = new Date(now);
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    return gameSessions.filter(session => {
      // Only include completed sessions
      if (session.status !== 'COMPLETED' || !session.endTime) return false;
      
      const endTime = new Date(session.endTime);
      return endTime >= oneDayAgo && endTime <= now;
    }).sort((a, b) => new Date(b.endTime!).getTime() - new Date(a.endTime!).getTime());
  };

  const addCashTransaction = async (transactionData: Omit<CashTransaction, 'id' | 'createdAt'>) => {
    try {
      const currentBalance = getCurrentCashBalance();
      const newBalance = transactionData.txnType === 'CREDIT' 
        ? currentBalance + transactionData.txnAmount
        : currentBalance - transactionData.txnAmount;

      const { data, error } = await supabase
        .from('cash_transactions')
        .insert({
          game_session_id: transactionData.gameSessionId || null,
          txn_amount: transactionData.txnAmount,
          total_curr_amount: newBalance,
          description: transactionData.description,
          txn_type: transactionData.txnType,
          txn_date: transactionData.txnDate.toISOString().split('T')[0]
        })
        .select()
        .single();

      if (error) throw error;

      // Add to local state
      const newTransaction: CashTransaction = {
        id: data.id,
        gameSessionId: data.game_session_id || undefined,
        txnAmount: data.txn_amount,
        totalCurrAmount: data.total_curr_amount,
        description: data.description,
        txnType: data.txn_type,
        txnDate: new Date(data.txn_date),
        createdAt: new Date(data.created_at)
      };

      setCashTransactions(prev => [newTransaction, ...prev]);
    } catch (err) {
      console.error('Error adding cash transaction:', err);
      throw err;
    }
  };

  const getCurrentCashBalance = () => {
    if (cashTransactions.length === 0) return 0;
    const sortedTransactions = [...cashTransactions].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return sortedTransactions[0]?.totalCurrAmount || 0;
  };

  const getDashboardStats = (): DashboardStats => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaySessions = gameSessions.filter(session => {
      const sessionDate = new Date(session.createdAt);
      return sessionDate >= today && sessionDate < tomorrow;
    });

    const activeSessions = getActiveSessions().length;
    const completedTodaySessions = todaySessions.filter(s => s.status === 'COMPLETED');
    const totalIncome = completedTodaySessions.reduce((sum, session) => sum + session.totalPrice, 0);
    const cashBalance = getCurrentCashBalance();

    return {
      todaySessions: todaySessions.length,
      activeSessions,
      totalIncome,
      cashBalance
    };
  };

  const value = {
    gameSessions,
    addGameSession,
    updateGameSession,
    getActiveSessions,
    getCompletedSessions,
    getCompletedSessionsLast24Hours,
    cashTransactions,
    addCashTransaction,
    getCurrentCashBalance,
    getDashboardStats,
    loading,
    error
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}