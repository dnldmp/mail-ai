'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { 
  Mail, 
  Star, 
  Archive, 
  AlertCircle, 
  Tag, 
  Users, 
  Bell, 
  TrendingUp 
} from 'lucide-react';

interface CategoryStats {
  category: string;
  count: number;
  unreadCount: number;
}

interface StatsCardsProps {
  totalEmails: number;
  unreadEmails: number;
  starredEmails: number;
  categoryCounts: CategoryStats[];
}

const categoryIcons: Record<string, React.ElementType> = {
  IMPORTANT: AlertCircle,
  PROMOTIONAL: Tag,
  PERSONAL: Users,
  SPAM: Archive,
  SOCIAL: Users,
  UPDATES: Bell,
};

const categoryColors: Record<string, string> = {
  IMPORTANT: 'text-red-500',
  PROMOTIONAL: 'text-yellow-500',
  PERSONAL: 'text-blue-500',
  SPAM: 'text-gray-500',
  SOCIAL: 'text-purple-500',
  UPDATES: 'text-green-500',
};

export function StatsCards({ 
  totalEmails, 
  unreadEmails, 
  starredEmails,
  categoryCounts 
}: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Emails</CardTitle>
          <Mail className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalEmails}</div>
          <p className="text-xs text-gray-500">
            {unreadEmails} unread
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Starred</CardTitle>
          <Star className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{starredEmails}</div>
          <p className="text-xs text-gray-500">Important items</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Productivity</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalEmails > 0 
              ? Math.round(((totalEmails - unreadEmails) / totalEmails) * 100)
              : 0}%
          </div>
          <p className="text-xs text-gray-500">Emails processed</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Categories</CardTitle>
          <Tag className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{categoryCounts.length}</div>
          <p className="text-xs text-gray-500">Active categories</p>
        </CardContent>
      </Card>
    </div>
  );
}

export function CategoryBreakdown({ categoryCounts }: { categoryCounts: CategoryStats[] }) {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Email Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categoryCounts.map((cat) => {
            const Icon = categoryIcons[cat.category] || Mail;
            const color = categoryColors[cat.category] || 'text-gray-500';
            // Calculate percentage of read emails (processed)
            const readCount = cat.count - cat.unreadCount;
            const readPercentage = cat.count > 0 ? (readCount / cat.count) * 100 : 0;

            return (
              <div key={cat.category} className="flex items-center">
                <Icon className={`h-4 w-4 ${color} mr-2`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium capitalize">
                      {cat.category.toLowerCase()}
                    </span>
                    <span className="text-sm text-gray-500">
                      {cat.count} ({cat.unreadCount} unread)
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${readPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
          {categoryCounts.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              No emails synced yet. Click &quot;Sync Emails&quot; to get started.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
