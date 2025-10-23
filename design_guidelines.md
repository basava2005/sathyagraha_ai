# Satyagrah.AI Design Guidelines

## Design Approach
**Selected Framework:** Professional Legal SaaS Design System
- **Justification:** Utility-focused legal platform requiring trust, professionalism, and information clarity. Draws inspiration from enterprise legal tech (Clio, LegalZoom) combined with Indian government portal aesthetics for cultural relevance.
- **Core Principles:** Authority, Accessibility, Efficiency, Trust

## Color Palette

**Light Mode:**
- Primary Purple: `270 60% 50%` (from logo - professional, dignified)
- Primary Dark: `270 70% 35%` (headers, emphasis)
- Secondary Blue: `220 70% 45%` (trust, government association)
- Success Green: `142 71% 45%` (document generation success)
- Warning Amber: `38 92% 50%` (compliance alerts)
- Error Red: `0 84% 60%` (validation errors)
- Background: `0 0% 98%` (clean, paper-like)
- Surface: `0 0% 100%` (white cards)
- Text Primary: `220 15% 20%` (high readability)
- Text Secondary: `220 10% 45%`
- Border: `220 15% 90%`

**Dark Mode:**
- Primary Purple: `270 60% 60%`
- Background: `220 20% 10%`
- Surface: `220 18% 14%`
- Text Primary: `220 5% 95%`
- Text Secondary: `220 5% 70%`
- Border: `220 15% 25%`

## Typography

**Font Stack:**
- Headings: 'Inter', sans-serif (700, 600, 500 weights) - professional, highly legible
- Body: 'Inter', sans-serif (400, 500 weights)
- Legal/Code: 'JetBrains Mono', monospace - for document templates and legal text

**Scale:**
- Hero/H1: text-4xl/text-5xl (36-48px)
- H2: text-3xl (30px)
- H3: text-2xl (24px)
- H4: text-xl (20px)
- Body Large: text-lg (18px)
- Body: text-base (16px)
- Small: text-sm (14px)
- Caption: text-xs (12px)

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16
- Component padding: p-4, p-6, p-8
- Section spacing: py-12, py-16
- Gap between elements: gap-4, gap-6, gap-8

**Grid System:**
- Admin Dashboard: 12-column grid with sidebar (64px icons + 240px expanded)
- Document Forms: 2-column on desktop (md:grid-cols-2), single column mobile
- Template Gallery: 3-column grid (lg:grid-cols-3)
- Max container width: max-w-7xl for dashboards, max-w-4xl for forms

## Component Library

**Navigation:**
- Sidebar: Collapsible icon-only (64px) / expanded (280px) with purple accent on active items
- Top bar: White/dark surface with user profile, notifications, search
- Breadcrumbs: Always visible in admin sections for deep navigation

**Forms:**
- Input fields: Outlined style with floating labels, border-2 on focus with purple accent
- Template forms: Multi-step wizard with progress indicator at top
- Validation: Inline error messages below fields in red
- File upload: Drag-and-drop zone with preview for logo/signatures

**Cards:**
- Document cards: White surface, subtle shadow (shadow-md), hover lift effect
- Template cards: Icon/preview image top, title, description, "Use Template" CTA
- Stats cards: Large number display with icon, trend indicator

**Tables:**
- Admin tables: Striped rows, sortable headers, sticky header on scroll
- Document history: Expandable rows showing metadata
- Pagination: Numbers + arrows, showing "1-10 of 234 documents"

**Buttons:**
- Primary: Purple solid (hover darkens 10%)
- Secondary: Purple outline
- Success: Green solid for "Generate PDF", "Download"
- Sizes: sm (px-3 py-1.5), md (px-4 py-2), lg (px-6 py-3)

**Data Display:**
- Document viewer: White canvas with shadow, toolbar with zoom, download, print
- AI consultation: Chat-style interface with user bubbles (purple) and AI bubbles (gray)
- Legal references: Accordion lists with IPC/CrPC section numbers prominently displayed

**Overlays:**
- Modals: Centered, max-w-2xl, blur backdrop
- Toasts: Top-right corner, auto-dismiss, icon + message
- PDF preview: Full-screen modal with controls

**Admin Panel Specific:**
- User management table with role badges (Admin: purple, User: blue)
- Template editor: Split view (form builder left, preview right)
- Analytics dashboard: Chart cards using chart.js or similar
- Activity logs: Timeline view with timestamps

## Images

**Hero Section (Landing Page):**
- Large hero image suggestion: Indian legal symbolism - Lady Justice statue with Indian tricolor, modern courthouse architecture, or abstract scales/gavel with tech elements
- Placement: Full-width hero, 60vh height, purple overlay gradient (left to right, 70% opacity to 40%)
- Text overlay: White text on left third, "Empowering Legal Justice with AI" headline

**Template Thumbnails:**
- Each template card shows preview of first page of document
- Placeholder: Document icon with template name overlay

**Profile/Logo:**
- Satyagrah.AI logo prominently in navbar (height: h-8 to h-10)
- Watermark: 20% opacity logo centered on generated PDFs

**Dashboard:**
- Empty states: Friendly illustrations (legal books, documents with checkmarks)
- No large decorative images in admin sections - focus on data density

## Animations

Use sparingly and purposefully:
- Button hover: subtle scale (1.02) and shadow increase
- Card hover: translate-y (-2px) with shadow transition
- Modal entry: fade-in with slight scale (0.95 to 1)
- Form transitions: slide in multi-step wizard panels
- Loading states: Spinner for PDF generation with percentage counter
- NO scroll animations, parallax effects, or decorative motions

## Special Considerations

**Legal Document Styling:**
- PDF templates use formal serif fonts (Times New Roman equivalent)
- Watermark: Diagonal "DRAFT" until finalized, logo background at 10% opacity
- Headers/footers: Page numbers, generation date, user details
- Margins: Professional legal document spacing (1.5-2 inches)

**Accessibility:**
- WCAG AA contrast ratios throughout
- Keyboard navigation for all forms and admin functions
- Screen reader labels for all interactive elements
- Focus indicators: 2px purple ring

**Responsive Breakpoints:**
- Mobile: Stacked layouts, hamburger menu
- Tablet (md): 2-column forms, visible sidebar
- Desktop (lg): Full 3-column grids, expanded sidebar by default