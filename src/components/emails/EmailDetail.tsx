'use client';

import { Email } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatDate, cn } from '@/lib/utils';
import { 
  ArrowLeft, 
  Star, 
  Archive, 
  Reply, 
  Forward, 
  Trash2,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface EmailDetailProps {
  email: Email;
  onToggleStar: (isStarred: boolean) => void;
  onArchive: () => void;
}

const categoryVariant = {
  IMPORTANT: 'important' as const,
  PROMOTIONAL: 'promotional' as const,
  PERSONAL: 'personal' as const,
  SPAM: 'spam' as const,
  SOCIAL: 'social' as const,
  UPDATES: 'updates' as const,
  UNCATEGORIZED: 'default' as const,
};

export function EmailDetail({ email, onToggleStar, onArchive }: EmailDetailProps) {
  const [showSuggestedReply, setShowSuggestedReply] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Link href="/dashboard">
          <Button variant="ghost">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to inbox
          </Button>
        </Link>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleStar(!email.isStarred)}
          >
            <Star
              className={cn('h-5 w-5', email.isStarred && 'text-yellow-500 fill-yellow-500')}
            />
          </Button>
          <Button variant="ghost" size="icon" onClick={onArchive}>
            <Archive className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Reply className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Forward className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">{email.subject}</CardTitle>
              <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                <span>From: <strong>{email.from}</strong></span>
                <span>To: {email.to.join(', ')}</span>
                <span>{formatDate(email.receivedAt)}</span>
              </div>
            </div>
            <Badge variant={categoryVariant[email.category]}>
              {email.category.toLowerCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-700">
              {email.body}
            </div>
          </div>
        </CardContent>
      </Card>

      {email.suggestedReply && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-blue-500" />
                <CardTitle className="text-base">AI Suggested Reply</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSuggestedReply(!showSuggestedReply)}
              >
                {showSuggestedReply ? 'Hide' : 'Show'}
              </Button>
            </div>
          </CardHeader>
          {showSuggestedReply && (
            <CardContent>
              <p className="text-gray-700">{email.suggestedReply}</p>
              <Button className="mt-4">
                <Reply className="h-4 w-4 mr-2" />
                Use this reply
              </Button>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}
