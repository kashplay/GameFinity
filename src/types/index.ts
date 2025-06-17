export interface GameSession {
  id: string;
  customerName: string;
  controllerCount: number;
  gameType: 'screen1' | 'screen2' | 'screen3' | 'screen4' | 'pool';
  startTime: Date;
  endTime?: Date;
  duration?: number; // in minutes
  calculatedPrice: number;
  totalPrice: number;
  cashReceived: number;
  onlineReceived: number;
  status: 'ACTIVE' | 'COMPLETED';
  isMismatch?: boolean;
  mismatchReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CashTransaction {
  id: string;
  gameSessionId?: string;
  txnAmount: number;
  totalCurrAmount: number;
  description: string;
  txnType: 'CREDIT' | 'DEBIT';
  txnDate: Date;
  createdAt: Date;
}

export interface User {
  id: string;
  username: string;
  role: 'USER' | 'ADMIN';
}

export interface DashboardStats {
  todaySessions: number;
  activeSessions: number;
  totalIncome: number;
  cashBalance: number;
}