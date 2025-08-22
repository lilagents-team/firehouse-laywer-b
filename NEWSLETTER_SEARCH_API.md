# Newsletter Search API Documentation

## Overview

The Newsletter Search API provides access to 242 historical newsletters (1997-2025) with AI-powered compression and mobile-optimized search capabilities.

## API Endpoints

### Search Newsletters
```http
GET /api/newsletters/search?q={query}&page={page}&limit={limit}
```

**Parameters:**
- `q` (string, required): Search query
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Results per page (default: 10, max: 50)

**Response:**
```json
{
  "results": [
    {
      "volume": 12,
      "edition": 2,
      "title": "Open Government Trainings Act Requirements",
      "date": "2014-06-01",
      "summary": "New training requirements for elected officials...",
      "keywords": ["OPMA", "PRA", "training"],
      "topics": ["Open Government", "Training Requirements"],
      "relevance_score": 0.95,
      "corruption_detected": false
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "total_pages": 2
  },
  "search_time_ms": 45
}
```

### Get Newsletter Index
```http
GET /api/newsletters/index
```

Returns compressed metadata for all newsletters for local caching.

**Response:**
```json
{
  "newsletters": [
    {
      "volume": 25,
      "edition": 7,
      "title": "Special-Meeting Notices Are Key",
      "date": "2025-07-01",
      "summary": "Brief summary...",
      "keywords": ["OPMA", "special meetings"],
      "topics": ["Open Government"],
      "file_size_kb": 45,
      "corruption_detected": false
    }
  ],
  "total_count": 242,
  "last_updated": "2025-08-22T10:30:00Z",
  "cache_version": "1.0"
}
```

### Get Specific Newsletter
```http
GET /api/newsletters/{volume}/{edition}
```

**Parameters:**
- `volume` (number): Newsletter volume
- `edition` (number): Newsletter edition

**Response:**
```json
{
  "volume": 12,
  "edition": 2,
  "title": "Open Government Trainings Act Requirements",
  "date": "2014-06-01",
  "summary": "Detailed summary of newsletter content...",
  "keywords": ["OPMA", "PRA", "training", "elected officials"],
  "topics": ["Open Government", "Training Requirements"],
  "compressed_content": "• Open Government Trainings Act effective July 1, 2014\n• Training required within 90 days...",
  "search_text": "Full searchable content...",
  "pdf_url": "https://firehouselawyer.com/newsletters/v12n02.pdf",
  "corruption_detected": false,
  "corruption_notes": "",
  "processing_date": "2025-08-22T10:30:00Z"
}
```

### Process Newsletter (Admin)
```http
POST /api/newsletters/process
```

Processes a raw newsletter through the Ollama compression pipeline.

**Request Body:**
```json
{
  "volume": 12,
  "edition": 2,
  "filename": "v12n02jun2014-raw.md",
  "content": "Raw newsletter text content..."
}
```

**Response:**
```json
{
  "success": true,
  "processed_newsletter": {
    "volume": 12,
    "edition": 2,
    "title": "Open Government Trainings Act Requirements",
    "corruption_detected": true,
    "corruption_notes": "3-column layout conversion issues detected",
    "processing_time_ms": 2500
  }
}
```

## Data Formats

### Compressed Newsletter Schema
```typescript
interface CompressedNewsletter {
  volume: number;
  edition: number;
  title: string;
  date: string; // ISO 8601 format
  summary: string; // 2-3 sentence summary
  keywords: string[]; // Key legal terms
  topics: string[]; // Legal topic categories
  compressed_content: string; // Structured key points
  search_text: string; // All searchable content
  pdf_url?: string; // Link to original PDF
  corruption_detected: boolean;
  corruption_notes: string;
  processing_date: string; // ISO 8601 format
  file_size_kb?: number; // Original file size
}
```

### Search Result Schema
```typescript
interface SearchResult extends CompressedNewsletter {
  relevance_score: number; // 0-1 relevance score
  matching_snippets?: string[]; // Highlighted text snippets
}
```

### Corruption Detection
The system automatically detects common corruption patterns:

- **3-Column Layout Issues** - Incorrect parsing of older newsletters
- **Garbled OCR Text** - Random character sequences from poor PDF conversion
- **Missing Content** - Incomplete articles or abrupt text cutoffs
- **Repeated Sections** - Duplicate paragraphs from processing errors

Corrupted newsletters are flagged for manual review and PDF regeneration.

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid search query",
  "message": "Search query must be at least 2 characters long"
}
```

### 404 Not Found
```json
{
  "error": "Newsletter not found",
  "message": "Newsletter volume 12, edition 2 does not exist"
}
```

### 500 Internal Server Error
```json
{
  "error": "Processing failed",
  "message": "Ollama service unavailable"
}
```

## Rate Limiting

- **Search API**: 100 requests per minute per IP
- **Index API**: 10 requests per minute per IP (cacheable)
- **Processing API**: 5 requests per minute (admin only)

## Caching Strategy

### Server-Side Caching
- Newsletter index cached for 1 hour
- Individual newsletters cached for 24 hours
- Search results cached for 15 minutes

### Client-Side Caching
- Newsletter index stored in IndexedDB
- Frequently accessed newsletters cached locally
- Cache invalidation based on `cache_version`

## Authentication

Most endpoints are public. Administrative endpoints require authentication:

```http
Authorization: Bearer <jwt_token>
```

## Mobile Optimization

### Compressed Responses
All responses use gzip compression and optimized JSON structure.

### Progressive Loading
Search results support streaming for immediate user feedback:

```http
GET /api/newsletters/search?q=OPMA&stream=true
```

Returns chunked JSON responses for progressive display.

### Offline Support
The newsletter index enables offline search through cached content:

1. Download newsletter index on first visit
2. Store in IndexedDB for offline access
3. Sync incrementally on subsequent visits
4. Fall back to cached results when offline

## Processing Pipeline

### Ollama Integration
Newsletter processing uses this Ollama request format:

```bash
curl -X POST http://192.168.2.16:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama3.1",
    "prompt": "[Legal newsletter processor prompt]",
    "stream": false,
    "options": {
      "temperature": 0.1,
      "top_p": 0.9,
      "max_tokens": 2048
    }
  }'
```

### Quality Assurance
- Corruption detection runs on all processed newsletters
- Manual review required for flagged documents
- Original PDFs maintained for regeneration
- Processing logs track success/failure rates

## Performance Metrics

### Target Performance
- Search response time: < 200ms
- Index download: < 5MB total
- Mobile-first optimization: < 50KB initial payload
- Offline search: Functional without network

### Monitoring
- Search query analytics
- Performance metrics logging
- Error rate tracking
- Cache hit/miss ratios