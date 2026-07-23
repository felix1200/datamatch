# DESIGN.md

## Design Tokens

### Colors
- Primary: Excel Green `#1D6F42` — evokes spreadsheets and data processing
- Accent: Light Green `#E8F5E9` — for highlights and selected states
- Background: White `#FFFFFF` + Off-White `#F8FAFB` — clean data tool atmosphere
- Text: Dark Gray `#1A1A2E` primary, `#6B7280` secondary
- Border: `#E5E7EB` — visually lightweight

### Typography
- Data display: Monospace `JetBrains Mono` (Google Fonts) for number alignment
- UI text: System default font stack

### Border Radius
- Cards: `12px`
- Buttons/Inputs: `8px`
- Table cells: `4px`

## Layout & Responsive
- Max width `1200px` centered
- Step-based layout: Upload → Preview → Configure → Output, clear vertical flow
- Data preview table: horizontal scroll, fixed first column

## Interaction & States
- Drag & drop zone: dashed border + hover highlight
- Formula output: code block style, one-click copy with feedback animation
- Match results: green highlight for success, red for unmatched

## Design Don'ts
- No gradients or complex shadows
- No dark mode (data tools work best in light theme)
- Avoid excessive animations that distract from data reading
