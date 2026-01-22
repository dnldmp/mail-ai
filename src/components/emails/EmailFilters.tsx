'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { EmailCategory } from '@/types';
import { Search, Filter, X } from 'lucide-react';

interface EmailFiltersProps {
  onFilterChange: (filters: {
    category?: EmailCategory;
    isRead?: boolean;
    search?: string;
  }) => void;
  onSync: () => void;
  isSyncing: boolean;
}

const categories: { value: EmailCategory | ''; label: string }[] = [
  { value: '', label: 'All Categories' },
  { value: 'IMPORTANT', label: 'Important' },
  { value: 'PROMOTIONAL', label: 'Promotional' },
  { value: 'PERSONAL', label: 'Personal' },
  { value: 'SOCIAL', label: 'Social' },
  { value: 'UPDATES', label: 'Updates' },
  { value: 'SPAM', label: 'Spam' },
];

export function EmailFilters({ onFilterChange, onSync, isSyncing }: EmailFiltersProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<EmailCategory | ''>('');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({
      category: category || undefined,
      isRead: showUnreadOnly ? false : undefined,
      search: search || undefined,
    });
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setShowUnreadOnly(false);
    onFilterChange({});
  };

  return (
    <div className="bg-white p-4 rounded-lg border space-y-4">
      <form onSubmit={handleSearchSubmit} className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search emails..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as EmailCategory | '')}
          className="h-10 px-3 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
        <Button type="submit">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
        <Button type="button" variant="outline" onClick={clearFilters}>
          <X className="h-4 w-4 mr-2" />
          Clear
        </Button>
      </form>

      <div className="flex items-center justify-between">
        <label className="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            checked={showUnreadOnly}
            onChange={(e) => setShowUnreadOnly(e.target.checked)}
            className="rounded border-gray-300"
          />
          <span>Show unread only</span>
        </label>

        <Button onClick={onSync} disabled={isSyncing}>
          {isSyncing ? 'Syncing...' : 'Sync Emails'}
        </Button>
      </div>
    </div>
  );
}
