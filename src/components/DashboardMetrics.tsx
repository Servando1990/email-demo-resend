'use client';

import { useMemo } from 'react';
import { TrendingUp, Mail, Users, Briefcase } from 'lucide-react';
import { dataStore } from '@/lib/data';

export default function DashboardMetrics() {
  const metrics = useMemo(() => {
    const dashboardMetrics = dataStore.metrics.getDashboardMetrics();
    const contacts = dataStore.contacts.getAll();
    const emailLogs = dataStore.emailLogs.getAll();
    
    // Calculate additional metrics
    const staleContacts = contacts.filter(c => c.status === 'stale').length;
    const recentContacts = contacts.filter(c => c.status === 'recent').length;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayEmails = emailLogs.filter(log => log.sentAt >= today);
    const deliveredToday = todayEmails.filter(log => log.status === 'delivered').length;
    
    return {
      ...dashboardMetrics,
      staleContacts,
      recentContacts,
      deliveredToday
    };
  }, []);

  const metricCards = [
    {
      title: 'Active Deals',
      value: metrics.activeDeals,
      icon: Briefcase,
      color: 'blue',
      description: 'Investment opportunities',
      trend: 'Active deals'
    },
    {
      title: 'Total Contacts',
      value: metrics.totalContacts,
      icon: Users,
      color: 'green',
      description: 'Investor contacts',
      trend: `${metrics.staleContacts} stale`
    },
    {
      title: 'Emails Today',
      value: metrics.emailsSentToday,
      icon: Mail,
      color: 'purple',
      description: 'Sent today',
      trend: `${metrics.deliveredToday} delivered`
    },
    {
      title: 'Success Rate',
      value: `${metrics.responseRate}%`,
      icon: TrendingUp,
      color: 'orange',
      description: 'Email delivery rate',
      trend: 'Overall rate'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: {
        bg: 'bg-blue-50',
        icon: 'text-blue-600',
        border: 'border-blue-200'
      },
      green: {
        bg: 'bg-green-50',
        icon: 'text-green-600',
        border: 'border-green-200'
      },
      purple: {
        bg: 'bg-purple-50',
        icon: 'text-purple-600',
        border: 'border-purple-200'
      },
      orange: {
        bg: 'bg-orange-50',
        icon: 'text-orange-600',
        border: 'border-orange-200'
      }
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricCards.map((metric) => {
        const Icon = metric.icon;
        const colors = getColorClasses(metric.color);
        
        return (
          <div
            key={metric.title}
            className={`bg-white rounded-lg border ${colors.border} p-6 hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${colors.bg}`}>
                    <Icon className={`w-5 h-5 ${colors.icon}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">{metric.title}</h3>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-gray-900">
                    {metric.value}
                  </div>
                  <div className="text-sm text-gray-600">
                    {metric.description}
                  </div>
                  <div className="text-xs text-gray-500">
                    {metric.trend}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}