import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contactId = searchParams.get('contactId');
    const dealId = searchParams.get('dealId');
    const status = searchParams.get('status');
    const limit = searchParams.get('limit');

    let emailLogs = dataStore.emailLogs.getAll();

    // Apply filters
    if (contactId) {
      emailLogs = dataStore.emailLogs.getByContactId(contactId);
    }

    if (dealId) {
      emailLogs = dataStore.emailLogs.getByDealId(dealId);
    }

    if (status && status !== 'all') {
      emailLogs = emailLogs.filter(log => log.status === status);
    }

    // Apply limit
    if (limit) {
      const limitNum = parseInt(limit, 10);
      if (!isNaN(limitNum) && limitNum > 0) {
        emailLogs = emailLogs.slice(0, limitNum);
      }
    }

    // Include contact and deal information
    const enrichedLogs = emailLogs.map(log => {
      const contact = dataStore.contacts.getById(log.contactId);
      const deal = log.dealId ? dataStore.deals.getById(log.dealId) : undefined;
      
      return {
        ...log,
        contact: contact ? {
          id: contact.id,
          name: contact.name,
          email: contact.email
        } : null,
        deal: deal ? {
          id: deal.id,
          companyName: deal.companyName,
          industry: deal.industry
        } : null
      };
    });

    return NextResponse.json({ success: true, data: enrichedLogs });
  } catch (error) {
    console.error('Error fetching email logs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch email logs' },
      { status: 500 }
    );
  }
}