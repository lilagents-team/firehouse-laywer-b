# Firehouse Lawyer Website

A modern legal website for fire departments and public agencies with advanced newsletter search capabilities.

## Features

### Core Website
- **Modern React Frontend** with urban/industrial design theme
- **Sveltia CMS Integration** for content management
- **Responsive Design** optimized for mobile and desktop
- **Attorney Profiles** and practice area showcases
- **Contact Forms** and newsletter subscriptions

### Advanced Newsletter Search System
- **242 Historical Newsletters** (1997-2025) with intelligent search
- **Mobile-Optimized Performance** with local caching
- **AI-Powered Document Compression** using Ollama for efficient searching
- **Corruption Detection** for PDF-to-text conversion issues
- **Hybrid Search Strategy** combining remote API and local cache

## Newsletter Search Architecture

### Data Processing Pipeline
The newsletter search system processes 242 newsletters spanning from 1997 to 2025:

1. **PDF to Text Conversion** - Raw extraction with column detection
2. **AI Compression via Ollama** - Structured data extraction and summarization
3. **Corruption Detection** - Identifies 3-column to 2-column conversion errors
4. **Search Index Creation** - Optimized metadata for fast mobile searches

### Search Performance Strategy
- **Priority Remote Results** - Latest and most relevant content served first
- **Local Cache Fallback** - 242 compressed newsletters cached in IndexedDB
- **Progressive Loading** - Search results appear incrementally
- **Offline Capability** - Basic search works without internet connection

### Compressed Newsletter Format
Each newsletter is processed into this optimized format:
```json
{
  "volume": 12,
  "edition": 2,
  "title": "Open Government Trainings Act Requirements",
  "date": "2014-06-01",
  "summary": "New training requirements for elected officials...",
  "keywords": ["OPMA", "PRA", "training", "elected officials"],
  "topics": ["Open Government", "Training Requirements"],
  "compressed_content": "Key legal updates in structured format",
  "search_text": "All searchable content concatenated",
  "corruption_detected": false,
  "corruption_notes": ""
}
```

## Quick Start

### Development
```bash
npm install
npm run dev
```

### Production Deployment
The website supports multiple deployment options:

1. **Netlify (Static)** - Best for content-only sites
2. **Replit (Full-Stack)** - Includes newsletter search backend
3. **Vercel/Railway** - Full production deployment

See deployment guides for detailed setup instructions.

## Newsletter Search Setup

### Prerequisites
- **Node.js 20+** for backend API services
- **242 Compressed Newsletter Files** (.txt/.md format, processed externally)
- **Search Index File** (generated from compressed newsletters)

### Setting Up Newsletter Search
```bash
# Place compressed newsletter files in content/newsletters-compressed/
# Example: v12n02jun2014-compressed.json

# Generate search index from compressed files
npm run build-search-index

# Deploy with search capabilities
npm run deploy:full-stack
```

**Note**: Newsletter compression is done externally using the AI processing pipeline. The website works with the resulting compressed files.

### Search API Endpoints
- `GET /api/newsletters/search?q={query}&page={n}` - Search newsletters
- `GET /api/newsletters/index` - Get compressed newsletter metadata
- `GET /api/newsletters/{volume}/{edition}` - Get specific newsletter

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide Icons** for UI elements
- **Vite** for build tooling

### Backend
- **Express.js** API server
- **Zod** for schema validation  
- **Ollama** for AI document processing
- **IndexedDB** for client-side caching

### Content Management
- **Sveltia CMS** (modern, fast alternative to Netlify CMS)
- **GitHub** for content version control
- **Markdown** for content authoring

## File Structure
```
├── client/                 # React frontend
│   ├── src/pages/         # Page components
│   ├── src/components/    # Reusable components
│   └── src/lib/          # Utilities and API clients
├── server/                # Express backend
│   ├── routes.ts         # API route definitions
│   └── newsletter/       # Newsletter processing services
├── content/               # CMS-managed content
│   ├── newsletters/      # Newsletter markdown files
│   ├── attorneys/        # Attorney profiles
│   └── practice-areas/   # Practice area content
└── public/admin/         # Sveltia CMS admin interface
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test newsletter search functionality
5. Submit a pull request

## License

Copyright © 2025 Joseph F. Quinn, P.S. All rights reserved.