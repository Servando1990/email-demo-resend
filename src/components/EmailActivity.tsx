'use client';

import { useMemo } from 'react';
import { Mail, CheckCircle, Clock, XCircle, Calendar, User, Briefcase } from 'lucide-react';
import { dataStore } from '@/lib/data';
import { EmailLog } from '@/lib/types';

interface EmailActivityProps {
  limit?: number;
}

export default function EmailActivity({ limit }: EmailActivityProps) {
  const emailLogs = dataStore.emailLogs.getAll();
  const contacts = dataStore.contacts.getAll();
  const deals = dataStore.deals.getAll();
  
  const displayedLogs = limit ? emailLogs.slice(0, limit) : emailLogs;

  const getContactName = (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId);
    return contact?.name || 'Unknown Contact';
  };

  const getDealName = (dealId?: string) => {
    if (!dealId) return null;
    const deal = deals.find(d => d.id === dealId);
    return deal?.companyName || 'Unknown Deal';
  };

  const getStatusIcon = (status: EmailLog['status']) => {
    switch (status) {
      case 'sent':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Mail className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: EmailLog['status']) => {
    const styles = {
      sent: 'bg-yellow-100 text-yellow-800',
      delivered: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getTypeIcon = (type: EmailLog['type']) => {
    switch (type) {
      case 'deal_announcement':
        return <Briefcase className="w-4 h-4 text-blue-500" />;
      case 'follow_up':
        return <User className="w-4 h-4 text-purple-500" />;
      case 'meeting_reschedule':
        return <Calendar className="w-4 h-4 text-orange-500" />;
      default:
        return <Mail className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeLabel = (type: EmailLog['type']) => {
    switch (type) {
      case 'deal_announcement':
        return 'Deal Announcement';
      case 'follow_up':
        return 'Follow-up';
      case 'meeting_reschedule':
        return 'Meeting Reschedule';
      default:
        return 'Email';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const statsData = useMemo(() => {
    const total = emailLogs.length;
    const sent = emailLogs.filter(log => log.status === 'sent').length;
    const delivered = emailLogs.filter(log => log.status === 'delivered').length;
    const failed = emailLogs.filter(log => log.status === 'failed').length;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayEmails = emailLogs.filter(log => log.sentAt >= today).length;

    return { total, sent, delivered, failed, todayEmails };
  }, [emailLogs]);

  if (!limit && emailLogs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <div className="text-center">
          <Mail className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No email activity yet</h3>
          <p className="text-gray-600">
            Email activity will appear here when you create deals or send follow-ups.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!limit && (
        <>
          {/* Email Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="text-2xl font-bold text-gray-900">{statsData.total}</div>
              <div className="text-sm text-gray-600">Total Emails</div>
            </div>
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{statsData.todayEmails}</div>
              <div className="text-sm text-gray-600">Today</div>
            </div>
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="text-2xl font-bold text-yellow-600">{statsData.sent}</div>
              <div className="text-sm text-gray-600">Sent</div>
            </div>
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="text-2xl font-bold text-green-600">{statsData.delivered}</div>
              <div className="text-sm text-gray-600">Delivered</div>
            </div>
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="text-2xl font-bold text-red-600">{statsData.failed}</div>
              <div className="text-sm text-gray-600">Failed</div>
            </div>
          </div>
        </>
      )}

      {/* Email Activity List */}
      <div className={!limit ? "bg-white rounded-lg shadow-sm border" : ""}>
        {displayedLogs.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Mail className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p>No recent email activity</p>
          </div>
        ) : (
          <div className={!limit ? "divide-y divide-gray-200" : "space-y-3"}>
            {displayedLogs.map((log, index) => {
              const dealName = getDealName(log.dealId);
              
              return (
                <div
                  key={log.id}
                  className={`${!limit ? "p-6" : "p-3 bg-white rounded border"} ${
                    index === 0 && limit ? "border-l-4 border-l-blue-500" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex items-center gap-1">
                        {getStatusIcon(log.status)}
                        {getTypeIcon(log.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {log.subject}
                          </h4>
                          {getStatusBadge(log.status)}
                        </div>
                        
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center gap-4">
                            <span>To: {getContactName(log.contactId)}</span>
                            <span>Type: {getTypeLabel(log.type)}</span>
                            {dealName && (
                              <span>Deal: {dealName}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 whitespace-nowrap ml-4">
                      {formatTimeAgo(log.sentAt)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {limit && emailLogs.length > limit && (
          <div className="mt-3 text-center">
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              View all {emailLogs.length} emails →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}