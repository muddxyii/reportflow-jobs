# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development

- `npm run dev` - Start development server with turbopack (runs on http://localhost:3000)
- `npm run build` - Build the Next.js application for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint for code quality checks

### Testing

No specific test commands are configured in this project.

## Architecture

This is a Next.js 15 application called "ReportFlow Jobs" that manages backflow prevention device testing and job
routing for plumbing/water system compliance.

### Key Application Features

- **Job Creation** (`/new`): Create new backflow testing jobs by uploading PDFs and extracting device information
- **Job Routing** (`/job-router`): Route and manage multiple jobs by uploading JSON files
- **PDF Processing** (`/pdf-editor`): Tools for PDF manipulation and field extraction

### Core Data Structure

The application centers around `JobData` which contains:

- `metadata`: Job metadata and tracking information
- `details`: Job-specific details and requirements
- `customerInformation`: Facility owner and representative contact info
- `backflowList`: Collection of backflow devices with their test data

Each backflow device includes:

- `locationInfo`: Physical location and coordinates
- `installationInfo`: Installation status and protection type
- `deviceInfo`: Device specifications, serial numbers, and comments
- `initialTest`/`finalTest`: Test results and measurements
- `repairs`: Repair information if needed

### PDF Processing System

- **PDFFieldExtractor** (`src/components/util/pdfFieldExtractor.ts`): Core PDF field extraction utility
- **pdfExtractor.ts**: High-level functions for extracting customer info, water purveyor data, and backflow device
  information from PDF forms
- Includes date validation and filtering logic to determine which comments to preserve from previous reports

### Technology Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with DaisyUI components
- **Maps**: Leaflet with React-Leaflet for location display
- **PDF Processing**: pdf-lib for PDF manipulation
- **Other**: TypeScript, Lucide React icons

### File Organization

- `src/app/`: Next.js app router pages
- `src/components/types/`: TypeScript type definitions for all data structures
- `src/components/util/`: Utility functions, especially PDF processing
- `src/components/`: Reusable UI components

### Import Paths

Uses `@/*` alias pointing to `src/*` for clean imports throughout the codebase.

## Commit Standards

Follow conventional commits format for all git commits:

- feat: New features
- fix: Bug fixes
- refactor: Code changes that neither fix bugs nor add features
- style: Code style changes (formatting, etc.)
- docs: Documentation changes
- chore: Maintenance tasks

## Environment Details

You run in an environment where ast-grep (`sg`) is available; whenever a search requires syntax-aware or structural
matching, default to `sg --lang typescript -p '<pattern>'` (or set `--lang` appropriately) and avoid falling back to
text-only tools like `rg` or `grep` unless i explicitly request a plain-text search.