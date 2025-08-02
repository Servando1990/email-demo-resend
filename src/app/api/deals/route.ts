import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/data';
import { INDUSTRIES, DEAL_STAGES } from '@/lib/types';

export async function GET() {
  try {
    const deals = dataStore.deals.getAll();
    return NextResponse.json({ success: true, data: deals });
  } catch (error) {
    console.error('Error fetching deals:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch deals' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyName, industry, stage, description } = body;

    // Validation
    const errors: string[] = [];
    
    if (!companyName || typeof companyName !== 'string' || companyName.trim().length < 2) {
      errors.push('Company name must be at least 2 characters long');
    }
    
    if (!industry || !INDUSTRIES.includes(industry)) {
      errors.push('Valid industry is required');
    }
    
    if (!stage || !DEAL_STAGES.includes(stage)) {
      errors.push('Valid deal stage is required');
    }
    
    if (!description || typeof description !== 'string' || description.trim().length < 10) {
      errors.push('Description must be at least 10 characters long');
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, errors },
        { status: 400 }
      );
    }

    // Create the deal
    const newDeal = dataStore.deals.create({
      companyName: companyName.trim(),
      industry,
      stage,
      description: description.trim()
    });

    // TODO: Trigger email automation here
    // This will be implemented when we create the email automation logic
    // triggerDealEmailAutomation(newDeal);

    return NextResponse.json(
      { success: true, data: newDeal },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating deal:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create deal' },
      { status: 500 }
    );
  }
}