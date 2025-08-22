# Mobile Caching Strategy for Newsletter Search

## Overview

This document outlines the mobile-optimized caching strategy for searching 242 historical newsletters efficiently on mobile devices with limited bandwidth and storage.

## Caching Architecture

### Hybrid Approach: Remote Priority + Local Fallback

```
User Search Query
       ↓
1. Check Local Cache (IndexedDB)
       ↓
2. Query Remote API (Latest/Priority Results)
       ↓
3. Merge Results (Remote First, Local Fallback)
       ↓
4. Update Local Cache
       ↓
5. Display Combined Results
```

## Local Storage Strategy

### IndexedDB Implementation

**Database Schema:**
```typescript
interface NewsletterCache {
  id: string; // "v12n02"
  volume: number;
  edition: number;
  title: string;
  date: string;
  summary: string;
  keywords: string[];
  topics: string[];
  search_text: string;
  corruption_detected: boolean;
  cache_timestamp: number;
  size_kb: number;
}

interface SearchIndex {
  keyword_map: Record<string, string[]>; // keyword -> newsletter IDs
  topic_map: Record<string, string[]>;   // topic -> newsletter IDs
  full_text_index: Record<string, string[]>; // word -> newsletter IDs
  last_updated: number;
  version: string;
}
```

**Storage Allocation:**
- **Newsletter Metadata**: ~2MB (242 newsletters × 8KB each)
- **Search Index**: ~500KB (optimized keyword/topic mappings)
- **Frequently Accessed Content**: ~3MB (50 most recent/popular)
- **Total Local Storage**: ~6MB maximum

### Caching Tiers

#### Tier 1: Essential Metadata (Always Cached)
```typescript
const essentialData = {
  newsletter_index: [], // All 242 newsletter metadata
  search_index: {},     // Keyword/topic mappings
  popular_content: []   // Top 20 most searched newsletters
};
```

#### Tier 2: Recent Content (Cached on Access)
```typescript
const recentContent = {
  last_30_searches: [], // Cache full content for recent searches
  user_favorites: [],   // User bookmarked newsletters
  trending_topics: []   // Currently popular legal topics
};
```

#### Tier 3: Full Archive (On-Demand)
```typescript
const fullArchive = {
  complete_newsletters: [], // Full text when specifically requested
  historical_data: []       // Older newsletters (1997-2010)
};
```

## Performance Optimization

### Initial Load Strategy

**First Visit (Cold Cache):**
```javascript
async function initializeCache() {
  // 1. Download essential index (~500KB)
  const index = await fetch('/api/newsletters/index');
  await storeInIndexedDB('newsletter_index', index);
  
  // 2. Pre-cache popular newsletters (~1MB)
  const popular = await fetch('/api/newsletters/popular');
  await storeInIndexedDB('popular_content', popular);
  
  // 3. Enable offline search capability
  await buildLocalSearchIndex(index);
}
```

**Subsequent Visits (Warm Cache):**
```javascript
async function loadFromCache() {
  // 1. Load from IndexedDB instantly
  const cached = await getFromIndexedDB('newsletter_index');
  
  // 2. Check for updates in background
  syncInBackground();
  
  // 3. Enable immediate search
  return cached;
}
```

### Search Performance

**Local-First Search:**
```typescript
async function searchNewsletters(query: string) {
  const startTime = performance.now();
  
  // 1. Instant local search (< 50ms)
  const localResults = await searchLocalCache(query);
  
  // 2. Display immediate results
  displayResults(localResults, { source: 'cache', partial: true });
  
  // 3. Remote search for latest content (background)
  const remoteResults = await searchRemoteAPI(query);
  
  // 4. Merge and update display
  const mergedResults = mergeResults(localResults, remoteResults);
  displayResults(mergedResults, { source: 'hybrid', complete: true });
  
  // 5. Update local cache
  await updateLocalCache(remoteResults);
}
```

**Search Index Optimization:**
```typescript
interface OptimizedSearchIndex {
  // Stemmed keywords for better matching
  stemmed_keywords: Record<string, string[]>;
  
  // Fuzzy matching support
  soundex_index: Record<string, string[]>;
  
  // Legal term recognition
  legal_terms: Record<string, string[]>;
  
  // Date-based indexing
  date_ranges: Record<string, string[]>;
}
```

## Mobile-Specific Optimizations

### Network-Aware Loading

```typescript
// Detect connection quality
const connection = (navigator as any).connection;
const isSlowNetwork = connection?.effectiveType === '2g' || 
                     connection?.effectiveType === 'slow-2g';

if (isSlowNetwork) {
  // Prioritize cached content
  await searchLocalFirst();
} else {
  // Balance remote and local
  await searchHybrid();
}
```

### Progressive Enhancement

**Offline Mode:**
```typescript
window.addEventListener('offline', () => {
  // Switch to cache-only mode
  enableOfflineMode();
  showOfflineNotification();
});

window.addEventListener('online', () => {
  // Resume hybrid mode
  enableHybridMode();
  syncPendingUpdates();
});
```

**Background Sync:**
```typescript
// Service Worker implementation
self.addEventListener('sync', event => {
  if (event.tag === 'newsletter-sync') {
    event.waitUntil(syncNewsletterCache());
  }
});
```

## Cache Management

### Storage Limits

**Quota Management:**
```typescript
async function manageStorageQuota() {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    const usedMB = estimate.usage! / 1024 / 1024;
    const quotaMB = estimate.quota! / 1024 / 1024;
    
    if (usedMB > quotaMB * 0.8) {
      await cleanupOldCache();
    }
  }
}
```

**Cleanup Strategy:**
```typescript
async function cleanupOldCache() {
  // Remove newsletters not accessed in 30 days
  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
  
  await removeOldEntries('full_newsletters', thirtyDaysAgo);
  
  // Keep essential index and popular content
  // Clean up only detailed content
}
```

### Cache Invalidation

**Version-Based Updates:**
```typescript
async function checkCacheVersion() {
  const localVersion = await getLocalCacheVersion();
  const remoteVersion = await getRemoteCacheVersion();
  
  if (localVersion !== remoteVersion) {
    await updateCacheIncrementally(localVersion, remoteVersion);
  }
}
```

**Incremental Updates:**
```typescript
async function updateCacheIncrementally(oldVersion: string, newVersion: string) {
  // Only update changed newsletters
  const changedNewsletters = await getChangedNewsletters(oldVersion, newVersion);
  
  for (const newsletter of changedNewsletters) {
    await updateLocalNewsletter(newsletter);
  }
  
  await updateLocalVersion(newVersion);
}
```

## User Experience Features

### Smart Prefetching

```typescript
// Predict likely searches based on user behavior
async function predictiveCache() {
  const userHistory = await getUserSearchHistory();
  const trending = await getTrendingTopics();
  
  // Pre-cache likely next searches
  const predictions = generatePredictions(userHistory, trending);
  await prefetchPredictedContent(predictions);
}
```

### Search Suggestions

```typescript
// Instant suggestions from local cache
function getSearchSuggestions(partial: string) {
  const suggestions = [];
  
  // Legal terms
  suggestions.push(...getLegalTermSuggestions(partial));
  
  // Newsletter titles
  suggestions.push(...getTitleSuggestions(partial));
  
  // Popular topics
  suggestions.push(...getTopicSuggestions(partial));
  
  return suggestions.slice(0, 5); // Limit to 5 suggestions
}
```

### Progress Indicators

```typescript
// Show search progress
function showSearchProgress() {
  return {
    cache_search: 'instant',      // < 50ms
    remote_search: 'loading',     // 200-500ms
    merge_results: 'updating',    // < 100ms
    cache_update: 'background'    // Invisible to user
  };
}
```

## Performance Metrics

### Target Performance
- **Cold Start**: Newsletter index loaded < 2 seconds
- **Search Response**: Local results < 50ms, remote < 500ms
- **Offline Capability**: Full search functionality without network
- **Storage Efficiency**: 6MB for 242 newsletters + search capability

### Monitoring
```typescript
interface PerformanceMetrics {
  cache_hit_rate: number;      // % of searches served from cache
  avg_search_time: number;     // Average search response time
  offline_usage: number;       // % of searches performed offline
  storage_usage: number;       // Current storage consumption
  sync_frequency: number;      // Background sync frequency
}
```

## Implementation Example

### React Hook for Newsletter Search

```typescript
export function useNewsletterSearch() {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [source, setSource] = useState<'cache' | 'remote' | 'hybrid'>('cache');
  
  const search = useCallback(async (query: string) => {
    setIsLoading(true);
    
    // Immediate local results
    const localResults = await searchLocalCache(query);
    setResults(localResults);
    setSource('cache');
    
    // Background remote search
    try {
      const remoteResults = await searchRemoteAPI(query);
      const merged = mergeResults(localResults, remoteResults);
      setResults(merged);
      setSource('hybrid');
      
      // Update cache
      await updateLocalCache(remoteResults);
    } catch (error) {
      // Fallback to cache-only
      console.log('Remote search failed, using cache only');
    }
    
    setIsLoading(false);
  }, []);
  
  return { results, isLoading, search, source };
}
```

This caching strategy ensures fast, reliable newsletter search on mobile devices while minimizing bandwidth usage and providing offline capabilities.