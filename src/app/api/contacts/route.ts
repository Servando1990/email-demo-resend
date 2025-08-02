import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/data';
import { INDUSTRIES } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const industry = searchParams.get('industry');
    const status = searchParams.get('status');
    
    let contacts = dataStore.contacts.getAll();

    // Apply filters
    if (industry) {
      contacts = contacts.filter(contact => contact.industry.includes(industry));
    }

    if (status && status !== 'all') {
      contacts = contacts.filter(contact => contact.status === status);
    }

    return NextResponse.json({ success: true, data: contacts });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, industry, lastContactDate } = body;

    // Validation
    const errors: string[] = [];
    
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }
    
    if (!email || typeof email !== 'string' || !isValidEmail(email)) {
      errors.push('Valid email address is required');
    }
    
    if (!industry || !Array.isArray(industry) || industry.length === 0) {
      errors.push('At least one industry is required');
    } else {
      const invalidIndustries = industry.filter(ind => !INDUSTRIES.includes(ind));
      if (invalidIndustries.length > 0) {
        errors.push(`Invalid industries: ${invalidIndustries.join(', ')}`);
      }
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, errors },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingContact = dataStore.contacts.getAll().find(c => c.email === email);
    if (existingContact) {
      return NextResponse.json(
        { success: false, error: 'Contact with this email already exists' },
        { status: 409 }
      );
    }

    // Create the contact
    const newContact = dataStore.contacts.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      industry,
      lastContactDate: lastContactDate ? new Date(lastContactDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Default to 30 days ago
    });

    return NextResponse.json(
      { success: true, data: newContact },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create contact' },
      { status: 500 }
    );
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}