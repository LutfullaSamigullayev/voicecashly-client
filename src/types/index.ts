export type Lang = 'uz' | 'ru' | 'en';
export type Currency = 'UZS' | 'USD';
export type TxType = 'INCOME' | 'EXPENSE';
export type CategoryType = 'INCOME' | 'EXPENSE' | 'BOTH';
export type Role = 'OWNER' | 'ADMIN' | 'MEMBER';
export type Source = 'TELEGRAM' | 'MANUAL' | 'API';

export interface User {
  id: number;
  telegramId: string | number;
  firstName: string;
  lastName?: string | null;
  username?: string | null;
  language: 'UZ' | 'RU' | 'EN';
  settings?: UserSettings | null;
  workspaces?: WorkspaceMembership[];
}

export interface UserSettings {
  id: number;
  userId: number;
  defaultCurrency: Currency;
  language: 'UZ' | 'RU' | 'EN';
  timezone: string;
  notifyBudget: boolean;
  notifyRecurring: boolean;
}

export interface Workspace {
  id: number;
  name: string;
  isPersonal: boolean;
  inviteCode: string | null;
  createdAt: string;
  settings?: { defaultCurrency: Currency } | null;
  members?: WorkspaceMember[];
}

export interface WorkspaceMember {
  id: number;
  workspaceId: number;
  userId: number;
  role: Role;
  joinedAt: string;
  user?: User;
}

export interface WorkspaceMembership {
  id: number;
  workspaceId: number;
  userId: number;
  role: Role;
  joinedAt: string;
  workspace: Workspace;
}

export interface Category {
  id: number;
  workspaceId: number;
  nameUz: string;
  nameRu: string;
  nameEn: string;
  type: CategoryType;
  color: string;
  icon: string;
  isDefault: boolean;
  isArchived: boolean;
  sortOrder: number;
}

export interface Transaction {
  id: number;
  workspaceId: number;
  amount: string | number;
  currency: Currency;
  amountUzs: string | number | null;
  exchangeRate: string | number | null;
  type: TxType;
  categoryId: number;
  category?: Category;
  noteUz: string | null;
  noteRu: string | null;
  noteEn: string | null;
  date: string;
  source: Source;
  userId: number;
  user?: User;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionsList {
  items: Transaction[];
  total: number;
  page: number;
  limit: number;
}

export interface Summary {
  income: number;
  expense: number;
  net: number;
}

export interface MonthlyPoint {
  month: number;
  year: number;
  income: number;
  expense: number;
}

export interface CategoryBreakdownItem {
  categoryId: number;
  nameUz: string;
  nameRu: string;
  nameEn: string;
  color: string;
  amount: number;
}

export interface Budget {
  id: number;
  workspaceId: number;
  categoryId: number;
  amount: string | number;
  currency: Currency;
  month: number;
  year: number;
}

export interface BudgetProgress {
  categoryId: number;
  category: Category;
  budget: number;
  spent: number;
  percent: number;
}

export interface ExchangeRate {
  id: number;
  from: Currency;
  to: Currency;
  rate: string | number;
  date: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface TelegramAuthData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}
