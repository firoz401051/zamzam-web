import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getUserByClerkId } from '@/lib/employee-utils';
import { verifyEmailConfig } from '@/lib/email';

// GET /api/email/verify - Verify email configuration
export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserByClerkId(userId);
    if (!user || user.employeeRole !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const isValid = await verifyEmailConfig();

    return NextResponse.json({
      valid: isValid,
      message: isValid ? 'Email configuration is valid' : 'Email configuration failed verification',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Email verification API error:', error);
    return NextResponse.json(
      { error: 'Failed to verify email configuration' },
      { status: 500 }
    );
  }
}