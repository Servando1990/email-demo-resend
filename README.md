# Email Demo with Resend - Investor Outreach Automation

A Next.js web application that demonstrates automated email follow-ups using Resend API for investor outreach automation needs.

## 🚀 Live Demo

[Deploy on Vercel](https://vercel.com/new/clone?repository-url=https://github.com/Servando1990/email-demo-resend)

## ✨ Features

### 📈 Dashboard Overview
- Real-time metrics and analytics
- Quick action buttons for common tasks
- Professional email activity feed

### 💼 Deal Management
- Create new investment opportunities
- Automatic email notifications to relevant investors
- Industry and stage categorization
- Deal history tracking

### 👥 Contact Management
- Investor contact database with industry preferences
- Status tracking (Active, Stale, Recent)
- Advanced filtering and search
- Bulk follow-up campaigns for stale contacts

### 📧 Email Automation
- **Deal Announcements**: Automatically notify investors when new deals match their interests
- **Stale Contact Follow-ups**: Re-engage contacts who haven't been contacted in 30+ days
- **Meeting Rescheduling**: Recovery emails for missed meetings
- Real-time email status tracking (Sent, Delivered, Failed)

### 🎨 Professional UI
- Responsive design with Tailwind CSS
- Loading states and error handling
- Professional color scheme and icons
- Mobile-friendly interface

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Email Service**: Resend API
- **Data Storage**: In-memory JavaScript arrays (demo purposes)
- **Deployment**: Vercel

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/Servando1990/email-demo-resend.git
cd email-demo-resend
npm install
```

### 2. Environment Setup

```bash
cp .env.local.example .env.local
```

Add your Resend API key:
```env
RESEND_API_KEY=your_resend_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📧 Email Configuration

### Demo Mode
The application works in demo mode without a Resend API key. Email sending will be simulated and logged to the console.

### Production Mode
1. Sign up at [Resend](https://resend.com)
2. Get your API key
3. Add a verified domain (for production use)
4. Update the `from` email in `src/lib/emailService.ts`

## 🎯 Demo Flow

1. **Dashboard Overview**: See metrics and recent activity
2. **Add New Deal**: Go to Deals tab, create a CleanTech deal
3. **Watch Automation**: System automatically emails relevant investors
4. **View Email Activity**: Check the email status and delivery
5. **Contact Management**: View contacts, send follow-ups to stale contacts
6. **Real-time Updates**: Watch email status change from "Sent" to "Delivered"

## 📊 Demo Data

The application comes pre-seeded with:
- 8 realistic investor contacts with different industry preferences
- 3 sample deals (CleanTech, AI, CPG)
- Historical email logs with various statuses

## 🔧 Architecture

### Data Layer
- `src/lib/data.ts`: In-memory data store with CRUD operations
- `src/lib/types.ts`: TypeScript interfaces and constants
- `src/lib/seedData.ts`: Demo data initialization

### API Layer
- `src/app/api/deals/`: Deal management endpoints
- `src/app/api/contacts/`: Contact management endpoints  
- `src/app/api/emails/`: Email sending and logging endpoints

### UI Components
- `src/components/Dashboard.tsx`: Main dashboard with navigation
- `src/components/DealForm.tsx`: Deal creation with automation
- `src/components/ContactList.tsx`: Contact management with filtering
- `src/components/EmailActivity.tsx`: Email status tracking

### Email Service
- `src/lib/emailService.ts`: Resend integration and templates

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Manual Deployment

```bash
npm run build
npm start
```

## 📋 Environment Variables

```env
# Required for production email sending
RESEND_API_KEY=your_resend_api_key_here

# Optional - defaults to http://localhost:3000 in development
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 🧪 Testing

```bash
# Build and check for errors
npm run build

# Run linting
npm run lint

# Start production server locally
npm start
```

## 📈 Business Logic

### Deal-Contact Matching
When a new deal is created, the system:
1. Identifies contacts interested in that industry
2. Generates personalized emails
3. Sends emails via Resend API
4. Logs email status for tracking
5. Updates contact engagement timestamps

### Stale Contact Detection
Contacts are marked as "stale" if:
- Last contact date > 30 days ago
- Status automatically updates based on recent activity
- Bulk follow-up campaigns can be triggered

### Email Templates
- **Deal Announcement**: Professional template with deal details and investor focus alignment
- **Follow-up**: Re-engagement template for stale contacts
- **Meeting Reschedule**: Recovery template for missed meetings

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop and mobile
- **Loading States**: Smooth user experience during API calls
- **Error Handling**: Graceful error messages and recovery
- **Real-time Updates**: Email status changes automatically
- **Professional Styling**: Clean, modern interface suitable for business use

## 🔒 Security Considerations

- API key stored securely in environment variables
- Input validation on all forms
- Rate limiting ready for production
- No sensitive data stored in browser

## 📝 License

MIT License - feel free to use this demo as a starting point for your own projects.

## 🤝 Contributing

This is a demo project, but suggestions and improvements are welcome!

---

