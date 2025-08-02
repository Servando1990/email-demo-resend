import { Contact, Deal, EmailLog, DashboardMetrics } from './types';

let contacts: Contact[] = [];
let deals: Deal[] = [];
let emailLogs: EmailLog[] = [];

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

function calculateContactStatus(lastContactDate: Date): 'active' | 'stale' | 'recent' {
  const daysSinceContact = Math.floor((Date.now() - lastContactDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysSinceContact <= 7) return 'recent';
  if (daysSinceContact >= 30) return 'stale';
  return 'active';
}

export const dataStore = {
  // Contact operations
  contacts: {
    getAll: (): Contact[] => contacts,
    
    getById: (id: string): Contact | undefined => 
      contacts.find(contact => contact.id === id),
    
    getByIndustry: (industry: string): Contact[] =>
      contacts.filter(contact => contact.industry.includes(industry)),
    
    getStaleContacts: (): Contact[] =>
      contacts.filter(contact => contact.status === 'stale'),
    
    create: (contactData: Omit<Contact, 'id' | 'status'>): Contact => {
      const contact: Contact = {
        ...contactData,
        id: generateId(),
        status: calculateContactStatus(contactData.lastContactDate)
      };
      contacts.push(contact);
      return contact;
    },
    
    update: (id: string, updates: Partial<Contact>): Contact | null => {
      const index = contacts.findIndex(contact => contact.id === id);
      if (index === -1) return null;
      
      contacts[index] = { 
        ...contacts[index], 
        ...updates,
        status: updates.lastContactDate 
          ? calculateContactStatus(updates.lastContactDate) 
          : contacts[index].status
      };
      return contacts[index];
    },
    
    delete: (id: string): boolean => {
      const index = contacts.findIndex(contact => contact.id === id);
      if (index === -1) return false;
      contacts.splice(index, 1);
      return true;
    }
  },

  // Deal operations
  deals: {
    getAll: (): Deal[] => deals,
    
    getById: (id: string): Deal | undefined =>
      deals.find(deal => deal.id === id),
    
    create: (dealData: Omit<Deal, 'id' | 'createdAt'>): Deal => {
      const deal: Deal = {
        ...dealData,
        id: generateId(),
        createdAt: new Date()
      };
      deals.push(deal);
      return deal;
    },
    
    update: (id: string, updates: Partial<Deal>): Deal | null => {
      const index = deals.findIndex(deal => deal.id === id);
      if (index === -1) return null;
      
      deals[index] = { ...deals[index], ...updates };
      return deals[index];
    },
    
    delete: (id: string): boolean => {
      const index = deals.findIndex(deal => deal.id === id);
      if (index === -1) return false;
      deals.splice(index, 1);
      return true;
    }
  },

  // Email log operations
  emailLogs: {
    getAll: (): EmailLog[] => emailLogs.sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime()),
    
    getById: (id: string): EmailLog | undefined =>
      emailLogs.find(log => log.id === id),
    
    getByContactId: (contactId: string): EmailLog[] =>
      emailLogs.filter(log => log.contactId === contactId),
    
    getByDealId: (dealId: string): EmailLog[] =>
      emailLogs.filter(log => log.dealId === dealId),
    
    getTodaysEmails: (): EmailLog[] => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return emailLogs.filter(log => log.sentAt >= today);
    },
    
    create: (logData: Omit<EmailLog, 'id' | 'sentAt'>): EmailLog => {
      const emailLog: EmailLog = {
        ...logData,
        id: generateId(),
        sentAt: new Date()
      };
      emailLogs.push(emailLog);
      return emailLog;
    },
    
    updateStatus: (id: string, status: EmailLog['status']): EmailLog | null => {
      const index = emailLogs.findIndex(log => log.id === id);
      if (index === -1) return null;
      
      emailLogs[index].status = status;
      return emailLogs[index];
    }
  },

  // Analytics and metrics
  metrics: {
    getDashboardMetrics: (): DashboardMetrics => {
      const todaysEmails = emailLogs.filter(log => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return log.sentAt >= today;
      });

      const deliveredEmails = emailLogs.filter(log => log.status === 'delivered');
      const responseRate = emailLogs.length > 0 
        ? Math.round((deliveredEmails.length / emailLogs.length) * 100) 
        : 0;

      return {
        emailsSentToday: todaysEmails.length,
        totalContacts: contacts.length,
        activeDeals: deals.length,
        responseRate
      };
    }
  },

  // Utility methods
  utils: {
    reset: (): void => {
      contacts = [];
      deals = [];
      emailLogs = [];
    },
    
    updateContactStatuses: (): void => {
      contacts.forEach(contact => {
        contact.status = calculateContactStatus(contact.lastContactDate);
      });
    }
  }
};