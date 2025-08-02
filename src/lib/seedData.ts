import { dataStore } from './data';

export function seedDemoData() {
  // Clear existing data
  dataStore.utils.reset();

  // Seed contacts with realistic investor data
  const sampleContacts = [
    {
      name: 'John Smith',
      email: 'john@familyoffice.com',
      industry: ['CleanTech', 'AI'],
      lastContactDate: new Date('2024-06-01')
    },
    {
      name: 'Sarah Chen',
      email: 'sarah@techvcfund.com',
      industry: ['AI', 'SaaS'],
      lastContactDate: new Date('2024-07-25')
    },
    {
      name: 'Michael Rodriguez',
      email: 'michael@greeninvest.com',
      industry: ['CleanTech', 'Real Estate'],
      lastContactDate: new Date('2024-05-15')
    },
    {
      name: 'Emily Watson',
      email: 'emily@consumervc.com',
      industry: ['CPG', 'HealthTech'],
      lastContactDate: new Date('2024-07-30')
    },
    {
      name: 'David Kim',
      email: 'david@fintech.capital',
      industry: ['FinTech', 'SaaS'],
      lastContactDate: new Date('2024-04-20')
    },
    {
      name: 'Lisa Thompson',
      email: 'lisa@proptech.ventures',
      industry: ['Real Estate', 'AI'],
      lastContactDate: new Date('2024-07-28')
    },
    {
      name: 'Robert Taylor',
      email: 'robert@healthcare.fund',
      industry: ['HealthTech', 'AI'],
      lastContactDate: new Date('2024-03-10')
    },
    {
      name: 'Jennifer Lee',
      email: 'jennifer@edtech.investors',
      industry: ['EdTech', 'SaaS'],
      lastContactDate: new Date('2024-07-20')
    }
  ];

  sampleContacts.forEach(contact => {
    dataStore.contacts.create(contact);
  });

  // Seed some sample deals
  const sampleDeals = [
    {
      companyName: 'SolarTech Inc',
      industry: 'CleanTech',
      stage: 'Series A',
      description: 'Revolutionary solar panel technology with 40% efficiency gains over traditional panels'
    },
    {
      companyName: 'AIConsult Pro',
      industry: 'AI',
      stage: 'Seed',
      description: 'AI-powered business consulting platform for small to medium enterprises'
    },
    {
      companyName: 'EcoPackaging Solutions',
      industry: 'CPG',
      stage: 'Series B',
      description: 'Biodegradable packaging materials made from agricultural waste'
    }
  ];

  sampleDeals.forEach(deal => {
    dataStore.deals.create(deal);
  });

  // Seed some email logs
  const sampleEmailLogs = [
    {
      contactId: dataStore.contacts.getAll()[0].id,
      dealId: dataStore.deals.getAll()[0].id,
      subject: 'New CleanTech Investment Opportunity - SolarTech Inc',
      status: 'delivered' as const,
      type: 'deal_announcement' as const
    },
    {
      contactId: dataStore.contacts.getAll()[1].id,
      dealId: dataStore.deals.getAll()[1].id,
      subject: 'New AI Investment Opportunity - AIConsult Pro',
      status: 'sent' as const,
      type: 'deal_announcement' as const
    },
    {
      contactId: dataStore.contacts.getAll()[4].id,
      subject: 'Checking in - New opportunities in your areas of interest',
      status: 'delivered' as const,
      type: 'follow_up' as const
    }
  ];

  sampleEmailLogs.forEach(log => {
    // Manually set sentAt to various times today
    const emailLog = dataStore.emailLogs.create(log);
    const today = new Date();
    emailLog.sentAt = new Date(today.getTime() - Math.random() * 8 * 60 * 60 * 1000); // Random time within last 8 hours
  });

  console.log('Demo data seeded successfully!');
  console.log(`Contacts: ${dataStore.contacts.getAll().length}`);
  console.log(`Deals: ${dataStore.deals.getAll().length}`);
  console.log(`Email Logs: ${dataStore.emailLogs.getAll().length}`);
}