import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { EmailCategory } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') as EmailCategory | null;
    const isRead = searchParams.get('isRead');
    const isStarred = searchParams.get('isStarred');
    const isArchived = searchParams.get('isArchived');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    interface WhereClause {
      userId: string;
      category?: EmailCategory;
      isRead?: boolean;
      isStarred?: boolean;
      isArchived?: boolean;
      OR?: Array<{
        subject?: { contains: string; mode: 'insensitive' };
        body?: { contains: string; mode: 'insensitive' };
        from?: { contains: string; mode: 'insensitive' };
      }>;
    }

    const where: WhereClause = {
      userId: session.user.id,
    };

    if (category) where.category = category;
    if (isRead !== null && isRead !== undefined) where.isRead = isRead === 'true';
    if (isStarred !== null && isStarred !== undefined) where.isStarred = isStarred === 'true';
    if (isArchived !== null && isArchived !== undefined) where.isArchived = isArchived === 'true';
    if (search) {
      where.OR = [
        { subject: { contains: search, mode: 'insensitive' } },
        { body: { contains: search, mode: 'insensitive' } },
        { from: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [emails, total] = await Promise.all([
      prisma.email.findMany({
        where,
        orderBy: { receivedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.email.count({ where }),
    ]);

    return NextResponse.json({
      emails,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching emails:', error);
    return NextResponse.json(
      { error: 'Failed to fetch emails' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, isRead, isStarred, isArchived } = body;

    if (!id) {
      return NextResponse.json({ error: 'Email ID required' }, { status: 400 });
    }

    const email = await prisma.email.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!email) {
      return NextResponse.json({ error: 'Email not found' }, { status: 404 });
    }

    const updated = await prisma.email.update({
      where: { id },
      data: {
        ...(isRead !== undefined && { isRead }),
        ...(isStarred !== undefined && { isStarred }),
        ...(isArchived !== undefined && { isArchived }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating email:', error);
    return NextResponse.json(
      { error: 'Failed to update email' },
      { status: 500 }
    );
  }
}
