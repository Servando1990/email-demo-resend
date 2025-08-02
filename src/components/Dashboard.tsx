'use client';

import { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  Mail, 
  PlusCircle, 
  Activity,
  TrendingUp,
  Briefcase
} from 'lucide-react';
import DealForm from './DealForm';
import ContactList from './ContactList';
import EmailActivity from './EmailActivity';
import DashboardMetrics from './DashboardMetrics';

type ActiveTab = 'overview' | 'deals' | 'contacts' | 'emails';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'deals', label: 'Deals', icon: Briefcase },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'emails', label: 'Email Activity', icon: Mail },
  ] as const;

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
              <p className="text-gray-600">Monitor your investor outreach automation</p>
            </div>
            <DashboardMetrics />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  Recent Email Activity
                </h3>
                <EmailActivity limit={5} />
              </div>
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setActiveTab('deals')}
                    className="w-full p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <PlusCircle className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="font-medium text-blue-900">Add New Deal</div>
                        <div className="text-sm text-blue-600">Create a new investment opportunity</div>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('contacts')}
                    className="w-full p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="font-medium text-green-900">Manage Contacts</div>
                        <div className="text-sm text-green-600">View and update investor contacts</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'deals':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Deal Management</h1>
              <p className="text-gray-600">Add new investment opportunities and track existing deals</p>
            </div>
            <DealForm />
          </div>
        );
      case 'contacts':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Contact Management</h1>
              <p className="text-gray-600">Manage your investor contacts and track engagement</p>
            </div>
            <ContactList />
          </div>
        );
      case 'emails':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Email Activity</h1>
              <p className="text-gray-600">Monitor email campaigns and engagement metrics</p>
            </div>
            <EmailActivity />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="px-6 py-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Email Demo</h2>
            <p className="text-sm text-gray-500">Investor Outreach</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as ActiveTab)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="px-6 py-4 border-t">
            <div className="text-xs text-gray-500">
              <div>Powered by Resend API</div>
              <div className="mt-1">Built with Next.js</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        <main className="px-8 py-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}