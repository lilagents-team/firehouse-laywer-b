# Changelog

All notable changes to the Firehouse Lawyer website will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.0] - 2025-08-22

### Added
- **Complete Newsletter Archive System** - Fully functional newsletter search and archive
  - **157 Real Newsletters** processed from 1997-2025 with actual legal content
  - **Advanced Search Engine** - Full-text search across titles, summaries, keywords, and content
  - **Dynamic Routing System** - Multiple access patterns (`/v/volume/edition`, `/:slug`, `/:year/:month`)
  - **PDF Integration** - Intelligent PDF filename matching with regex-based fallback detection
  - **Static File Generation** - Netlify-compatible static JSON files for production deployment
  - **Real-time Search Results** - Client-side filtering with date-based sorting (newest first)
  - **Clickable Keywords & Topics** - Navigate between related newsletters via keyword/topic links
  - **Mobile-Optimized Interface** - Responsive design with industrial theme styling

### Enhanced
- **Newsletter Data Processing Pipeline**
  - **Volume/Edition Extraction** - Automatic parsing from filenames (`v13n04apr2015` format)
  - **Content Validation** - Filters out test data, includes only newsletters with actual titles
  - **PDF File Matching** - Multiple regex patterns for finding corresponding PDF files
  - **Cache Management** - Dynamic index generation with file-based caching
  - **Error Handling** - Graceful handling of corrupted JSON files (8 files with parsing errors)

- **Practice Areas Integration**
  - **Newsletter Cross-linking** - Practice area cards link to relevant newsletter searches
  - **Search Term Mapping** - Each practice area includes curated search terms
  - **Dynamic Latest Issue Section** - Pulls real data from most recent newsletter instead of hardcoded content

- **Production Deployment System**
  - **Hybrid API Strategy** - Server routes for development, static files for Netlify production
  - **Build Process Integration** - Newsletter generation runs automatically during `npm run build`
  - **Static JSON Structure** - Creates `/api/newsletters/index.json` and individual newsletter files
  - **Route Compatibility** - Frontend works with both server APIs and static files

### Technical Infrastructure
- **Newsletter Data Architecture**
  - Real legal content extraction from 203 newsletter JSON files
  - Smart volume/edition parsing from filename patterns
  - Comprehensive PDF file matching with multiple fallback strategies
  - File-based caching system for improved performance
  - Static file generation for JAMstack deployment compatibility

- **Search & Navigation Features**
  - URL parameter handling for pre-filled searches from external links
  - Search query persistence and clearing logic
  - Date-based sorting of results (newest newsletters first)
  - Clickable topics and keywords for content discovery
  - Smart routing with year vs volume detection

- **Content Management Improvements**
  - Removed fallback to example data with `[CORRUPTED]` markers
  - Implemented real newsletter data validation and filtering
  - Enhanced error handling for malformed JSON files
  - Automatic PDF URL generation and validation

### Fixed
- **Test Data Removal** - Eliminated all example/test data in favor of real newsletter content
- **Route Conflicts** - Resolved conflicts between static `.json` files and server routes
- **PDF Link Issues** - Fixed broken PDF links with improved filename matching
- **Search Parameter Handling** - Fixed search input clearing when navigating without search parameters
- **Production Compatibility** - Resolved Netlify static hosting limitations with API endpoints

### Newsletter Content Highlights
- **242 PDF Files Available** with 157 successfully processed newsletters
- **Real Legal Cases** - Predisik v. Spokane School District, Hood v. City of Vancouver, etc.
- **Washington State Statutes** - RCW references, Public Records Act updates, FLSA compliance
- **Fire Department Legal Issues** - Employment law, public records, emergency services, contract law
- **Historical Coverage** - From 1997 Volume 1 through 2025 Volume 23

### Build & Deployment
- **Automated Static Generation** - Newsletter JSON files created during build process
- **Optimized Assets** - 374.90 kB JS bundle (114.95 kB gzipped), 85.66 kB CSS (13.98 kB gzipped)
- **Production Ready** - All static files generated for Netlify deployment
- **Error Resilience** - Build succeeds despite 8 corrupted source files

## [1.0.0] - 2025-08-22

### Added
- **Core Website Launch**
  - Modern React frontend with urban/industrial design theme
  - Sveltia CMS integration for content management
  - Responsive design optimized for mobile and desktop
  - Attorney profiles and practice area showcases
  - Contact forms and newsletter subscription functionality

### Pages
- **Home Page** - Hero section with firm overview and services
- **Practice Areas** - Detailed service offerings for fire departments
- **Attorneys** - Professional profiles for Joseph F. Quinn and Eric T. Quinn
- **Newsletter** - Archive of legal updates with search functionality
- **Contact** - Contact forms and office information

### Design System
- **Urban/Industrial Theme**
  - Dark color palette with neon orange accents
  - Bebas Neue and Montserrat typography
  - Gritty textures and industrial styling elements
  - Custom CSS utilities for consistent theming

### Content Management
- **Sveltia CMS Setup** - Modern, fast alternative to Netlify CMS
- **GitHub Authentication** - Secure content editing workflow
- **Markdown Content Structure** - Organized content files
- **Version Control Integration** - All content changes tracked in Git

### Technical Infrastructure
- **Express.js Backend** - API server with route handling
- **React 18 Frontend** - Modern component-based architecture
- **Tailwind CSS** - Utility-first styling framework
- **Vite Build System** - Fast development and production builds
- **TypeScript** - Type-safe development environment

### Deployment Options
- **Netlify Static Hosting** - For content-only deployment
- **Replit Development** - Full-stack development environment
- **Production Hosting** - Vercel/Railway support for full features

### Previous Releases
- **Formatting improvements** (9080787)
- **Service card heading size improvements** (c48a5ce) 
- **UI polish and refinements** (28e017d)
- **Attorney profile readability improvements** (a698e52)
- **Office hours display consistency** (8b8f915)
- **Contact page heading updates** (90ca4a7, 4e92632)
- **Download icon and interaction improvements** (e425e96, a9c3f1b)

---

## Newsletter Search System (Future Implementation)

The newsletter search system is designed but not yet implemented in the main website. The architecture supports:

- **242 Historical Newsletters** spanning 1997-2025
- **AI-Powered Compression** using Ollama for efficient mobile search
- **Corruption Detection** for PDF-to-text conversion issues
- **Hybrid Search Strategy** combining remote API and local cache
- **Mobile-First Performance** with <50ms search response times
- **Offline Capability** through IndexedDB caching

Implementation will be added in future releases as a progressive enhancement to the existing working newsletter page.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test newsletter search functionality if applicable
5. Submit a pull request

## License

Copyright © 2025 Joseph F. Quinn, P.S. All rights reserved.