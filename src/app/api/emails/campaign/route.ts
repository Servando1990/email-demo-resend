import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/data';
import { EmailService } from '@/lib/emailService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { dealId, type } = body;

    if (type === 'deal_announcement' && dealId) {
      // Send deal announcement to matching contacts
      const allDeals = dataStore.deals.getAll();
      const deal = dataStore.deals.getById(dealId);
      
      console.log('Debug - Campaign dealId:', dealId);
      console.log('Debug - All deals:', allDeals.map(d => ({ id: d.id, name: d.companyName })));
      console.log('Debug - Found deal:', deal ? deal.companyName : 'NOT FOUND');
      
      if (!deal) {
        return NextResponse.json(
          { 
            success: false, 
            error: `Deal not found with ID: ${dealId}`,
            debug: {
              searchedId: dealId,
              availableDeals: allDeals.map(d => ({ id: d.id, name: d.companyName }))
            }
          },
          { status: 404 }
        );
      }

      // Find contacts interested in this industry
      const allContacts = dataStore.contacts.getAll();
      const matchingContacts = dataStore.contacts.getByIndustry(deal.industry);
      
      console.log('Debug - Deal industry:', deal.industry);
      console.log('Debug - All contacts:', allContacts.map(c => ({ name: c.name, industry: c.industry })));
      console.log('Debug - Matching contacts:', matchingContacts.length);
      
      if (matchingContacts.length === 0) {
        return NextResponse.json(
          { 
            success: false, 
            error: `No matching contacts found for industry "${deal.industry}". Available contacts: ${allContacts.length}`,
            debug: {
              dealIndustry: deal.industry,
              totalContacts: allContacts.length,
              contactIndustries: allContacts.map(c => c.industry)
            }
          },
          { status: 404 }
        );
      }

      const results = [];
      const errors = [];

      // Send emails to all matching contacts
      for (const contact of matchingContacts) {
        try {
          const emailTemplate = EmailService.generateDealAnnouncementEmail(contact, deal);
          
          const emailResult = await EmailService.sendEmail({
            to: contact.email,
            subject: emailTemplate.subject,
            html: emailTemplate.html,
            text: emailTemplate.text
          });

          if (emailResult.success) {
            // Log the email
            const emailLog = dataStore.emailLogs.create({
              contactId: contact.id,
              dealId: deal.id,
              subject: emailTemplate.subject,
              status: 'sent',
              type: 'deal_announcement'
            });

            // Update contact's last contact date
            dataStore.contacts.update(contact.id, {
              lastContactDate: new Date()
            });

            results.push({
              contactId: contact.id,
              contactName: contact.name,
              contactEmail: contact.email,
              emailLogId: emailLog.id,
              status: 'sent'
            });

            // Simulate delivery status update
            setTimeout(() => {
              const success = Math.random() > 0.1; // 90% success rate simulation
              dataStore.emailLogs.updateStatus(emailLog.id, success ? 'delivered' : 'failed');
            }, Math.random() * 5000 + 1000); // Random delay between 1-6 seconds
          } else {
            errors.push({
              contactId: contact.id,
              contactName: contact.name,
              contactEmail: contact.email,
              error: emailResult.error
            });
          }
        } catch (contactError) {
          errors.push({
            contactId: contact.id,
            contactName: contact.name,
            contactEmail: contact.email,
            error: contactError instanceof Error ? contactError.message : 'Unknown error'
          });
        }
      }

      return NextResponse.json({
        success: true,
        data: {
          dealId,
          dealName: deal.companyName,
          industry: deal.industry,
          totalContacts: matchingContacts.length,
          successfulSends: results.length,
          failedSends: errors.length,
          results,
          errors
        }
      });

    } else if (type === 'stale_follow_up') {
      // Send follow-up emails to stale contacts
      const staleContacts = dataStore.contacts.getStaleContacts();
      
      if (staleContacts.length === 0) {
        return NextResponse.json(
          { success: false, error: 'No stale contacts found' },
          { status: 404 }
        );
      }

      const results = [];
      const errors = [];

      for (const contact of staleContacts) {
        try {
          const emailTemplate = EmailService.generateFollowUpEmail(contact);
          
          const emailResult = await EmailService.sendEmail({
            to: contact.email,
            subject: emailTemplate.subject,
            html: emailTemplate.html,
            text: emailTemplate.text
          });

          if (emailResult.success) {
            const emailLog = dataStore.emailLogs.create({
              contactId: contact.id,
              subject: emailTemplate.subject,
              status: 'sent',
              type: 'follow_up'
            });

            dataStore.contacts.update(contact.id, {
              lastContactDate: new Date()
            });

            results.push({
              contactId: contact.id,
              contactName: contact.name,
              contactEmail: contact.email,
              emailLogId: emailLog.id,
              status: 'sent'
            });

            // Simulate delivery status update
            setTimeout(() => {
              const success = Math.random() > 0.1;
              dataStore.emailLogs.updateStatus(emailLog.id, success ? 'delivered' : 'failed');
            }, Math.random() * 5000 + 1000);
          } else {
            errors.push({
              contactId: contact.id,
              contactName: contact.name,
              contactEmail: contact.email,
              error: emailResult.error
            });
          }
        } catch (contactError) {
          errors.push({
            contactId: contact.id,
            contactName: contact.name,
            contactEmail: contact.email,
            error: contactError instanceof Error ? contactError.message : 'Unknown error'
          });
        }
      }

      return NextResponse.json({
        success: true,
        data: {
          type: 'stale_follow_up',
          totalContacts: staleContacts.length,
          successfulSends: results.length,
          failedSends: errors.length,
          results,
          errors
        }
      });

    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid campaign type or missing required parameters' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error sending campaign:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send campaign' },
      { status: 500 }
    );
  }
}