'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AutomationRule } from '@/types';
import { Plus, Trash2, Save, Settings as SettingsIcon } from 'lucide-react';

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [newRule, setNewRule] = useState({
    name: '',
    condition: '',
    action: 'archive',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const addRule = () => {
    if (!newRule.name || !newRule.condition) return;

    const rule: AutomationRule = {
      id: Date.now().toString(),
      userId: session?.user?.id || '',
      name: newRule.name,
      condition: newRule.condition,
      action: newRule.action,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setRules([...rules, rule]);
    setNewRule({ name: '', condition: '', action: 'archive' });
  };

  const deleteRule = (id: string) => {
    setRules(rules.filter((rule) => rule.id !== id));
  };

  const toggleRule = (id: string) => {
    setRules(
      rules.map((rule) =>
        rule.id === id ? { ...rule, isActive: !rule.isActive } : rule
      )
    );
  };

  if (status === 'loading') {
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
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <SettingsIcon className="h-6 w-6 mr-2" />
              Settings
            </h1>
            <p className="text-gray-500">Configure your email automation rules</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent>
              {session?.user && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Name</label>
                    <p className="text-gray-900">{session.user.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="text-gray-900">{session.user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Connected Providers
                    </label>
                    <p className="text-gray-900">Google (Gmail)</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Automation Rules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-500">
                Create rules to automatically organize your emails. Rules are applied when new emails arrive.
              </p>

              <div className="grid gap-4 md:grid-cols-4">
                <Input
                  placeholder="Rule name"
                  value={newRule.name}
                  onChange={(e) =>
                    setNewRule({ ...newRule, name: e.target.value })
                  }
                />
                <Input
                  placeholder="Condition (e.g., from:newsletter@)"
                  value={newRule.condition}
                  onChange={(e) =>
                    setNewRule({ ...newRule, condition: e.target.value })
                  }
                />
                <select
                  value={newRule.action}
                  onChange={(e) =>
                    setNewRule({ ...newRule, action: e.target.value })
                  }
                  className="h-10 px-3 rounded-md border border-gray-300 bg-white text-sm"
                >
                  <option value="archive">Archive</option>
                  <option value="mark_read">Mark as Read</option>
                  <option value="star">Star</option>
                  <option value="categorize_promotional">Categorize as Promotional</option>
                  <option value="categorize_spam">Categorize as Spam</option>
                </select>
                <Button onClick={addRule}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Rule
                </Button>
              </div>

              <div className="border rounded-lg divide-y">
                {rules.length === 0 ? (
                  <p className="p-4 text-center text-gray-500">
                    No automation rules yet. Create one above.
                  </p>
                ) : (
                  rules.map((rule) => (
                    <div
                      key={rule.id}
                      className="p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          checked={rule.isActive}
                          onChange={() => toggleRule(rule.id)}
                          className="rounded border-gray-300"
                        />
                        <div>
                          <p className="font-medium">{rule.name}</p>
                          <p className="text-sm text-gray-500">
                            If {rule.condition} → {rule.action}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteRule(rule.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))
                )}
              </div>

              {rules.length > 0 && (
                <div className="flex justify-end">
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Save Rules
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Classification Sensitivity
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="70"
                  className="w-full"
                />
                <p className="text-xs text-gray-500">
                  Higher values mean more emails will be classified as important
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-generate Reply Suggestions</p>
                  <p className="text-sm text-gray-500">
                    AI will suggest replies for incoming emails
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-gray-300"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Smart Categorization</p>
                  <p className="text-sm text-gray-500">
                    Automatically categorize emails using AI
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-gray-300"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
