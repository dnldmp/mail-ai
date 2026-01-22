import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { classifyEmail, generateSuggestedReply } from '@/lib/ai';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { subject, emailBody, from, action } = body;

    if (!subject || !emailBody || !from) {
      return NextResponse.json(
        { error: 'Subject, body, and from are required' },
        { status: 400 }
      );
    }

    if (action === 'classify') {
      const classification = await classifyEmail(subject, emailBody, from);
      return NextResponse.json(classification);
    }

    if (action === 'suggest-reply') {
      const suggestedReply = await generateSuggestedReply(subject, emailBody, from);
      return NextResponse.json({ suggestedReply });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('AI processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process with AI' },
      { status: 500 }
    );
  }
}
