'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { EmailDetail } from '@/components/emails/EmailDetail';
import { Email } from '@/types';

export default function EmailDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const emailId = params.id as string;
  
  const [email, setEmail] = useState<Email | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session && emailId) {
      fetchEmail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, emailId]);

  const fetchEmail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/emails?id=${emailId}`);
      const data = await response.json();
      
      if (data.emails?.[0]) {
        setEmail(data.emails[0]);
        // Mark as read
        if (!data.emails[0].isRead) {
          handleToggleRead(true);
        }
      }
    } catch (error) {
      console.error('Error fetching email:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStar = async (isStarred: boolean) => {
    try {
      await fetch('/api/emails', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: emailId, isStarred }),
      });
      setEmail((prev) => prev ? { ...prev, isStarred } : null);
    } catch (error) {
      console.error('Error updating email:', error);
    }
  };

  const handleToggleRead = async (isRead: boolean) => {
    try {
      await fetch('/api/emails', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: emailId, isRead }),
      });
      setEmail((prev) => prev ? { ...prev, isRead } : null);
    } catch (error) {
      console.error('Error updating email:', error);
    }
  };

  const handleArchive = async () => {
    try {
      await fetch('/api/emails', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: emailId, isArchived: true }),
      });
      router.push('/dashboard');
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

  if (!email) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Email not found</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          <EmailDetail
            email={email}
            onToggleStar={handleToggleStar}
            onArchive={handleArchive}
          />
        </div>
      </main>
    </div>
  );
}
