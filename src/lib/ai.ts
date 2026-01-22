import OpenAI from 'openai';

// Lazy initialization of OpenAI client
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

export type EmailCategory = 
  | 'IMPORTANT'
  | 'PROMOTIONAL'
  | 'PERSONAL'
  | 'SPAM'
  | 'SOCIAL'
  | 'UPDATES'
  | 'UNCATEGORIZED';

interface ClassificationResult {
  category: EmailCategory;
  confidence: number;
  suggestedReply?: string;
}

export async function classifyEmail(
  subject: string,
  body: string,
  from: string
): Promise<ClassificationResult> {
  const openai = getOpenAIClient();
  
  // If OpenAI API key is not configured, return a mock classification
  if (!openai) {
    return mockClassifyEmail(subject, body, from);
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an email classification assistant. Analyze the email and return a JSON response with:
            - category: One of IMPORTANT, PROMOTIONAL, PERSONAL, SPAM, SOCIAL, UPDATES
            - confidence: A number between 0 and 1
            - suggestedReply: A brief suggested reply if appropriate (optional)
            
            Categories:
            - IMPORTANT: Work-related, urgent, or requiring action
            - PROMOTIONAL: Sales, marketing, discounts
            - PERSONAL: From friends, family, personal contacts
            - SPAM: Unwanted, suspicious emails
            - SOCIAL: Social media notifications
            - UPDATES: Newsletters, service updates`,
        },
        {
          role: 'user',
          content: `From: ${from}\nSubject: ${subject}\n\nBody:\n${body.slice(0, 1000)}`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return {
      category: result.category || 'UNCATEGORIZED',
      confidence: result.confidence || 0.5,
      suggestedReply: result.suggestedReply,
    };
  } catch (error) {
    console.error('Error classifying email:', error);
    return mockClassifyEmail(subject, body, from);
  }
}

function mockClassifyEmail(subject: string, body: string, from: string): ClassificationResult {
  const lowerSubject = subject.toLowerCase();
  const lowerFrom = from.toLowerCase();
  
  if (lowerSubject.includes('urgent') || lowerSubject.includes('important') || lowerSubject.includes('action required')) {
    return { category: 'IMPORTANT', confidence: 0.8 };
  }
  if (lowerSubject.includes('sale') || lowerSubject.includes('discount') || lowerSubject.includes('offer') || lowerSubject.includes('promo')) {
    return { category: 'PROMOTIONAL', confidence: 0.85 };
  }
  if (lowerFrom.includes('facebook') || lowerFrom.includes('twitter') || lowerFrom.includes('linkedin') || lowerFrom.includes('instagram')) {
    return { category: 'SOCIAL', confidence: 0.9 };
  }
  if (lowerSubject.includes('newsletter') || lowerSubject.includes('update') || lowerSubject.includes('digest')) {
    return { category: 'UPDATES', confidence: 0.75 };
  }
  if (lowerSubject.includes('win') || lowerSubject.includes('lottery') || lowerSubject.includes('congratulations')) {
    return { category: 'SPAM', confidence: 0.9 };
  }
  
  return { category: 'PERSONAL', confidence: 0.6 };
}

export async function generateSuggestedReply(
  subject: string,
  body: string,
  from: string
): Promise<string> {
  const openai = getOpenAIClient();
  
  if (!openai) {
    return 'Thank you for your email. I will get back to you shortly.';
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an email assistant. Generate a brief, professional reply suggestion based on the email content. Keep it concise and helpful.',
        },
        {
          role: 'user',
          content: `From: ${from}\nSubject: ${subject}\n\nBody:\n${body.slice(0, 1000)}`,
        },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    return response.choices[0].message.content || 'Thank you for your email.';
  } catch (error) {
    console.error('Error generating reply:', error);
    return 'Thank you for your email. I will get back to you shortly.';
  }
}
