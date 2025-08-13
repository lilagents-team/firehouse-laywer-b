# Eric T. Quinn, P.S. - Fire Service Law Firm Website

## Overview

This is a professional law firm website built for Eric T. Quinn, P.S., specializing in legal services for fire districts, regional fire authorities, and emergency services across the Pacific Northwest. The application is a modern full-stack web application using React for the frontend and Express.js for the backend.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **UI Framework**: Shadcn/UI components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom fire service themed colors (fire-navy, fire-red, fire-orange)
- **State Management**: TanStack React Query for server state management
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Module System**: ES modules
- **API Design**: RESTful endpoints for contact forms and newsletter subscriptions
- **Request Logging**: Custom middleware for API request logging and performance monitoring
- **Error Handling**: Centralized error handling middleware

### Database Architecture
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Schema Management**: Drizzle migrations in `/migrations` directory
- **Current Storage**: In-memory storage implementation for users (to be replaced with actual database)

## Key Components

### Core Pages
- **Home**: Hero section, practice areas overview, and newsletter subscription
- **Practice Areas**: Detailed information about legal services offered
- **Attorneys**: Profiles of Eric T. Quinn and Joseph F. Quinn
- **Newsletter**: Current and archived issues with subscription functionality
- **Contact**: Contact form and office information

### UI Components
- Comprehensive Shadcn/UI component library including forms, navigation, cards, and dialogs
- Custom newsletter subscription component with sidebar variant
- Responsive navigation with mobile menu support
- Professional footer with contact information and quick links

### Backend Services
- Contact form submission endpoint (`/api/contact`)
- Newsletter subscription endpoint (`/api/newsletter/subscribe`)
- Input validation using Zod schemas
- Placeholder for email service integration
- Static content serving for CMS markdown files

### Content Management System
- **CMS**: Sveltia CMS (modern alternative to Decap CMS) integration
- **Authentication**: GitHub OAuth for secure content editing
- **Content Structure**: Markdown files with frontmatter for all page content
- **Content Types**: Pages, Attorney profiles, Practice areas, Newsletter issues, Site settings
- **Admin Interface**: Available at `/admin` with enhanced visual editing interface and improved performance

## Data Flow

1. **Client Requests**: React components make API calls using TanStack Query and load CMS content
2. **API Processing**: Express routes handle requests with validation and logging
3. **Content Management**: Markdown files with frontmatter served statically, parsed client-side
4. **Data Persistence**: Currently uses in-memory storage, designed for PostgreSQL integration
5. **Response Handling**: Standardized JSON responses with success/error messaging
6. **UI Updates**: React Query manages cache invalidation and optimistic updates
7. **CMS Integration**: Sveltia CMS provides GitHub-authenticated content editing interface with enhanced performance and modern UX

## External Dependencies

### Core Dependencies
- **UI**: Radix UI primitives, Tailwind CSS, Lucide React icons
- **Forms**: React Hook Form with Hookform Resolvers for validation
- **Database**: Drizzle ORM with Neon serverless PostgreSQL driver
- **Content**: Gray-matter for markdown parsing, Remark for HTML processing
- **Utilities**: Date-fns for date formatting, clsx for conditional styling

### Development Tools
- **Build**: Vite with React plugin and ESBuild for production
- **Types**: TypeScript with strict configuration
- **Linting**: Path aliases configured for clean imports
- **Development**: Hot module replacement and error overlay

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds optimized React bundle to `/dist/public`
- **Backend**: ESBuild bundles Express server to `/dist/index.js`
- **Assets**: Static assets served from `/attached_assets` (law firm content)

### Environment Configuration
- **Development**: Vite dev server with Express backend integration
- **Production**: Single Node.js process serving both static files and API
- **Database**: Requires `DATABASE_URL` environment variable for PostgreSQL connection

### Key Scripts
- `npm run dev`: Development with hot reload
- `npm run build`: Production build for both frontend and backend
- `npm run start`: Production server
- `npm run db:push`: Apply database schema changes

The application follows a monorepo structure with shared types and schemas, making it easy to maintain consistency between frontend and backend while supporting the specific needs of a professional law firm website.