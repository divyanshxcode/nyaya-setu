<div align="center">

# NyaySetu-AI

<p align="center">
  <img src="https://img.shields.io/github/stars/divyanshxcode/nyaya-setu?style=flat-square" />
  <img src="https://img.shields.io/github/forks/divyanshxcode/nyaya-setu?style=flat-square" />
  <img src="https://img.shields.io/github/issues/divyanshxcode/nyaya-setu?style=flat-square" />
  <img src="https://img.shields.io/github/pulls/divyanshxcode/nyaya-setu?style=flat-square" />
  <img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" />
  <img src="https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg?style=flat-square" />
</p>

</div>

---


## Project Overview

Nyaya Setu is an intelligent legal document processing and case management platform that leverages AI to streamline compliance workflows and legal case analysis. The platform automates the extraction, classification, and review of legal documents, enabling legal professionals to focus on critical decision-making rather than manual data entry.

This project is a submission for **Round 2 (Prototype Phase)** of the **AI for Bharat Hackathon**. It demonstrates practical application of generative AI for legal document processing with a focus on improving access to justice through technology.

**Development Period:** May 2-7, 2026 (Round 2 Prototype)

## Key Features

- **Intelligent PDF Extraction**: Automated extraction of structured data from legal documents using Gemini AI
- **OCR Processing**: Advanced optical character recognition with progress tracking
- **Case Management Dashboard**: Comprehensive dashboard for tracking active cases, deadlines, and compliance status
- **Document Review System**: Streamlined review interface for legal professionals
- **Compliance Analytics**: Real-time compliance tracking and visual analytics
- **Department Heatmap Analysis**: Multi-department compliance visualization
- **Authentication System**: Secure user authentication and authorization
- **Export Capabilities**: Generate reports and export case data in multiple formats

---

## Technology Stack

### Frontend
- **Framework**: Next.js 16.2.4
- **UI Library**: React 19
- **Styling**: Tailwind CSS with PostCSS
- **Component Library**: Radix UI with custom shadcn/ui components
- **Form Handling**: React Hook Form with Zod validation
- **PDF Processing**: PDF.js, react-pdf, pdf-parse
- **Charts & Analytics**: Recharts
- **Date Handling**: date-fns
- **Icons**: Lucide React

### Backend & Services
- **Runtime**: Node.js 18+
- **API Routes**: Next.js API routes with serverless functions
- **AI Integration**: Google Generative AI (Gemini API)
- **Database**: PostgreSQL 14+ (Cloud-hosted)
- **Cache Layer**: Redis 7.0+
- **File Storage**: AWS S3 or Google Cloud Storage
- **Authentication**: JWT with session management

### Development Tools
- **TypeScript**: Full type-safe development
- **ESLint**: Code quality and standards
- **Package Manager**: pnpm or npm

## Prerequisites

- Node.js 18.0.0 or higher
- pnpm 8.0.0+ (or npm 9.0.0+)
- Git
- API Keys:
  - Google Generative AI API key
  - PostgreSQL database connection string
  - AWS/GCS credentials (optional, for file storage)

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/ai-for-bharat/nyaya-setu.git
cd nyaya-setu
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the project root with the following variables:

```env
# Generative AI Configuration
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/nyaya_setu_db
DATABASE_POOL_SIZE=20
```

### 4. Database Setup

Initialize the PostgreSQL database with required migrations:

```bash
pnpm run db:migrate
pnpm run db:seed
```

### 5. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

---

## Building for Production

### Build

```bash
pnpm build
```

### Production Start

```bash
pnpm start
```

---

## API Documentation

### Extract PDF Documents

**Endpoint**: `POST /api/extract-pdf`

**Request**:
```json
{
  "fileUrl": "s3://bucket-name/documents/legal-document.pdf",
  "documentType": "contract"
}
```

**Response**:
```json
{
  "success": true,
  "extractedData": {
    "title": "Employment Agreement",
    "parties": ["Company A", "Employee B"],
    "effectiveDate": "2026-05-01",
    "keyTerms": [...],
    "compliance": {
      "status": "compliant",
      "issues": []
    }
  },
  "processingTime": 2.5
}
```

### Gemini AI Processing

**Endpoint**: `POST /api/extract-pdf-gemini`

**Request**:
```json
{
  "documentContent": "base64_encoded_pdf_content",
  "analysisType": "legal_compliance"
}
```

**Response**:
```json
{
  "success": true,
  "analysis": {
    "summary": "Document analysis summary",
    "riskAssessment": "Low",
    "recommendations": [...]
  },
  "confidence": 0.95
}
```

## Project Structure

```
nyaya-setu/
├── app/                          # Next.js app directory
│   ├── (auth)/                   # Authentication routes
│   │   └── login/
│   ├── (dashboard)/              # Dashboard layout
│   │   ├── cases/                # Case management
│   │   ├── review/               # Document review
│   │   ├── upload/               # Document upload
│   │   └── dashboard/            # Main dashboard
│   └── api/                      # API routes
│       ├── extract-pdf/
│       └── extract-pdf-gemini/
├── components/                   # Reusable React components
│   ├── ui/                       # UI component library
│   ├── dashboard/                # Dashboard components
│   ├── upload/                   # Upload workflow components
│   └── layout/                   # Layout components
├── lib/                          # Utility functions and services
│   ├── gemini-api-service.ts     # Gemini API integration
│   ├── pdf-extractor.ts          # PDF extraction logic
│   ├── extraction-provider.tsx   # Context provider
│   └── utils.ts                  # Common utilities
├── hooks/                        # Custom React hooks
├── types/                        # TypeScript type definitions
├── styles/                       # Global styles
├── public/                       # Static assets
├── next.config.mjs               # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Project dependencies
```

---


## Backend Service Details

### PostgreSQL Database

- **Host**: db.nyaya-setu.internal
- **Port**: 5432
- **Database**: nyaya_setu_production
- **Connection Pool**: 20 connections
- **Backup Strategy**: Automated daily backups at 02:00 UTC
- **Tables**:
  - `users` - User accounts and authentication
  - `cases` - Legal case records
  - `documents` - Document metadata and references
  - `extractions` - Extracted data and processing history
  - `reviews` - Document review records
  - `audit_logs` - System audit trail

### Redis Cache Layer

- **Host**: cache.nyaya-setu.internal
- **Port**: 6379
- **TTL Configuration**: 
  - Session data: 24 hours
  - Extraction cache: 7 days
  - User preferences: 30 days
- **Persistence**: AOF (Append-Only File)


## Security

- HTTPS/TLS encryption for all data in transit
- End-to-end encryption for sensitive documents
- Role-based access control (RBAC)
- Rate limiting: 1,000 requests per minute per user
- Automated security scanning and vulnerability patching
- GDPR and data privacy compliance
- Regular security audits and penetration testing

## Logging & Monitoring

- **Logs**: Centralized logging via CloudWatch
- **Metrics**: Prometheus metrics collection
- **Monitoring**: Real-time monitoring dashboard
- **Alerts**: Automated alerts for system anomalies
- **Error Tracking**: Sentry integration for error reporting

---

## Troubleshooting

### Common Issues

**Issue**: PDF extraction fails with timeout error
- **Solution**: Increase the timeout threshold in `.env.local`: `PDF_EXTRACTION_TIMEOUT=30000`

**Issue**: Gemini API returns rate limit error
- **Solution**: Implement request queuing or upgrade API tier

**Issue**: Database connection refused
- **Solution**: Verify DATABASE_URL is correct and database server is running

**Issue**: Build fails with TypeScript errors
- **Solution**: Run `pnpm tsc --noEmit` to identify type issues

## Acknowledgments

This project was developed for the **AI for Bharat Hackathon Round 2** and demonstrates the practical application of generative AI in the legal technology domain.
## Submission Details

**Hackathon**: AI for Bharat Hackathon 2026
**Round**: Round 2 (Prototype Phase)
**Development Timeline**: May 2-7, 2026
**Status**: Prototype Ready for Evaluation

---

**Last Updated**: May 7, 2026
