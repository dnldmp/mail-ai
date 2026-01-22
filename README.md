# Mail AI - Intelligent Email Management

A modern, AI-powered email management application built with Next.js and React. This application helps users organize, categorize, and respond to emails efficiently using artificial intelligence.

## Features

- 🔐 **Secure OAuth Authentication** - Sign in with Google (Gmail) or Microsoft (Outlook)
- 📧 **Email Synchronization** - Automatically sync and read emails from your inbox
- 🤖 **AI-Powered Classification** - Automatically categorize emails (Important, Promotional, Personal, Spam, Social, Updates)
- 💬 **Smart Reply Suggestions** - AI-generated reply suggestions based on email content
- 📊 **Intuitive Dashboard** - Visual overview of email statistics and productivity metrics
- 🔍 **Advanced Search & Filters** - Quickly find emails with smart filtering options
- ⚙️ **Automation Rules** - Create custom rules to automatically organize your inbox

## Tech Stack

- **Frontend**: React 18, Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js with OAuth providers
- **Database**: PostgreSQL with Prisma ORM
- **AI/ML**: OpenAI GPT API for email classification and suggestions
- **Email APIs**: Gmail API, Microsoft Graph API (coming soon)
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Google Cloud Console project (for Gmail API)
- OpenAI API key (optional, for AI features)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/dnldmp/mail-ai.git
   cd mail-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your configuration.

4. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the Gmail API
4. Configure the OAuth consent screen
5. Create OAuth 2.0 credentials
6. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
7. Copy the Client ID and Client Secret to your `.env` file

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── auth/          # NextAuth.js endpoints
│   │   ├── emails/        # Email CRUD operations
│   │   ├── ai/            # AI classification endpoints
│   │   └── sync/          # Email sync endpoint
│   ├── dashboard/         # Main dashboard page
│   ├── emails/[id]/       # Email detail page
│   ├── login/             # Login page
│   └── settings/          # Settings page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── dashboard/        # Dashboard-specific components
│   └── emails/           # Email-related components
├── lib/                   # Utility functions and services
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Prisma client
│   ├── gmail.ts          # Gmail API integration
│   ├── ai.ts             # AI/ML functions
│   └── utils.ts          # Helper functions
└── types/                # TypeScript type definitions
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/*` | GET/POST | NextAuth.js authentication |
| `/api/emails` | GET | Fetch emails with filters |
| `/api/emails` | PATCH | Update email properties |
| `/api/sync` | POST | Sync emails from provider |
| `/api/ai` | POST | Classify email or generate reply |

## Email Categories

| Category | Description | Color |
|----------|-------------|-------|
| Important | Work-related, urgent, requiring action | Red |
| Promotional | Sales, marketing, discounts | Yellow |
| Personal | Friends, family, personal contacts | Blue |
| Spam | Unwanted, suspicious emails | Gray |
| Social | Social media notifications | Purple |
| Updates | Newsletters, service updates | Green |

## Future Roadmap

- [ ] Microsoft Outlook integration
- [ ] Custom AI model training
- [ ] Email composition with AI assistance
- [ ] Team collaboration features
- [ ] Mobile app (React Native)
- [ ] Browser extension
- [ ] Webhook integrations (Slack, Discord)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [OpenAI](https://openai.com/) - AI/ML capabilities
- [Prisma](https://prisma.io/) - Database ORM
- [NextAuth.js](https://next-auth.js.org/) - Authentication
