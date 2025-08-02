'use client';

import { useState, useMemo } from 'react';
import { Users, Filter, Calendar, Mail, Search, Send } from 'lucide-react';
import { dataStore } from '@/lib/data';
import { Contact } from '@/lib/types';

type StatusFilter = 'all' | 'active' | 'stale' | 'recent';

export default function ContactList() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');

  const contacts = dataStore.contacts.getAll();
  
  // Get unique industries from contacts
  const industries = useMemo(() => {
    const allIndustries = contacts.flatMap(contact => contact.industry);
    return Array.from(new Set(allIndustries)).sort();
  }, [contacts]);

  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      // Status filter
      if (statusFilter !== 'all' && contact.status !== statusFilter) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = contact.name.toLowerCase().includes(query);
        const matchesEmail = contact.email.toLowerCase().includes(query);
        if (!matchesName && !matchesEmail) {
          return false;
        }
      }

      // Industry filter
      if (selectedIndustry && !contact.industry.includes(selectedIndustry)) {
        return false;
      }

      return true;
    });
  }, [contacts, statusFilter, searchQuery, selectedIndustry]);

  const getStatusBadge = (status: Contact['status']) => {
    const styles = {
      active: 'bg-blue-100 text-blue-800',
      stale: 'bg-red-100 text-red-800',
      recent: 'bg-green-100 text-green-800'
    };

    const labels = {
      active: 'Active',
      stale: 'Stale',
      recent: 'Recent'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const formatLastContact = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const getStatusCounts = () => {
    return {
      all: contacts.length,
      active: contacts.filter(c => c.status === 'active').length,
      stale: contacts.filter(c => c.status === 'stale').length,
      recent: contacts.filter(c => c.status === 'recent').length
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="space-y-6">
      {/* Header with Action Buttons */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Contact Management
          </h2>
          <p className="text-gray-600 mt-1">
            {filteredContacts.length} of {contacts.length} contacts
          </p>
        </div>
        
        <div className="flex gap-3">
          <StaleContactCampaign staleCount={statusCounts.stale} />
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Add Contact
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filters</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Industry Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Industry
            </label>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Industries</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <div className="flex gap-2">
              {([
                { key: 'all', label: 'All', count: statusCounts.all },
                { key: 'active', label: 'Active', count: statusCounts.active },
                { key: 'stale', label: 'Stale', count: statusCounts.stale },
                { key: 'recent', label: 'Recent', count: statusCounts.recent }
              ] as const).map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setStatusFilter(key)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    statusFilter === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {label} ({count})
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contact List */}
      <div className="bg-white rounded-lg shadow-sm border">
        {filteredContacts.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts found</h3>
            <p className="text-gray-600">
              {searchQuery || selectedIndustry || statusFilter !== 'all'
                ? 'Try adjusting your filters to see more contacts.'
                : 'Start by adding your first investor contact.'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Industries
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {contact.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {contact.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {contact.industry.map((industry) => (
                          <span
                            key={industry}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                          >
                            {industry}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(contact.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatLastContact(contact.lastContactDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button className="text-blue-600 hover:text-blue-800 p-1 rounded">
                          <Mail className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-800 text-xs">
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StaleContactCampaign({ staleCount }: { staleCount: number }) {
  const [isSending, setIsSending] = useState(false);
  const [lastSent, setLastSent] = useState<Date | null>(null);

  const handleSendStaleFollowUp = async () => {
    if (staleCount === 0) return;

    setIsSending(true);
    try {
      const response = await fetch('/api/emails/campaign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'stale_follow_up'
        })
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('Stale contact campaign sent:', result.data);
        setLastSent(new Date());
        // Could show a toast notification here
      } else {
        console.error('Campaign failed:', result.error);
      }
    } catch (error) {
      console.error('Error sending campaign:', error);
    } finally {
      setIsSending(false);
    }
  };

  if (staleCount === 0) {
    return null;
  }

  return (
    <button
      onClick={handleSendStaleFollowUp}
      disabled={isSending}
      className={`px-4 py-2 rounded-lg border transition-colors ${
        isSending
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-orange-50 border-orange-200 text-orange-800 hover:bg-orange-100'
      }`}
    >
      <div className="flex items-center gap-2">
        {isSending ? (
          <div className="w-4 h-4 border-2 border-gray-300 border-t-orange-600 rounded-full animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
        <span className="text-sm">
          {isSending ? 'Sending...' : `Follow-up ${staleCount} Stale Contacts`}
        </span>
      </div>
      {lastSent && (
        <div className="text-xs text-orange-600 mt-1">
          Last sent: {lastSent.toLocaleTimeString()}
        </div>
      )}
    </button>
  );
}