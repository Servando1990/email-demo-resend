import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/data';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existingContact = dataStore.contacts.getById(id);
    if (!existingContact) {
      return NextResponse.json(
        { success: false, error: 'Contact not found' },
        { status: 404 }
      );
    }

    // Update the contact
    const updatedContact = dataStore.contacts.update(id, body);
    
    if (!updatedContact) {
      return NextResponse.json(
        { success: false, error: 'Failed to update contact' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: updatedContact });
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update contact' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const success = dataStore.contacts.delete(id);
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Contact not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete contact' },
      { status: 500 }
    );
  }
}