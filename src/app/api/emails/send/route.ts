import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/data';
import { EmailService } from '@/lib/emailService';
import { EmailLog } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contactId, dealId, type, subject, customMessage } = body;

    // Validation
    const contact = dataStore.contacts.getById(contactId);
    if (!contact) {
      return NextResponse.json(
        { success: false, error: 'Contact not found' },
        { status: 404 }
      );
    }

    let emailTemplate;
    let emailType: EmailLog['type'] = 'follow_up';

    if (type === 'deal_announcement' && dealId) {
      const deal = dataStore.deals.getById(dealId);
      if (!deal) {
        return NextResponse.json(
          { success: false, error: 'Deal not found' },
          { status: 404 }
        );
      }
      emailTemplate = EmailService.generateDealAnnouncementEmail(contact, deal);
      emailType = 'deal_announcement';
    } else if (type === 'follow_up') {
      emailTemplate = EmailService.generateFollowUpEmail(contact);
      emailType = 'follow_up';
    } else if (type === 'meeting_reschedule') {
      emailTemplate = EmailService.generateMeetingRescheduleEmail(contact);
      emailType = 'meeting_reschedule';
    } else if (type === 'custom' && subject && customMessage) {
      emailTemplate = {
        subject,
        text: customMessage,
        html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <p>Hi ${contact.name},</p>
          <div style="white-space: pre-line;">${customMessage}</div>
          <p>Best regards,<br><strong>Misha Vasilchikov</strong></p>
        </div>`
      };
      emailType = 'follow_up';
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid email type or missing required fields' },
        { status: 400 }
      );
    }

    // Send the email
    const emailResult = await EmailService.sendEmail({
      to: contact.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
      text: emailTemplate.text
    });

    if (!emailResult.success) {
      return NextResponse.json(
        { success: false, error: emailResult.error || 'Failed to send email' },
        { status: 500 }
      );
    }

    // Log the email
    const emailLog = dataStore.emailLogs.create({
      contactId,
      dealId: dealId || undefined,
      subject: emailTemplate.subject,
      status: 'sent',
      type: emailType
    });

    // Update contact's last contact date
    dataStore.contacts.update(contactId, {
      lastContactDate: new Date()
    });

    // Simulate delivery status update (in real app, this would be handled by webhooks)
    setTimeout(() => {
      const success = Math.random() > 0.1; // 90% success rate simulation
      dataStore.emailLogs.updateStatus(emailLog.id, success ? 'delivered' : 'failed');
    }, 2000);

    return NextResponse.json({
      success: true,
      data: {
        emailLog,
        emailId: emailResult.id
      }
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send email' },
      { status: 500 }
    );
  }
}