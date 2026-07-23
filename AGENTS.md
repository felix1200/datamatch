# AGENTS.md

## Project Overview

VLOOKUP Formula Builder — A pure frontend tool for generating Excel VLOOKUP formulas. Users upload Excel files, configure parameters through visual dropdowns, and batch-generate formulas with three output options.

## Tech Stack

- Next.js 16 (App Router) + React 19 + TypeScript 5
- Tailwind CSS 4 + shadcn/ui
- SheetJS (xlsx) for Excel file processing
- pnpm package manager

## Directory Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page (step-by-step flow)
│   └── globals.css         # Global styles
├── components/
│   ├── ui/                 # shadcn/ui component library
│   ├── file-upload.tsx     # Drag & drop file upload
│   ├── data-preview.tsx    # Data preview table
│   ├── vlookup-config.tsx  # VLOOKUP parameter configuration panel
│   └── output-panel.tsx    # Output panel (formulas/preview/download)
├── lib/
│   ├── utils.ts            # cn utility
│   ├── excel-utils.ts      # Excel parsing & export
│   └── vlookup-engine.ts   # VLOOKUP formula generation & execution
└── hooks/
    └── use-mobile.ts       # Mobile detection
```

## Core Features

1. **File Upload**: Supports xlsx/xls/csv, up to 2 files, drag & drop or click to upload
2. **Data Preview**: Table display with sheet switching, shows up to 50 rows
3. **Parameter Config**: Dropdowns for source/target file, lookup column, range columns, return columns (multiple), match mode
4. **Formula Generation**: Batch VLOOKUP formula generation for all rows
5. **Three Outputs**: Copy formula text, preview match results, download Excel file

## Build & Run

```bash
pnpm dev          # Development
pnpm build        # Production build
pnpm start        # Production start
pnpm ts-check     # TypeScript check
pnpm lint         # ESLint check
```
