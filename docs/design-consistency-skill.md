# Skill: UI Design Consistency Rules for piceUI

Use this document whenever you design, extend, or refine any component, layout,
or demo page in `piceUI`.

The goal is simple: every new UI decision must strengthen the system, not add
random variation. Agents should treat this file as a design guardrail, not just
as loose inspiration.

---

## Purpose

This skill exists to help agents make UI decisions that stay visually coherent,
scalable, and reusable across the entire kit.

Agents must optimize for:

- token reuse over one-off styling
- consistent hierarchy over decorative variation
- predictable spacing over visual improvisation
- reusable patterns over page-specific exceptions

If a design choice looks good in one place but weakens the overall system, do
not use it.

---

## 1. Lock Tokens Before Designing

Before creating a new component or modifying an existing one, confirm that the
required visual values already exist in `tailwind.config.js`.

Agents must not introduce arbitrary new visual values directly inside component
markup or styles when the value should belong to the design system.

### Spacing Scale

Use only the approved spacing rhythm:

```text
4px  8px  12px  16px  24px  32px  48px  64px
```

Rules:

- use smaller spacing values (`4px`–`16px`) inside a component
- use larger spacing values (`32px`–`64px`) between sections or major layout blocks
- do not introduce awkward in-between values like `10px`, `18px`, or `22px`
- if a layout feels “almost right” only with a custom value, adjust the structure instead of inventing a new number

### Color Scale

Use one neutral palette plus at most one or two accent palettes, each with full
shades.

Example structure:

```text
neutral: 50 100 200 300 400 500 600 700 800 900
primary: 50 100 200 300 400 500 600 700 800 900
```

Rules:

- never add raw hex colors directly in components unless the system explicitly requires it
- never use “almost the same” colors outside the palette
- if a new color is genuinely needed, add it to the shared config first
- keep meaning stable: the same primary color should represent the same intent across the kit

### Typography Scale

Use a limited type scale for the full system.

```text
xs (12px)  sm (14px)  base (16px)  lg (18px)  xl (20px)  2xl (24px)  3xl (30px)
```

Rules:

- do not introduce additional font sizes unless there is a strong system-level reason
- one screen should usually use only `3` to `4` sizes, not the full scale
- body text should stay consistent across the kit
- hierarchy should come from size, weight, spacing, and contrast together, not size alone

### Border Radius and Shadow

Use only a small set of radius and elevation options.

Rules:

- keep radius to `2` or `3` intentional variants such as `sm`, `md`, and `lg`
- keep shadows equally restrained and reusable
- do not create isolated components with unique radius or shadow values unless they define a reusable new pattern

---

## 2. Preserve Clear Visual Hierarchy

Agents must avoid flat interfaces where every element competes equally for
attention.

Rules:

- each section should have one primary visual focus
- each action group should usually have one dominant action
- secondary actions must look secondary
- do not make every label, card, badge, and button equally loud

Hierarchy tools:

- size
- weight
- contrast
- spacing
- position
- emphasis through restraint

Additional guidance:

- do not rely only on larger text to create importance
- use whitespace to support important content
- reduce decorative noise before adding stronger styling
- avoid unnecessary helper labels if structure and styling already communicate meaning

Text contrast rules:

- muted text is acceptable on neutral backgrounds
- avoid weak gray text on accent or filled backgrounds
- on colored surfaces, prefer text colors with strong readable contrast

---

## 3. Component Completion Checklist

A component is not considered complete until it passes this checklist.

- [ ] All colors come from shared tokens in `tailwind.config.js`
- [ ] All spacing follows the approved spacing scale
- [ ] Typography uses the existing type scale only
- [ ] Border radius and shadow match existing system patterns
- [ ] Interactive components include at least `default`, `hover`, `focus`, and `disabled` states
- [ ] Dark mode behavior is considered and contrast remains readable
- [ ] The component supports the same visual language as neighboring components
- [ ] No one-off styling is added just to make a single screen “look nicer”

If any checkbox fails, the component should be revised before moving on.

---

## 4. Cross-Page Consistency Checklist

When working on full demo pages or multiple screens, agents must validate
consistency beyond the component level.

- [ ] Shared structures such as header, sidebar, footer, or layout shells are reused consistently
- [ ] Section spacing follows the same large-scale rhythm across pages
- [ ] Primary color usage keeps the same meaning everywhere
- [ ] Repeated components such as cards, tables, badges, or forms look identical unless a deliberate variant exists
- [ ] Similar content types follow similar composition patterns
- [ ] Theme behavior stays predictable in both light and dark mode

If the same component looks different on two pages without a clear reusable
reason, treat it as inconsistency and fix it.

---

## 5. Layout and Spacing Rules

This section is critical for consistency.

Many UI problems are not caused by the component itself, but by weak layout
decisions around grouping, spacing, wrapping, and alignment. Agents must treat
layout spacing as a first-class system rule.

### Flex and Grid Grouping

Use parent layout rules to control how repeated components are grouped,
spaced, wrapped, and aligned.

Agents must decide between `flex`, `grid`, and vertical stacking based on the
content relationship, not based on what is fastest to write.

#### When to Use Flex

Use `flex` when items form a simple one-dimensional group.

Good fit for `flex`:

- button groups
- badge groups
- inline actions
- toolbar items
- short filter controls
- small groups of switches or checkboxes

Flex rules:

- always define spacing with parent `gap-*`
- use `items-center` for mixed icon/text/control rows
- use `flex-wrap` when labels or items may exceed the available width
- avoid long single-line flex rows for forms and settings
- use `justify-between` only when the layout needs left/right separation, not as a spacing hack

Recommended flex pattern:

```html
<div class="flex flex-wrap items-center gap-6">
  <label class="form-switch">...</label>
  <label class="form-switch">...</label>
  <label class="form-switch">...</label>
</div>
```

#### When to Use Grid

Use `grid` when items need two-dimensional structure or stable alignment across
rows and columns.

Good fit for `grid`:

- card collections
- dashboard summaries
- form layouts with label/control columns
- repeated setting rows that need consistent alignment
- comparison blocks
- responsive content sections

Grid rules:

- use grid when columns should align consistently
- use `gap-*` for both row and column spacing
- use responsive columns intentionally, for example `grid-cols-1 md:grid-cols-2`
- avoid forcing unrelated content into equal columns just because grid is available
- do not mix many different column patterns inside similar sections

Recommended grid pattern:

```html
<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
  <div class="card">...</div>
  <div class="card">...</div>
</div>
```

#### When to Stack Vertically

Use vertical stacking when readability is more important than compactness.

Good fit for vertical stacking:

- forms
- settings lists
- long labels
- dense interactive controls
- mobile-first layouts
- content that users must scan carefully

Stacking rules:

- use `space-y-*` or parent `gap-*` consistently
- prefer `space-y-3` or `space-y-4` inside cards and forms
- prefer larger section spacing such as `mt-6`, `mt-8`, or `gap-8` between major groups
- do not compress settings into a horizontal row when labels become hard to scan

Recommended stacked pattern:

```html
<div class="space-y-4">
  <label class="form-switch">...</label>
  <label class="form-switch">...</label>
  <label class="form-switch">...</label>
</div>
```

#### Required Grouping Rules

Rules:

- use `gap-*` on the parent container for repeated items
- do not rely on label length, child margin, or accidental whitespace for separation
- use `flex` for linear groups and `grid` for more structured alignment
- use `flex-wrap` when horizontal space may become tight
- prefer vertical stacking for forms, settings, and dense control groups
- use grid when multiple rows should align into stable columns
- keep grouping rhythm consistent across similar sections
- choose one grouping strategy per section; avoid mixing `flex`, `grid`, and custom margins without a clear reason
- make the parent responsible for sibling spacing, not the child component

#### Decision Guide

- use `flex` when items flow in one row or one axis
- use `grid` when columns or rows must line up
- use vertical stacking when labels are long or scanning matters
- use `flex-wrap` when inline groups must adapt to smaller widths
- use larger parent gaps for interactive groups than for decorative groups

### Spacing Scale Usage

Agents must use spacing intentionally, not just visually.

Spacing communicates relationship:

- tight spacing means items belong together
- medium spacing means items are related but separate
- large spacing means a new group, section, or concept begins

#### Recommended Spacing Roles

Use this mapping when deciding spacing:

```text
4px   micro spacing: icon/text adjustment, compact internal detail
8px   tight grouping: label + helper, icon + label, checkbox + text
12px  comfortable grouping: switch + label, small stacked controls
16px  component internal rhythm: form fields, card body groups
24px  related block spacing: form groups, card sections
32px  section spacing: page sections, major content groups
48px  large page rhythm: hero to content, major layout separation
64px  very large separation: landing sections or template-level blocks
```

Rules:

- use small spacing inside a component
- use medium spacing between related component groups
- use large spacing between sections
- do not use spacing only to “make it look nicer” without defining the relationship
- avoid mixing many spacing values inside one small area
- if two items are related, they should not be separated like different sections
- if two items are unrelated, they should not be cramped like one component

#### Spacing Consistency Examples

Good:

```html
<div class="space-y-4">
  <div>Form field</div>
  <div>Form field</div>
</div>
```

Good:

```html
<section class="mt-8">
  <div class="grid grid-cols-1 gap-6 md:grid-cols-2">...</div>
</section>
```

Avoid:

```html
<div class="mt-[18px] flex gap-[22px]">...</div>
```

Custom spacing values should not be used unless they become formal system
tokens.

### Responsive Layout Rules

Agents must design layout behavior across screen sizes before finalizing a
component or page section.

Responsive behavior should be predictable, not accidental.

Rules:

- start with a readable mobile-first layout
- stack dense controls vertically on small screens
- only introduce columns when there is enough width
- use `flex-wrap` for inline groups that may overflow
- use responsive grid classes for card or content collections
- avoid layouts that depend on exact text length
- test whether labels still read clearly when the viewport narrows

#### Recommended Responsive Patterns

For cards or repeated content:

```html
<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
  <div class="card">...</div>
  <div class="card">...</div>
  <div class="card">...</div>
</div>
```

For inline controls:

```html
<div class="flex flex-wrap items-center gap-4 md:gap-6">
  <button class="btn btn-primary">Save</button>
  <button class="btn btn-secondary">Cancel</button>
</div>
```

For forms:

```html
<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
  <div>Form field</div>
  <div>Form field</div>
</div>
```

Agents should not create desktop-only layouts unless the component is explicitly
desktop-only.

### Template Catalog Layout Patterns

Use these rules when designing gallery-style pages such as `/templates/`,
`/blocks/`, or any browsing page that lists many visual items.

This kind of page is not a generic content page. It is a discovery layout.
Agents must optimize for scanning, filtering, comparison, and repeated-card
 consistency.

#### Structure Order

A template catalog page should usually follow this order:

1. compact top navigation
2. strong hero heading and short supporting text
3. search or quick-discovery input
4. optional popular tags or category chips
5. filter/sort controls
6. repeated card grid
7. promotional or CTA section
8. footer

Agents should avoid mixing these layers randomly.

#### Hero Rules

The hero area should introduce the catalog clearly without becoming taller than
necessary.

Rules:

- use one strong heading
- keep supporting text short
- place search close to the heading
- place quick tags below search if they help discovery
- avoid oversized decorative elements that push the grid too far down
- keep catalog hero vertical padding compact, usually `py-6` or `py-8`, not large landing-page spacing
- use `mt-4` to `mt-6` between hero elements so search, tags, and filters stay visually connected

#### Filter Bar Rules

Filters should feel lightweight and scannable.

Rules:

- group related controls in one horizontal bar when space allows
- use wrapping on smaller screens
- keep control height and spacing consistent
- keep filter bar near the hero/search area with compact top margin such as `mt-6`
- separate category filters from sort or technology filters when needed
- avoid mixing too many visual styles in one filter row

Recommended pattern:

```html
<div class="flex flex-wrap items-center justify-between gap-4">
  <div class="flex flex-wrap items-center gap-3">...</div>
  <div class="flex flex-wrap items-center gap-3">...</div>
</div>
```

#### Card Grid Rules

Catalog cards must prioritize visual consistency over individual decoration.

Rules:

- use a stable responsive grid such as `grid-cols-1 md:grid-cols-2 xl:grid-cols-3`
- keep card media ratio consistent across the page
- keep card padding and internal spacing identical
- keep title, meta, and description positions predictable
- avoid mixing large and small card variants in the same main grid
- use equal spacing between rows and columns
- keep card actions or pricing aligned consistently

Recommended pattern:

```html
<div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
  <article class="card">...</article>
  <article class="card">...</article>
  <article class="card">...</article>
</div>
```

#### Scanning Rules

Users should be able to scan many items quickly.

Rules:

- thumbnails should dominate the card more than long text
- descriptions should stay short and secondary
- repeated metadata should use the same placement in every card
- use whitespace to separate rows cleanly
- avoid dense card footers with too many competing details

#### Promotional Section Rules

If the page includes a marketing banner or upgrade CTA, it should feel like a
separate section after the main browsing grid.

Rules:

- place it after a meaningful number of cards or near the bottom
- make it visually distinct from catalog cards
- keep its call-to-action simple and singular
- do not interrupt browsing rhythm too often with promotional blocks

#### Template Catalog Checklist

- [ ] Hero, search, filters, grid, and CTA follow a clear vertical order
- [ ] Search and filters support browsing instead of distracting from it
- [ ] Grid columns stay consistent across similar viewports
- [ ] Card media, title, text, and meta align predictably
- [ ] The page remains easy to scan with many repeated items
- [ ] Promotional sections feel separate from the main grid

### Form Layout Patterns

Form layouts need extra consistency because users scan labels, inputs, errors,
and actions in sequence.

Rules:

- stack form fields vertically by default
- keep label, control, helper text, and error text as one visual group
- use `space-y-1` or equivalent tight spacing inside one field group
- use `space-y-4` or `gap-4` between fields
- use `gap-6` or `mt-6` before major form action groups
- align checkboxes, radios, and switches consistently
- do not mix compact and spacious form rhythm in the same form
- keep error spacing stable so validation does not visually break the layout

#### Field Group Pattern

Use this structure for a basic field:

```html
<div class="space-y-1">
  <label class="form-label">Email</label>
  <input class="form-control" type="email">
  <p class="form-text">We will never share your email.</p>
</div>
```

#### Settings List Pattern

Use this structure for switches, checkboxes, and setting controls:

```html
<div class="space-y-3">
  <label class="form-switch">...</label>
  <label class="form-switch">...</label>
  <label class="form-switch">...</label>
</div>
```

#### Action Group Pattern

Use this structure for form actions:

```html
<div class="mt-6 flex flex-wrap items-center gap-3">
  <button class="btn btn-primary">Save</button>
  <button class="btn btn-secondary">Cancel</button>
</div>
```

Form components should feel calm and predictable. If a form layout feels noisy,
agents should reduce layout variation before changing component styling.

### Spacing Responsibility

Agents must separate component responsibility from layout responsibility.

- the component controls its internal spacing and states
- the parent layout controls spacing between sibling components
- do not overload a component with extra margin just to fix one page layout
- if multiple components feel cramped, fix the parent container first

### Readability Rules

Repeated interactive items must never feel visually attached to one another.

Rules:

- each item should read as its own clear group
- adjacent labels and controls must have visible breathing room
- avoid dense horizontal rows when labels are medium or long
- when in doubt, stack vertically instead of forcing a single-row layout
- use larger parent gaps such as `gap-6` or `gap-8` for interactive groups

### Layout Checklist

- [ ] Parent container defines spacing between repeated items
- [ ] Repeated controls do not visually collide
- [ ] Flex rows wrap when width becomes constrained
- [ ] Grid is used when alignment is more important than flow
- [ ] Similar sections use the same spacing rhythm

### Sidebar Navigation Rules

Sidebar navigation must stay structurally consistent across documentation pages.

Rules:

- use top-level sidebar groups only for major documentation areas
- use nested children for related pages inside the same area
- do not create a new top-level sidebar group when the content belongs under an existing major area
- keep icon usage consistent across parent items and important child items
- use icons on parent or top-level navigation items only; nested sub-menu items should usually use text only
- keep long labels readable by using an appropriate sidebar width before forcing text wrapping
- avoid mixing unrelated navigation depths in the same visual group

Recommended structure:

```text
Getting Started
  Introduction

Foundations
  Layout System
  Customization
    Customize Components
    Config
    Base Style
    Colors
    Icons
    Themes
    Utilities And Variables
    RTL
    Theme Generator

Library
  Components
  Forms
  Blocks
  Templates
```

Customization pages are foundation-level guidance. They should be nested under
`Foundations`, not placed as a separate top-level sidebar group.

---

## 6. Anti-Patterns Agents Must Avoid

Do not do the following:

- add a new color, radius, spacing value, or font size “just for this one case”
- design components in isolation without checking how they behave beside existing patterns
- over-detail a single page before the broader layout system is stable
- create too many button, card, or badge variants without clear repeated usage
- use visual decoration to hide weak structure
- solve consistency problems with exceptions instead of system updates

If an exception appears necessary, agents should first ask:

1. Can this be solved by reusing an existing token?
2. Can this be solved by adjusting layout or hierarchy?
3. If this becomes a new pattern, should it be formalized in the system?

Only after those checks should a new system rule be introduced.

---

## 7. Forms Switch Rules

Use these rules whenever agents create, edit, or document the `forms/switch`
component.

The switch is a form control for binary settings. It should feel like part of
the same form family as `.form-control`, `.form-check`, and `.form-label`.

For any layout involving multiple switches, agents must also follow the general
layout rules in the `Layout and Spacing Rules` section.

### Required Markup

Agents must use this structure for switches:

```html
<label class="form-switch">
  <input class="form-switch-input" type="checkbox" checked>
  <span class="form-switch-track"></span>
  <span class="form-switch-label">Email notifications</span>
</label>
```

Rules:

- use `type="checkbox"` for the native control
- keep the input accessible and focusable; do not replace it with a non-semantic `div`
- keep `.form-switch-track` immediately after `.form-switch-input`
- keep `.form-switch-label` after the visual track
- use clear setting labels such as “Email notifications”, not vague labels like “Enable”

### Visual Rules

Switch styling must follow the shared form system.

Rules:

- use neutral colors for the off state
- use `primary` color only for the on state
- use the approved spacing scale for track size, knob size, gaps, and movement
- use `rounded-full` for the track and knob because switches are pill-shaped controls
- use the existing small text scale for labels
- do not add custom hex colors, custom widths, or custom transform distances

Current token-aligned sizing pattern:

```text
track: h-4 w-8
knob:  h-4 w-4
move:  translate-x-4
gap:   gap-3
```

### State Rules

Every switch must support these states:

- default off
- checked on
- keyboard focus visible
- disabled
- dark mode off
- dark mode on

Agents must preserve visible focus styling. A switch without keyboard focus
feedback is incomplete.

### Usage Rules

Use a switch only for immediate binary preferences or settings.

Good examples:

- email notifications
- dark mode preference
- public profile visibility
- auto-renew setting

Avoid switches for:

- one-time form consent
- destructive confirmation
- multi-step actions
- choices that require explanation before taking effect

For consent, terms agreement, or selection inside a form, prefer checkbox
patterns instead of switch patterns.

### Layout Rules

Switches must remain visually readable when several options appear together.

This is mainly a spacing and grouping problem, not a flex problem. Agents may
use `flex`, but each switch item must have enough separation from the next item
so the previous label does not visually touch the next switch track.

Rules:

- avoid placing many switches in one tight horizontal row
- use vertical stacking for settings lists by default
- define `.form-switch` as a block-level flex row, not `inline-flex`, so repeated switches stack cleanly inside vertical containers
- when using horizontal flex, apply spacing on the parent container, not by relying only on label text width
- use `gap-6` or `gap-8` between switch groups in horizontal layouts
- use `flex-wrap` when the available width is limited
- use horizontal layout only for short labels and small groups of `2` to `3` switches
- keep enough spacing between each switch group so the track does not visually attach to the previous label
- do not let a switch track sit immediately after another switch label without clear separation
- align switch tracks consistently, especially in settings panels or forms

Preferred stacked pattern:

```html
<div class="space-y-3">
  <label class="form-switch">
    <input class="form-switch-input" type="checkbox" checked>
    <span class="form-switch-track"></span>
    <span class="form-switch-label">Email notifications</span>
  </label>

  <label class="form-switch">
    <input class="form-switch-input" type="checkbox">
    <span class="form-switch-track"></span>
    <span class="form-switch-label">Marketing updates</span>
  </label>
</div>
```

If switches must be shown inline, wrap each `.form-switch` as a separate group
and use a clear parent gap such as `gap-6` or `gap-8`.

Recommended inline pattern:

```html
<div class="flex flex-wrap items-center gap-6">
  <label class="form-switch">
    <input class="form-switch-input" type="checkbox" checked>
    <span class="form-switch-track"></span>
    <span class="form-switch-label">Email notifications</span>
  </label>

  <label class="form-switch">
    <input class="form-switch-input" type="checkbox">
    <span class="form-switch-track"></span>
    <span class="form-switch-label">Marketing updates</span>
  </label>
</div>
```

### Completion Checklist for `forms/switch`

- [ ] Uses the required `.form-switch` markup structure
- [ ] Uses native `input[type="checkbox"]`
- [ ] Keeps visual values within approved tokens
- [ ] Includes checked, unchecked, focus, disabled, and dark-mode behavior
- [ ] Uses a clear label that describes the setting
- [ ] Appears consistent beside other form controls
- [ ] Multiple switches are spaced or stacked so labels and tracks do not collide visually
- [ ] Is documented in the Forms page with preview and HTML example

---

## 8. Agent Workflow

Agents should follow this sequence every time they add or revise UI:

1. review the target screen or component in context
2. map the required spacing, colors, type, radius, and states to existing tokens
3. reuse an existing pattern before creating a new one
4. apply hierarchy intentionally
5. check component-level consistency
6. check page-level consistency
7. only then finalize implementation

When uncertain, agents should prefer the more conservative and reusable design
decision.

---

## 9. Decision Standard for Agents

A design decision is correct only if it is:

- visually clear
- system-friendly
- reusable
- consistent with existing tokens
- consistent across light and dark contexts
- easy for the next agent to extend without adding chaos

Agents should not aim to make a component merely attractive. Agents should aim
to make the UI kit more coherent after every change.
