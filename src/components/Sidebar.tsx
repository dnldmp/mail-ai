'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import {
  LayoutDashboard,
  Mail,
  Settings,
  LogOut,
  Star,
  Archive,
  Tag,
  AlertCircle,
  Users,
  Bell,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'All Emails', href: '/dashboard?view=all', icon: Mail },
  { name: 'Starred', href: '/dashboard?starred=true', icon: Star },
  { name: 'Archived', href: '/dashboard?archived=true', icon: Archive },
];

const categories = [
  { name: 'Important', value: 'IMPORTANT', icon: AlertCircle, color: 'text-red-500' },
  { name: 'Personal', value: 'PERSONAL', icon: Users, color: 'text-blue-500' },
  { name: 'Promotional', value: 'PROMOTIONAL', icon: Tag, color: 'text-yellow-500' },
  { name: 'Updates', value: 'UPDATES', icon: Bell, color: 'text-green-500' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="w-64 bg-white border-r h-screen flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-600 flex items-center">
          <Mail className="h-6 w-6 mr-2" />
          Mail AI
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          );
        })}

        <div className="pt-4 mt-4 border-t">
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Categories
          </p>
          <div className="mt-2 space-y-1">
            {categories.map((cat) => (
              <Link
                key={cat.value}
                href={`/dashboard?category=${cat.value}`}
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <cat.icon className={cn('h-5 w-5 mr-3', cat.color)} />
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="pt-4 mt-4 border-t">
          <Link
            href="/settings"
            className={cn(
              'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
              pathname === '/settings'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-gray-100'
            )}
          >
            <Settings className="h-5 w-5 mr-3" />
            Settings
          </Link>
        </div>
      </nav>

      <div className="p-4 border-t">
        {session?.user && (
          <div className="flex items-center mb-4">
            {session.user.image && (
              <Image
                src={session.user.image}
                alt=""
                width={32}
                height={32}
                className="rounded-full mr-3"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {session.user.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {session.user.email}
              </p>
            </div>
          </div>
        )}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => signOut({ callbackUrl: '/login' })}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </Button>
      </div>
    </aside>
  );
}
