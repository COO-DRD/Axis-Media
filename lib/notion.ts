// ============================================================================
// Notion CMS Client - Simplified
// ============================================================================

import { Client } from '@notionhq/client'

const notion = new Client({ auth: process.env.NOTION_TOKEN })

const DATABASE_IDS = {
  caseStudies: process.env.NOTION_CASE_STUDIES_DATABASE_ID,
  research: process.env.NOTION_RESEARCH_DATABASE_ID,
  partners: process.env.NOTION_PARTNERS_DATABASE_ID,
}

// Helper types for Notion responses
type NotionPage = { id: string; properties: Record<string, unknown> }

function isFullPage(page: unknown): page is NotionPage {
  return !!page && typeof page === 'object' && 'properties' in page
}

// Property extractors
const getProp = {
  title: (props: Record<string, unknown>): string => {
    const p = Object.values(props).find((x): x is { type: 'title'; title: Array<{ plain_text: string }> } => 
      typeof x === 'object' && x !== null && 'type' in x && x.type === 'title'
    )
    return p?.title?.map((t) => t.plain_text).join('') ?? ''
  },
  
  richText: (props: Record<string, unknown>, name: string): string => {
    const p = props[name]
    if (typeof p === 'object' && p !== null && 'type' in p && p.type === 'rich_text') {
      return (p as unknown as { rich_text: Array<{ plain_text: string }> }).rich_text.map((t) => t.plain_text).join('')
    }
    return ''
  },
  
  select: (props: Record<string, unknown>, name: string): string => {
    const p = props[name]
    if (typeof p === 'object' && p !== null && 'type' in p && p.type === 'select') {
      return (p as unknown as { select: { name: string } | null }).select?.name ?? ''
    }
    return ''
  },
  
  multiSelect: (props: Record<string, unknown>, name: string): string[] => {
    const p = props[name]
    if (typeof p === 'object' && p !== null && 'type' in p && p.type === 'multi_select') {
      return (p as unknown as { multi_select: Array<{ name: string }> }).multi_select.map((s) => s.name)
    }
    return []
  },
  
  number: (props: Record<string, unknown>, name: string): number | null => {
    const p = props[name]
    if (typeof p === 'object' && p !== null && 'type' in p && p.type === 'number') {
      return (p as unknown as { number: number | null }).number
    }
    return null
  },
  
  checkbox: (props: Record<string, unknown>, name: string): boolean => {
    const p = props[name]
    if (typeof p === 'object' && p !== null && 'type' in p && p.type === 'checkbox') {
      return (p as unknown as { checkbox: boolean }).checkbox
    }
    return false
  },
}

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------
export interface CaseStudy {
  id: string
  title: string
  slug: string
  client: string
  industry: string
  year: number | null
  result: string
  resultLabel: string
  brief: string
  challenge: string
  solution: string
  stack: string[]
  metrics: { value: string; label: string }[]
  published: boolean
}

export interface ResearchArticle {
  id: string
  title: string
  slug: string
  category: string
  excerpt: string
  readTime: string
  featured: boolean
  content: { type: string; text: string; value?: string; label?: string }[]
}

export interface Partner {
  id: string
  name: string
  shortName: string
  category: string
  description: string
  collaboration: string
  highlight: string
  highlightValue: string
  highlightLabel: string
  order: number
}

// ----------------------------------------------------------------------------
// API Functions
// ----------------------------------------------------------------------------
export async function getCaseStudies(filterPublished = true): Promise<CaseStudy[]> {
  if (!DATABASE_IDS.caseStudies) throw new Error('NOTION_CASE_STUDIES_DATABASE_ID not set')

  const query = {
    database_id: DATABASE_IDS.caseStudies,
    sorts: [{ property: 'Year', direction: 'descending' as const }],
    ...(filterPublished && { filter: { property: 'Published', checkbox: { equals: true } } }),
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await (notion as any).databases.query(query)
  
  return response.results.filter(isFullPage).map((page: NotionPage): CaseStudy => {
    const title = getProp.title(page.properties)
    const metricsJson = getProp.richText(page.properties, 'Metrics')
    let metrics: { value: string; label: string }[] = []
    try { metrics = JSON.parse(metricsJson) } catch { /* ignore */ }

    return {
      id: page.id,
      title,
      slug: getProp.richText(page.properties, 'Slug') || title.toLowerCase().replace(/\s+/g, '-'),
      client: getProp.select(page.properties, 'Client'),
      industry: getProp.select(page.properties, 'Industry'),
      year: getProp.number(page.properties, 'Year'),
      result: getProp.richText(page.properties, 'Result'),
      resultLabel: getProp.richText(page.properties, 'Result Label'),
      brief: getProp.richText(page.properties, 'Brief'),
      challenge: getProp.richText(page.properties, 'Challenge'),
      solution: getProp.richText(page.properties, 'Solution'),
      stack: getProp.multiSelect(page.properties, 'Stack'),
      metrics,
      published: getProp.checkbox(page.properties, 'Published'),
    }
  })
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  const studies = await getCaseStudies()
  return studies.find((s) => s.slug === slug) ?? null
}

export async function getResearchArticles(filterPublished = true): Promise<ResearchArticle[]> {
  if (!DATABASE_IDS.research) throw new Error('NOTION_RESEARCH_DATABASE_ID not set')

  const query = {
    database_id: DATABASE_IDS.research,
    sorts: [
      { property: 'Featured', direction: 'descending' as const },
      { timestamp: 'created_time', direction: 'descending' as const },
    ],
    ...(filterPublished && { filter: { property: 'Published', checkbox: { equals: true } } }),
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await (notion as any).databases.query(query)
  
  return response.results.filter(isFullPage).map((page: NotionPage): ResearchArticle => {
    const title = getProp.title(page.properties)
    const contentJson = getProp.richText(page.properties, 'Content')
    let content: { type: string; text: string; value?: string; label?: string }[] = []
    try { content = JSON.parse(contentJson) } catch { /* ignore */ }

    return {
      id: page.id,
      title,
      slug: getProp.richText(page.properties, 'Slug') || title.toLowerCase().replace(/\s+/g, '-'),
      category: getProp.select(page.properties, 'Category'),
      excerpt: getProp.richText(page.properties, 'Excerpt'),
      readTime: getProp.richText(page.properties, 'Read Time'),
      featured: getProp.checkbox(page.properties, 'Featured'),
      content,
    }
  })
}

export async function getPartners(): Promise<Partner[]> {
  if (!DATABASE_IDS.partners) throw new Error('NOTION_PARTNERS_DATABASE_ID not set')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await (notion as any).databases.query({
    database_id: DATABASE_IDS.partners,
    sorts: [{ property: 'Order', direction: 'ascending' as const }],
    filter: { property: 'Published', checkbox: { equals: true } },
  })
  
  return response.results.filter(isFullPage).map((page: NotionPage): Partner => ({
    id: page.id,
    name: getProp.title(page.properties),
    shortName: getProp.richText(page.properties, 'Short Name'),
    category: getProp.select(page.properties, 'Category'),
    description: getProp.richText(page.properties, 'Description'),
    collaboration: getProp.richText(page.properties, 'Collaboration'),
    highlight: getProp.richText(page.properties, 'Highlight'),
    highlightValue: getProp.richText(page.properties, 'Highlight Value'),
    highlightLabel: getProp.richText(page.properties, 'Highlight Label'),
    order: getProp.number(page.properties, 'Order') ?? 0,
  }))
}

export { notion }
