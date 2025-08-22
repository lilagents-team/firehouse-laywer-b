# Newsletter Processing Guide

## Overview

This guide documents the AI-powered newsletter compression pipeline that processes 242 historical newsletters (1997-2025) for efficient mobile search.

## Processing Pipeline Architecture

### Stage 1: PDF to Text Conversion
Raw PDF newsletters are converted to markdown using automated text extraction:

```
Input:  v12n02jun2014.pdf
Output: v12n02jun2014-raw.md
```

**Extraction Process:**
- Uses `pdfplumber` with left/right column segmentation
- Handles 2-column and 3-column layouts
- Preserves page structure with column markers
- Generates metadata headers with processing date

**Expected Output Format:**
```markdown
# Raw BBox Extraction: v12n02jun2014.pdf
# Method: pdfplumber left/right segmentation
# Date: 2025-08-18T15:24:17.861743

========== PAGE 1 ==========

----- LEFT COLUMN -----
Newsletter content...
----- END LEFT COLUMN -----

----- RIGHT COLUMN -----
Newsletter content...
----- END RIGHT COLUMN -----
```

### Stage 2: Corruption Detection
Common corruption patterns from PDF conversion:

**3-Column Layout Issues:**
- Older newsletters (pre-2010) often used 3-column layouts
- Text extraction assumes 2-column format
- Results in garbled text flow and incomplete sentences

**Example Corruption:**
```
# Corrupted (3→2 column issue)
"in everuyn floicuern yseeadr s,p aesrs loonn g taos tphreayc tcoen tiwnuhee ns o as erlivcienngs"

# Should be
"in every four years, as long as they continue serving"
```

**Detection Criteria:**
- Garbled character sequences (>20% non-dictionary words)
- Incomplete headers ("Firehous" instead of "Firehouse")
- Mid-sentence breaks disrupting content flow
- Missing standard newsletter sections

### Stage 3: Ollama AI Processing

#### System Prompt Configuration
```
Role: Legal newsletter document processor for PDF-to-text converted newsletters (1997-2025)

Input Format:
Volume: [number]
Edition: [number] 
Original filename: [filename]
Content: [raw text with page/column markers]

Output: JSON only, no other text
```

#### Processing Request Format
```bash
curl -X POST http://192.168.2.16:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama3.1",
    "prompt": "You are a legal newsletter document processor...",
    "stream": false,
    "options": {
      "temperature": 0.1,
      "top_p": 0.9,
      "max_tokens": 2048
    }
  }'
```

#### Expected JSON Output
```json
{
  "volume": 12,
  "edition": 2,
  "title": "Open Government Trainings Act Requirements",
  "date": "2014-06-01",
  "summary": "Newsletter discusses new Open Government Trainings Act...",
  "keywords": ["OPMA", "PRA", "training", "elected officials"],
  "topics": ["Open Government", "Training Requirements"],
  "compressed_content": "• Open Government Trainings Act (SB 5964) effective July 1, 2014...",
  "search_text": "Open Government Trainings Act SB 5964 OPMA PRA training...",
  "corruption_detected": true,
  "corruption_notes": "3-column to 2-column conversion corruption detected..."
}
```

### Stage 4: Quality Assurance

#### Validation Checks
1. **Required Fields**: All JSON fields present and valid
2. **Date Format**: ISO 8601 date strings
3. **Content Length**: Reasonable compression ratio (60-70% reduction)
4. **Legal Accuracy**: Case citations and statutory references preserved

#### Corruption Handling
- **Severe Corruption**: Flag for PDF regeneration
- **Minor Issues**: Process with corruption notes
- **Clean Documents**: Standard compression pipeline

#### Manual Review Process
1. Review flagged documents for corruption severity
2. Regenerate problematic PDFs from original sources
3. Re-process through pipeline
4. Update search index with corrected content

## Batch Processing Implementation

### Processing Script Structure
```typescript
interface ProcessingConfig {
  ollamaEndpoint: string;
  inputDirectory: string;
  outputDirectory: string;
  batchSize: number;
  concurrency: number;
}

interface ProcessingResult {
  filename: string;
  success: boolean;
  newsletter?: CompressedNewsletter;
  error?: string;
  processingTimeMs: number;
}
```

### Batch Processing Flow
```bash
# 1. Scan input directory for raw newsletter files
find /input/newsletters -name "*-raw.md" | sort

# 2. Extract volume/edition from filename
# Pattern: v{volume}n{edition}{date}-raw.md
# Example: v12n02jun2014-raw.md → Volume 12, Edition 2

# 3. Process through Ollama with error handling
# - Retry failed requests up to 3 times
# - Log processing time and success rates
# - Handle timeout/connection issues

# 4. Validate output JSON
# - Schema validation
# - Required field checks
# - Content quality verification

# 5. Update search index
# - Add to searchable database
# - Update keyword indices
# - Refresh cached metadata
```

### Error Handling Strategy
```typescript
async function processNewsletter(rawContent: string): Promise<ProcessingResult> {
  const maxRetries = 3;
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await ollamaRequest(rawContent);
      return { success: true, newsletter: result };
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries) {
        await delay(1000 * attempt); // Exponential backoff
      }
    }
  }

  return { 
    success: false, 
    error: `Failed after ${maxRetries} attempts: ${lastError.message}` 
  };
}
```

## Performance Optimization

### Processing Speed
- **Target**: 30-60 seconds per newsletter
- **Concurrency**: Process 3-5 newsletters simultaneously
- **Batch Size**: 10-20 newsletters per batch
- **Total Time**: ~2-4 hours for complete 242 newsletter corpus

### Resource Requirements
- **Memory**: 4GB RAM minimum for Ollama
- **Storage**: 500MB for raw files, 50MB for compressed output
- **Network**: Stable connection to Ollama endpoint
- **CPU**: Multi-core beneficial for concurrent processing

### Monitoring and Logging
```typescript
interface ProcessingMetrics {
  totalNewsletters: number;
  processed: number;
  failed: number;
  averageProcessingTime: number;
  corruptionRate: number;
  compressionRatio: number;
}
```

## Content Quality Guidelines

### Preservation Requirements
**Always Preserve:**
- Legal case names and citations (e.g., "Predisik v. Spokane School District")
- Statutory references (e.g., "RCW 42.56.230(3)")
- Legal terminology and definitions
- Actionable recommendations for fire departments
- Training announcements and contact information

### Compression Guidelines
**Target Reductions:**
- Remove redundant explanatory text
- Compress verbose legal disclaimers
- Eliminate repetitive formatting phrases
- Maintain numbered lists and bullet points

**Quality Metrics:**
- 60-70% size reduction while preserving legal accuracy
- All legal citations intact and searchable
- Key recommendations clearly extracted
- No loss of actionable information

## Search Index Generation

### Index Structure
```json
{
  "newsletters": [
    {
      "id": "v12n02",
      "volume": 12,
      "edition": 2,
      "search_vectors": {
        "title": "Open Government Trainings Act Requirements",
        "keywords": ["OPMA", "PRA", "training"],
        "topics": ["Open Government"],
        "full_text": "compressed searchable content"
      },
      "metadata": {
        "date": "2014-06-01",
        "file_size_kb": 45,
        "corruption_detected": false
      }
    }
  ],
  "search_index": {
    "keyword_map": {
      "OPMA": ["v12n02", "v13n04", "v14n01"],
      "PRA": ["v12n02", "v15n03"]
    },
    "topic_map": {
      "Open Government": ["v12n02", "v13n04"],
      "Employment Law": ["v13n04", "v14n02"]
    }
  }
}
```

### Index Optimization
- **Keyword Indexing**: Pre-computed keyword-to-newsletter mappings
- **Topic Clustering**: Group newsletters by legal topic areas
- **Full-Text Search**: Tokenized content for fast text matching
- **Mobile Optimization**: Compressed index format for mobile devices

## Deployment and Maintenance

### Initial Setup
1. **Ollama Configuration**: Deploy model on processing server
2. **Raw File Preparation**: Organize 242 newsletters by volume/edition
3. **Processing Pipeline**: Run batch processing with monitoring
4. **Index Generation**: Build searchable index from processed content
5. **Quality Review**: Manual review of flagged corrupted documents

### Ongoing Maintenance
- **New Newsletter Processing**: Process monthly releases
- **Index Updates**: Incremental search index updates
- **Corruption Monitoring**: Track processing success rates
- **Performance Optimization**: Monitor search response times

### Backup and Recovery
- **Source Preservation**: Maintain original PDFs for regeneration
- **Processing Logs**: Keep detailed logs of all processing attempts
- **Index Versioning**: Version control for search indices
- **Rollback Capability**: Ability to revert to previous index versions