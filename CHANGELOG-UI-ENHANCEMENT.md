# Changelog

## [Unreleased]

### Enhanced - Dashboard UI Refresh (2025-09-19)

### Changed
- **Dashboard Redesign**: Completely refreshed the Dispatcher Dashboard UI with a modern, premium design
  - Replaced heavy blue theme with sophisticated Charcoal/Slate base and Amber accents
  - Implemented new color system using centralized theme tokens
  - Added subtle logistics-themed background image with proper fallbacks
  - Improved card design with soft elevation, rounded corners, and refined spacing
  - Compact hero section with reduced vertical space and better visual hierarchy
  - Enhanced KPI cards with consistent icon sizing and theme-aligned colors
  - Improved Recent Activity section with better readability and timestamps
  - Refined Quick Actions with clearer primary/secondary distinction
  - Updated sidebar with improved active/hover/focus states that align with new palette
- **RTL Support**: Maintained full RTL support with proper mirroring of layout, icons, and carets
- **Accessibility**: Ensured WCAG AA contrast compliance and maintained keyboard navigability
- **Responsive Design**: Improved responsive behavior across all viewport sizes (320px to ultrawide)
- **Performance**: Optimized assets and maintained LCP/CLS performance metrics
- **Micro-interactions**: Added subtle hover/press states with reduced motion support

### Added
- New theme file (`src/lib/theme.js`) with Charcoal/Slate base and Amber accents
- Background image handling with fallbacks (`src/assets/styles/background.css`)
- Logistics background image assets directory (`src/assets/images/`)
- Enhanced styling for all dashboard components

### Files Modified
- `src/frontend/src/components/Dashboard.jsx`
- `src/frontend/src/App.jsx`
- `src/frontend/src/lib/theme.js`
- `src/frontend/src/assets/styles/background.css`

### Files Added
- `src/frontend/src/assets/images/README.md`

### How to Revert
To revert these changes:
1. Replace `src/frontend/src/components/Dashboard.jsx` with the previous version
2. Replace `src/frontend/src/App.jsx` with the previous version
3. Delete `src/frontend/src/lib/theme.js`
4. Delete `src/frontend/src/assets/styles/background.css`
5. Delete `src/frontend/src/assets/images/README.md`