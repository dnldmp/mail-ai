'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { StatsCards, CategoryBreakdown } from '@/components/dashboard/StatsCards';
import { ActivityChart, CategoryPieChart } from '@/components/dashboard/Charts';
import { EmailList } from '@/components/emails/EmailList';
import { EmailFilters } from '@/components/emails/EmailFilters';
import { Email, EmailCategory } from '@/types';

interface CategoryStats {
  category: string;
  count: number;
  unreadCount: number;
}

function DashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [stats, setStats] = useState({
    totalEmails: 0,
    unreadEmails: 0,
    starredEmails: 0,
    categoryCounts: [] as CategoryStats[],
    activityData: [] as { date: string; count: number }[],
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchEmails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, searchParams]);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      const category = searchParams.get('category');
      const starred = searchParams.get('starred');
      const archived = searchParams.get('archived');
      const search = searchParams.get('search');
      
      if (category) params.set('category', category);
      if (starred) params.set('isStarred', starred);
      if (archived) params.set('isArchived', archived);
      if (search) params.set('search', search);

      const response = await fetch(`/api/emails?${params.toString()}`);
      const data = await response.json();
      
      if (data.emails) {
        setEmails(data.emails);
        calculateStats(data.emails);
      }
    } catch (error) {
      console.error('Error fetching emails:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (emailList: Email[]) => {
    const categoryCounts: Record<string, { count: number; unreadCount: number }> = {};
    let unreadTotal = 0;
    let starredTotal = 0;

    emailList.forEach((email) => {
      if (!categoryCounts[email.category]) {
        categoryCounts[email.category] = { count: 0, unreadCount: 0 };
      }
      categoryCounts[email.category].count++;
      if (!email.isRead) {
        categoryCounts[email.category].unreadCount++;
        unreadTotal++;
      }
      if (email.isStarred) starredTotal++;
    });

    // Calculate activity data for last 7 days
    const activityData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { weekday: 'short' });
      const count = emailList.filter((email) => {
        const emailDate = new Date(email.receivedAt);
        return emailDate.toDateString() === date.toDateString();
      }).length;
      activityData.push({ date: dateStr, count });
    }

    setStats({
      totalEmails: emailList.length,
      unreadEmails: unreadTotal,
      starredEmails: starredTotal,
      categoryCounts: Object.entries(categoryCounts).map(([category, data]) => ({
        category,
        ...data,
      })),
      activityData,
    });
  };

  const handleSync = async () => {
    try {
      setIsSyncing(true);
      const response = await fetch('/api/sync', { method: 'POST' });
      const data = await response.json();
      
      if (data.success) {
        fetchEmails();
      }
    } catch (error) {
      console.error('Error syncing emails:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleFilterChange = (filters: {
    category?: EmailCategory;
    isRead?: boolean;
    search?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters.category) params.set('category', filters.category);
    if (filters.isRead !== undefined) params.set('isRead', String(filters.isRead));
    if (filters.search) params.set('search', filters.search);
    router.push(`/dashboard?${params.toString()}`);
  };

  const handleToggleStar = async (id: string, isStarred: boolean) => {
    try {
      await fetch('/api/emails', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isStarred }),
      });
      setEmails((prev) =>
        prev.map((email) =>
          email.id === id ? { ...email, isStarred } : email
        )
      );
    } catch (error) {
      console.error('Error updating email:', error);
    }
  };

  const handleToggleRead = async (id: string, isRead: boolean) => {
    try {
      await fetch('/api/emails', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isRead }),
      });
      setEmails((prev) =>
        prev.map((email) =>
          email.id === id ? { ...email, isRead } : email
        )
      );
    } catch (error) {
      console.error('Error updating email:', error);
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await fetch('/api/emails', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isArchived: true }),
      });
      setEmails((prev) => prev.filter((email) => email.id !== id));
    } catch (error) {
      console.error('Error archiving email:', error);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500">Manage your emails with AI-powered organization</p>
          </div>

          <StatsCards
            totalEmails={stats.totalEmails}
            unreadEmails={stats.unreadEmails}
            starredEmails={stats.starredEmails}
            categoryCounts={stats.categoryCounts}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <ActivityChart data={stats.activityData} />
            <CategoryPieChart data={stats.categoryCounts} />
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <CategoryBreakdown categoryCounts={stats.categoryCounts} />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Emails</h2>
            <EmailFilters
              onFilterChange={handleFilterChange}
              onSync={handleSync}
              isSyncing={isSyncing}
            />
            <EmailList
              emails={emails}
              onToggleStar={handleToggleStar}
              onToggleRead={handleToggleRead}
              onArchive={handleArchive}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <DashboardContent />
    </Suspense>
  );
}
