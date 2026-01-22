import { google } from 'googleapis';
import { prisma } from './prisma';

export interface GmailMessage {
  id: string;
  threadId: string;
  labelIds: string[];
  snippet: string;
  payload: {
    headers: Array<{ name: string; value: string }>;
    body?: { data?: string };
    parts?: Array<{ mimeType: string; body?: { data?: string } }>;
  };
  internalDate: string;
}

export async function getGmailClient(userId: string) {
  const account = await prisma.account.findFirst({
    where: {
      userId,
      provider: 'google',
    },
  });

  if (!account?.access_token) {
    throw new Error('No Google account found');
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oauth2Client.setCredentials({
    access_token: account.access_token,
    refresh_token: account.refresh_token,
  });

  return google.gmail({ version: 'v1', auth: oauth2Client });
}

export async function fetchGmailMessages(userId: string, maxResults = 50) {
  const gmail = await getGmailClient(userId);
  
  const response = await gmail.users.messages.list({
    userId: 'me',
    maxResults,
  });

  const messages = response.data.messages || [];
  const fullMessages: GmailMessage[] = [];

  for (const message of messages) {
    if (message.id) {
      const fullMessage = await gmail.users.messages.get({
        userId: 'me',
        id: message.id,
        format: 'full',
      });
      fullMessages.push(fullMessage.data as GmailMessage);
    }
  }

  return fullMessages;
}

export function parseGmailMessage(message: GmailMessage) {
  const headers = message.payload.headers;
  const getHeader = (name: string) => 
    headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || '';

  // Helper to decode base64 email content
  const decodeBase64 = (data: string): string => 
    Buffer.from(data, 'base64').toString('utf-8');

  let body = '';
  if (message.payload.body?.data) {
    body = decodeBase64(message.payload.body.data);
  } else if (message.payload.parts) {
    const textPart = message.payload.parts.find(p => p.mimeType === 'text/plain');
    if (textPart?.body?.data) {
      body = decodeBase64(textPart.body.data);
    }
  }

  return {
    externalId: message.id,
    from: getHeader('From'),
    to: [getHeader('To')],
    subject: getHeader('Subject'),
    body,
    snippet: message.snippet,
    receivedAt: new Date(parseInt(message.internalDate)),
  };
}
