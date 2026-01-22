'use client';

import { useState } from 'react';
import { Email, EmailCategory } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate, truncateText } from '@/lib/utils';
import { Star, Archive, Mail, MailOpen } from 'lucide-react';
import Link from 'next/link';

interface EmailListProps {
  emails: Email[];
  onToggleStar: (id: string, isStarred: boolean) => void;
  onToggleRead: (id: string, isRead: boolean) => void;
  onArchive: (id: string) => void;
}

const categoryVariant: Record<EmailCategory, 'important' | 'promotional' | 'personal' | 'spam' | 'social' | 'updates' | 'default'> = {
  IMPORTANT: 'important',
  PROMOTIONAL: 'promotional',
  PERSONAL: 'personal',
  SPAM: 'spam',
  SOCIAL: 'social',
  UPDATES: 'updates',
  UNCATEGORIZED: 'default',
};

export function EmailList({ emails, onToggleStar, onToggleRead, onArchive }: EmailListProps) {
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedEmails);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedEmails(newSelected);
  };

  if (emails.length === 0) {
    return (
      <div className="text-center py-12">
        <Mail className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">No emails found</h3>
        <p className="mt-2 text-gray-500">
          Try syncing your emails or adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200 bg-white rounded-lg border">
      {emails.map((email) => (
        <div
          key={email.id}
          className={`flex items-start p-4 hover:bg-gray-50 transition-colors ${
            !email.isRead ? 'bg-blue-50' : ''
          }`}
        >
          <div className="flex items-center space-x-3 mr-4">
            <input
              type="checkbox"
              checked={selectedEmails.has(email.id)}
              onChange={() => toggleSelect(email.id)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <button
              onClick={() => onToggleStar(email.id, !email.isStarred)}
              className={`${
                email.isStarred ? 'text-yellow-500' : 'text-gray-400'
              } hover:text-yellow-500`}
            >
              <Star className="h-5 w-5" fill={email.isStarred ? 'currentColor' : 'none'} />
            </button>
          </div>

          <Link href={`/emails/${email.id}`} className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className={`text-sm ${!email.isRead ? 'font-semibold' : 'font-medium'} text-gray-900 truncate`}>
                {email.from}
              </p>
              <div className="flex items-center space-x-2">
                <Badge variant={categoryVariant[email.category]}>
                  {email.category.toLowerCase()}
                </Badge>
                <span className="text-xs text-gray-500">
                  {formatDate(email.receivedAt)}
                </span>
              </div>
            </div>
            <p className={`text-sm ${!email.isRead ? 'font-medium' : ''} text-gray-900 mt-1`}>
              {email.subject}
            </p>
            <p className="text-sm text-gray-500 mt-1 truncate">
              {truncateText(email.snippet || email.body, 100)}
            </p>
          </Link>

          <div className="flex items-center space-x-2 ml-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleRead(email.id, !email.isRead)}
              title={email.isRead ? 'Mark as unread' : 'Mark as read'}
            >
              {email.isRead ? (
                <MailOpen className="h-4 w-4" />
              ) : (
                <Mail className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onArchive(email.id)}
              title="Archive"
            >
              <Archive className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
