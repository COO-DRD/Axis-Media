# Notion Database Setup Guide

Complete guide for creating Notion databases that match the CMS integration.

## Prerequisites

1. Create a Notion integration at https://www.notion.so/my-integrations
2. Copy the Internal Integration Token
3. Share each database with your integration

## Database 1: Case Studies

### Properties to Create

| Property Name | Type | Options/Config |
|--------------|------|----------------|
| **Name** | Title | (default) |
| **Slug** | Rich text | URL-friendly identifier |
| **Client** | Select | Pwani Oil, Mombasa Continental, Coast General, etc. |
| **Industry** | Select | Hospitality, Healthcare, Manufacturing, etc. |
| **Year** | Number | Year completed |
| **Published** | Checkbox | Only checked items appear on site |
| **Result** | Rich text | Short result statement |
| **Result Label** | Rich text | e.g., "Revenue Increase" |
| **Brief** | Rich text | Project summary |
| **Challenge** | Rich text | What problem was solved |
| **Solution** | Rich text | How it was solved |
| **Stack** | Multi-select | React, Next.js, SEO, Analytics, etc. |
| **Metrics** | Rich text | JSON array: `[{"value":"340%","label":"Revenue"}]` |

### Example Entry

```
Name: Pwani Oil Digital Transformation
Slug: pwani-oil-digital-transformation
Client: Pwani Oil Products
Industry: Manufacturing
Year: 2024
Published: ☑
Result: 340% increase in qualified leads
Result Label: Lead Generation
Brief: Complete digital overhaul for Kenya's leading cooking oil manufacturer
Challenge: Legacy website not mobile-friendly, zero organic visibility
Solution: Built Next.js e-commerce with SEO foundation and analytics
Stack: Next.js, Stripe, SEO, Analytics
Metrics: [{"value":"340%","label":"Revenue"},{"value":"#1","label":"Ranking"}]
```

## Database 2: Research Articles

### Properties to Create

| Property Name | Type | Options/Config |
|--------------|------|----------------|
| **Name** | Title | Article title |
| **Slug** | Rich text | URL-friendly |
| **Category** | Select | Strategy, Technical, Trends, Case Study |
| **Excerpt** | Rich text | 1-2 sentence summary |
| **Read Time** | Rich text | "5 min read" |
| **Published** | Checkbox | Visibility control |
| **Featured** | Checkbox | Appears in hero section |
| **Content** | Rich text | JSON array of content blocks |

### Content JSON Format

```json
[
  {"type": "lead", "text": "Opening paragraph that draws the reader in..."},
  {"type": "heading", "text": "The Challenge"},
  {"type": "paragraph", "text": "Body content here..."},
  {"type": "stat", "value": "73%", "label": "of B2B buyers research online first"},
  {"type": "quote", "text": "Key insight quote", "author": "Source Name"}
]
```

### Content Block Types

- `lead` - Opening paragraph (larger text)
- `heading` - Section header
- `paragraph` - Body text
- `stat` - Highlighted statistic with value + label
- `quote` - Blockquote with optional author
- `list` - Bulleted list (text contains items)

## Database 3: Partners

### Properties to Create

| Property Name | Type | Options/Config |
|--------------|------|----------------|
| **Name** | Title | Partner company name |
| **Short Name** | Rich text | Display name if different |
| **Category** | Select | Technology, Creative, Media, Consulting |
| **Published** | Checkbox | Visibility |
| **Order** | Number | Display order (1, 2, 3...) |
| **Description** | Rich text | What they do |
| **Collaboration** | Rich text | How you work together |
| **Highlight** | Rich text | Key achievement text |
| **Highlight Value** | Rich text | Number/metric |
| **Highlight Label** | Rich text | What the number means |

### Example Entry

```
Name: Vercel
Short Name: (blank)
Category: Technology
Published: ☑
Order: 1
Description: Cloud platform for static sites and serverless functions
Collaboration: Deploy and host all client Next.js applications
Highlight: 99.99% uptime for all deployed applications
Highlight Value: 99.99%
Highlight Label: Uptime SLA
```

## Setting Up Environment Variables

After creating databases, copy each database ID from the URL:

```
https://www.notion.so/workspace/[DATABASE_ID]?v=...
                 ^^^^^^^^^^^^
                 This part
```

Add to `.env.local`:

```env
# Notion CMS
NOTION_TOKEN=ntn_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_CASE_STUDIES_DATABASE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
NOTION_RESEARCH_DATABASE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
NOTION_PARTNERS_DATABASE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

## Testing the Integration

```bash
# Test Notion connection
curl -X POST \
  https://api.notion.com/v1/databases/YOUR_DB_ID/query \
  -H "Authorization: Bearer $NOTION_TOKEN" \
  -H "Notion-Version: 2022-06-28" \
  -H "Content-Type: application/json" \
  -d '{"page_size": 1}'
```

## Troubleshooting

### "database_not_found" error
- Make sure you shared the database with your integration
- Check the database ID is correct (no query params)

### Properties not showing
- Property names are case-sensitive in queries
- Ensure property types match (Select vs Multi-select)

### Empty results
- Check "Published" checkbox is checked
- Verify filter in code matches your property name

## Pro Tips

1. **Use templates**: Create a template page in each database with default values
2. **Add cover images**: Upload to page cover for case study hero images
3. **Icon colors**: Use colored icons for quick visual scanning
4. **Relations**: Can add "Related Cases" relation between articles and case studies
5. **Formulas**: Add formula properties for auto-generated slugs if needed

## Quick Reference: Database IDs

| Database | ID | Status |
|----------|-----|--------|
| Case Studies | `NOTION_CASE_STUDIES_DATABASE_ID` | ⬜ Need to create |
| Research | `NOTION_RESEARCH_DATABASE_ID` | ⬜ Need to create |
| Partners | `NOTION_PARTNERS_DATABASE_ID` | ⬜ Need to create |
