---
name: Executive Pulse
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#444651'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#757682'
  outline-variant: '#c5c5d3'
  surface-tint: '#4059aa'
  primary: '#00236f'
  on-primary: '#ffffff'
  primary-container: '#1e3a8a'
  on-primary-container: '#90a8ff'
  inverse-primary: '#b6c4ff'
  secondary: '#0058be'
  on-secondary: '#ffffff'
  secondary-container: '#2170e4'
  on-secondary-container: '#fefcff'
  tertiary: '#00311f'
  on-tertiary: '#ffffff'
  tertiary-container: '#004a31'
  on-tertiary-container: '#27c38a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b6c4ff'
  on-primary-fixed: '#00164e'
  on-primary-fixed-variant: '#264191'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system establishes an enterprise-grade, mobile-first visual language tailored for modern Human Capital Management (HCM) and workforce operations. It synthesizes executive precision with frontline usability, removing bureaucratic density in favor of clarity, speed, and confidence.

### Brand Personality & Emotional Impact
- **Trustworthy & Authoritative:** The interface conveys institutional stability, compliance readiness, and data integrity without feeling stiff or archaic.
- **Empathetic & Human:** Workforce workflows—such as PTO approvals, performance appraisals, and payroll reviews—are inherently personal. The system balances rigorous data with warm, reassuring micro-interactions and approachable typography.
- **Efficient & Uncluttered:** Optimized for executive decision-makers reviewing critical headcount metrics on the move, as well as frontline employees clocking in or requesting leave within seconds.

### Design Movement: Modern Corporate Precision
The aesthetic merges modern Scandinavian minimalism with functional SaaS utility:
- Crisp white and slate surface tiers that maintain high contrast under variable ambient mobile lighting conditions.
- Tonal hierarchy over decorative chrome: visual structure is communicated via background shifts, delicate borders, and typographic scale rather than aggressive containers.
- Purposeful semantic status tokens (attendance green, alert amber) that provide instantaneous ambient comprehension.

## Colors

The palette is engineered around high-credibility deep navy tones, supported by crisp functional blues and precise status indicators.

### Key Roles & Surface Strategy
- **Primary Navy (`#1E3A8A`):** Anchors high-priority actions, primary action bars, deep navigation headers, and executive identity accents.
- **Secondary Indigo Blue (`#3B82F6`):** Drives interactive states, interactive links, active tab highlights, and secondary CTAs.
- **Tertiary Emerald (`#10B981`):** Strictly reserved for positive operational feedback: confirmed clock-ins, approved requests, active employee badges, and payroll clears.
- **Status Amber (`#F59E0B`):** Handles pending lifecycle events: time-off requests pending review, missing timesheets, and system warnings.
- **Neutral Slate Range:**
  - Canvas Base: `#F8FAFC`
  - Elevated Surface: `#FFFFFF`
  - Subdued Borders: `#E2E8F0`
  - Secondary Text: `#64748B`
  - Dark Primary Text: `#0F172A`

### Contrast & Ergonomics
- Default mode is crisp light mode (`#F8FAFC` to `#FFFFFF`) to maintain high legibility across mobile displays outdoors and under office fluorescent lighting.
- All primary typography on default card backgrounds exceeds WCAG AAA contrast ratios (minimum 7:1 against `#FFFFFF`).

## Typography

This system uses **Plus Jakarta Sans** uniformly across display, body, and label roles. Its geometric foundation provides structural authority, while softened apertures and humanistic curves prevent numeric tables and HR documentation from feeling clinical.

### Typographic Hierarchy
- **Executive Metrics & Totals (`display-lg`):** Reserved for primary payroll figures, gross headcount numbers, and key summary KPIs.
- **Section Headers (`headline-lg`, `headline-md`):** Delineate major modules within the mobile viewport (e.g., "Pending Approvals", "Shift Roster").
- **Content & Narrative (`body-lg`, `body-md`):** Engineered with generous line-heights for rapid parsing of employee bios, policy explanations, and notification logs.
- **Meta & Categorical Tags (`label-md`, `label-sm`):** Set with slight positive letter spacing and semi-bold/bold weights to guarantee legibility on small-format attendance badges and timestamp pills.

## Layout & Spacing

A mobile-centric fluid layout system optimized for thumb-reach ergonomics, rapid scanning, and dense human resource data presentation.

### Screen Grids & Layout Flow
- **Mobile Handsets (< 640px):** Single-column layout with fixed `1rem` (16px) outer edge margins, utilizing full-width rounded cards and horizontal carousels for sub-module exploration.
- **Large Handsets & Small Tablets (640px - 768px):** 2-column contextual fluid grid with `1rem` gutters for split dashboard widgets (e.g., Quick Actions beside Leave Balance summary).

### Spacing Rhythm
- Strictly adheres to an 8pt spatial baseline with a half-step `0.25rem` (4px) scale for fine-grained inline components (chips, badges, icon margins).
- Component internal padding uses `space-md` (`1rem`) to `space-lg` (`1.5rem`), preventing interactive elements from clustering and reducing touch errors on shift check-ins.

## Elevation & Depth

Visual depth is achieved through ambient, cool-toned shadows paired with low-contrast structural borders, eschewing heavy drop shadows for an executive, light-handed look.

### Elevation Levels
- **Level 0 (Canvas Base):** Background canvas rendered in `#F8FAFC`. Zero elevation.
- **Level 1 (Card & Content Surface):** Pure `#FFFFFF` surface container paired with a hairline border (`1px solid #E2E8F0`) and an ambient shadow: `0 2px 8px -2px rgba(15, 23, 42, 0.04), 0 1px 3px -1px rgba(15, 23, 42, 0.02)`.
- **Level 2 (Active Cards & Floating Toggles):** Used for prioritized action modules and active calendar selectors: `0 8px 16px -4px rgba(30, 58, 138, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.03)`.
- **Level 3 (Modals & Bottom Drawers):** Used for sheet overlays, leave request submission flows, and employee profile previews: `0 20px 24px -4px rgba(15, 23, 42, 0.10), 0 8px 10px -4px rgba(15, 23, 42, 0.04)`.

## Shapes

The design system implements a refined curved architecture that softens administrative rigor while maintaining architectural discipline.

### Geometry Specifications
- **Standard Cards & Modules:** Bound to `rounded-2xl` (`1rem` / 16px) to house grouped employee metrics and organizational modules with friendly, distinct profiles.
- **Action Buttons & Form Inputs:** Set with balanced `0.5rem` to `0.75rem` corners to signal clickability while fitting ergonomically beneath user thumbs.
- **Pills, Badges & Avatars:** Fully rounded / pill shapes (`9999px`) for status indicators, counter indicators, and quick-filter chips.

## Components

### Buttons & Interactive Touch Targets
- **Primary Action (Clock In / Approve):** Solid `#1E3A8A` background, white label text, minimum 48px height with 16px horizontal padding. On press, transitions to `#172554`.
- **Secondary Action (Manage / View Details):** Subtle fill `#EFF6FF` with `#1E3A8A` label text, borderless.
- **Destructive / Reject:** Subdued red tint surface (`#FEF2F2`) with deep crimson text (`#991B1B`).

### Status Badges & Chips
- **Active / Present:** Background `#ECFDF5`, text `#065F46`, paired with an inline `#10B981` 6px solid circular dot.
- **Pending / In Review:** Background `#FFFBEB`, text `#92400E`, with an inline `#F59E0B` indicator.
- **Off-Duty / Archived:** Background `#F1F5F9`, text `#475569`.
- Badges carry `rounded-full` styling, 4px vertical by 10px horizontal padding, and use `label-sm` typography.

### Input Fields & Selectors
- Standard height of 48px to satisfy tactile mobile touch ergonomics.
- Background in `#FFFFFF`, framed with a 1px border of `#E2E8F0`.
- Focus state shifts border color to `#3B82F6` accompanied by an ambient `0 0 0 3px rgba(59, 130, 246, 0.15)` focus ring.
- Labels sit explicitly above inputs in `label-md` `#0F172A`, avoiding disappearing floating placeholders.

### Content Cards
- Constructed with `#FFFFFF` background, 16px internal padding, `rounded-2xl` contour, and hairline `#E2E8F0` border.
- Cards maintain clear divisional dividers between header actions and data bodies using `#F1F5F9` separator lines.

### Lists & Employee Rosters
- List items have a minimum hit target of 56px with zero horizontal borders internally, utilizing 1px `#F1F5F9` bottom row dividers inset by 16px to maintain reading cadence.
- Leading slot houses an avatar (40px circular) with an integrated bottom-right attendance status pin.