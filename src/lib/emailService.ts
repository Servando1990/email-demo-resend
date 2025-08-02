import { Resend } from 'resend';
import { Contact, Deal } from './types';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export class EmailService {
  static async sendEmail(params: SendEmailParams): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'your_resend_api_key_here') {
        // Simulate email sending for demo purposes
        console.log('Demo mode: Email would be sent to:', params.to);
        console.log('Subject:', params.subject);
        console.log('Content:', params.text);
        
        return {
          success: true,
          id: `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };
      }

      const { data, error } = await resend.emails.send({
        from: 'Misha <misha@yourdomain.com>', // Replace with your verified domain
        to: params.to,
        subject: params.subject,
        html: params.html,
        text: params.text,
      });

      if (error) {
        console.error('Resend error:', error);
        return { success: false, error: error.message };
      }

      return { success: true, id: data?.id };
    } catch (error) {
      console.error('Email service error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  static generateDealAnnouncementEmail(contact: Contact, deal: Deal): EmailTemplate {
    const subject = `New ${deal.industry} Investment Opportunity - ${deal.companyName}`;
    
    const text = `Hi ${contact.name},

I hope this email finds you well. I wanted to share a new ${deal.industry} investment opportunity that aligns with your portfolio focus.

${deal.companyName} is a ${deal.stage} company in the ${deal.industry} space. ${deal.description}

Given your previous investments in ${contact.industry.join(', ')}, I thought this might be of interest.

Would you be open to a brief call to discuss this opportunity?

Best regards,
Misha Vasilchikov`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New Investment Opportunity</h2>
        
        <p>Hi ${contact.name},</p>
        
        <p>I hope this email finds you well. I wanted to share a new <strong>${deal.industry}</strong> investment opportunity that aligns with your portfolio focus.</p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e40af; margin-top: 0;">${deal.companyName}</h3>
          <p><strong>Industry:</strong> ${deal.industry}</p>
          <p><strong>Stage:</strong> ${deal.stage}</p>
          <p><strong>Description:</strong> ${deal.description}</p>
        </div>
        
        <p>Given your previous investments in <strong>${contact.industry.join(', ')}</strong>, I thought this might be of interest.</p>
        
        <p>Would you be open to a brief call to discuss this opportunity?</p>
        
        <p>Best regards,<br>
        <strong>Misha Vasilchikov</strong></p>
      </div>
    `;

    return { subject, html, text };
  }

  static generateFollowUpEmail(contact: Contact): EmailTemplate {
    const subject = `Checking in - New opportunities in your areas of interest`;
    
    const text = `Hi ${contact.name},

It's been a while since we last connected. I have several new investment opportunities that might align with your portfolio focus in ${contact.industry.join(', ')}.

Would you be open to a brief call to discuss?

Best regards,
Misha Vasilchikov`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Checking In</h2>
        
        <p>Hi ${contact.name},</p>
        
        <p>It's been a while since we last connected. I have several new investment opportunities that might align with your portfolio focus in <strong>${contact.industry.join(', ')}</strong>.</p>
        
        <p>Would you be open to a brief call to discuss?</p>
        
        <p>Best regards,<br>
        <strong>Misha Vasilchikov</strong></p>
      </div>
    `;

    return { subject, html, text };
  }

  static generateMeetingRescheduleEmail(contact: Contact): EmailTemplate {
    const subject = `Let's reschedule our meeting`;
    
    const text = `Hi ${contact.name},

I noticed we missed our scheduled meeting. No worries at all - these things happen!

Would you like to reschedule? I have some exciting new opportunities I'd love to discuss with you.

Best regards,
Misha Vasilchikov`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Let's Reschedule</h2>
        
        <p>Hi ${contact.name},</p>
        
        <p>I noticed we missed our scheduled meeting. No worries at all - these things happen!</p>
        
        <p>Would you like to reschedule? I have some exciting new opportunities I'd love to discuss with you.</p>
        
        <p>Best regards,<br>
        <strong>Misha Vasilchikov</strong></p>
      </div>
    `;

    return { subject, html, text };
  }
}