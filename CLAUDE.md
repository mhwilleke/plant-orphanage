# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Our Pine Corner is a Hugo static site featuring:
- **Landing page** at `/` with navigation to all sections
- **Spring Plant Giveaway** at `/spring-giveaway/` - seasonal plant adoption form
- **Fall Plant Giveaway** at `/fall-giveaway/` - seasonal plant adoption form
- **Kitchen Garden** at `/kitchen-garden/` - plant schedules and chicken notes
- **Garden Writing** - external link to Substack

Plant giveaways use Supabase for inventory tracking, filtered by season.

## Common Commands

```bash
# Development
npm run start              # Start Hugo dev server at localhost:1313
npm run start:lan          # Start Hugo server on LAN (192.168.1.10:1313)

# Build
npm run build              # Production build with minification
npm run build:preview      # Build with drafts and future content

# Linting
npm run lint               # Run all linters (scripts, styles, markdown)
npm run lint:scripts       # ESLint on assets/js, config, functions
npm run lint:styles        # StyleLint on SCSS files
npm run lint:markdown      # MarkdownLint on markdown files

# Utility
npm run clean              # Remove public/ and resources/ directories
npm run create             # Create new content with Hugo archetype
```

## Architecture

### Tech Stack
- **Hugo 0.95.0** - Static site generator
- **Bootstrap 5.3** - CSS framework
- **Supabase** - Database backend for plant inventory and adoption tracking
- **Babel/PostCSS** - JavaScript transpilation and CSS processing

### Site Structure
```
content/
├── _index.md              # Landing page
├── spring-giveaway/       # Spring plant adoption
│   └── index.md
├── fall-giveaway/         # Fall plant adoption
│   └── index.md
└── kitchen-garden/        # Kitchen garden content
    └── index.md

layouts/
├── index.html             # Landing page template
└── giveaway/
    └── single.html        # Giveaway form template (used by both seasons)
```

### Database Integration
The Supabase client in `assets/js/app.js` uses three tables:
- **OrphanedPlants** - Plant inventory with `season` column ("spring" or "fall")
- **Adopters** - User information (email, name, address)
- **AdoptedPlants** - Adoption records linking plants to adopters

The JavaScript reads `data-season` from the placeholder element to filter plants.

### Adding/Editing Giveaway Content
- Edit `content/spring-giveaway/index.md` or `content/fall-giveaway/index.md`
- The `season` frontmatter field must match the database values
- Form description text goes in the markdown body

### Deployment
- **Primary**: GitHub Pages (via GitHub Actions CI)
- **Secondary**: Netlify (configured in netlify.toml)

## Linting Configuration

- **ESLint**: Flat config in `eslint.config.mjs`, ignores `assets/js/vendor/`
- **StyleLint**: Standard SCSS config, ignores `assets/scss/vendor/`
- **MarkdownLint**: Configured in `.markdownlint-cli2.jsonc`
