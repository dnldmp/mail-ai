import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { fetchGmailMessages, parseGmailMessage } from '@/lib/gmail';
import { classifyEmail } from '@/lib/ai';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const messages = await fetchGmailMessages(session.user.id, 50);
    const results = {
      synced: 0,
      skipped: 0,
      errors: 0,
    };

    for (const message of messages) {
      try {
        const parsed = parseGmailMessage(message);
        
        // Check if email already exists
        const existing = await prisma.email.findUnique({
          where: { externalId: parsed.externalId },
        });

        if (existing) {
          results.skipped++;
          continue;
        }

        // Classify the email
        const classification = await classifyEmail(
          parsed.subject,
          parsed.body,
          parsed.from
        );

        // Save to database
        await prisma.email.create({
          data: {
            ...parsed,
            userId: session.user.id,
            category: classification.category,
            suggestedReply: classification.suggestedReply,
            provider: 'gmail',
          },
        });

        results.synced++;
      } catch (error) {
        console.error('Error processing message:', error);
        results.errors++;
      }
    }

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { error: 'Failed to sync emails' },
      { status: 500 }
    );
  }
}
