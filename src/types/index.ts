export type EmailCategory =
  | 'IMPORTANT'
  | 'PROMOTIONAL'
  | 'PERSONAL'
  | 'SPAM'
  | 'SOCIAL'
  | 'UPDATES'
  | 'UNCATEGORIZED';

export interface Email {
  id: string;
  externalId: string;
  userId: string;
  from: string;
  to: string[];
  subject: string;
  body: string;
  snippet?: string | null;
  category: EmailCategory;
  isRead: boolean;
  isStarred: boolean;
  isArchived: boolean;
  receivedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  suggestedReply?: string | null;
  provider: string;
}

export interface AutomationRule {
  id: string;
  userId: string;
  name: string;
  condition: string;
  action: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryStats {
  category: EmailCategory;
  count: number;
  unreadCount: number;
}

export interface DashboardStats {
  totalEmails: number;
  unreadEmails: number;
  categoryCounts: CategoryStats[];
  recentActivity: {
    date: string;
    count: number;
  }[];
}

export interface EmailFilter {
  category?: EmailCategory;
  isRead?: boolean;
  isStarred?: boolean;
  isArchived?: boolean;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
}
