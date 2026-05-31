import { prisma } from './prisma';
import { CVData } from './cv';

export type CategoryType = 'pillar' | 'subhub' | 'spoke';

export interface CVCategory {
    id: string;
    slug: string;
    name: string;
    nameDutch: string;
    description: string;
    type: CategoryType;
    parentId: string | null;
    sampleCV: CVData | null;
    heroTitle: string | null;
    heroText: string | null;
    tips: string[];
    metaTitle: string;
    metaDesc: string;
    keywords: string[];
    siblingIds: string[];
}

export interface CategoryWithRelations extends CVCategory {
    parent: CVCategory | null;
    children: CVCategory[];
    siblings: CVCategory[];
}

// Get a category by its full path (e.g., ['ict-en-software', 'backend-developer-nodejs'])
export async function getCategoryByPath(slugPath: string[]): Promise<CategoryWithRelations | null> {
    if (slugPath.length === 0) return null;

    const slug = slugPath[slugPath.length - 1];

    const category = await prisma.cVCategory.findUnique({
        where: { slug },
        include: {
            parent: true,
            children: {
                orderBy: { name: 'asc' }
            }
        }
    });

    if (!category) return null;

    // Verify the path is correct by checking parent chain
    if (slugPath.length > 1) {
        let current = category;
        for (let i = slugPath.length - 2; i >= 0; i--) {
            if (!current.parent || current.parent.slug !== slugPath[i]) {
                return null; // Path doesn't match
            }
            current = current.parent as typeof category;
        }
    }

    // Fetch siblings (categories with same parent)
    const siblings = category.siblingIds.length > 0
        ? await prisma.cVCategory.findMany({
            where: { id: { in: category.siblingIds } }
        })
        : await prisma.cVCategory.findMany({
            where: {
                parentId: category.parentId,
                id: { not: category.id }
            },
            take: 3,
            orderBy: { name: 'asc' }
        });

    return {
        ...category,
        sampleCV: category.sampleCV as CVData | null,
        siblings
    } as CategoryWithRelations;
}

// Get all pillar categories for the main overview page
export async function getPillarCategories(): Promise<CVCategory[]> {
    const pillars = await prisma.cVCategory.findMany({
        where: { type: 'pillar' },
        orderBy: { name: 'asc' }
    });

    return pillars.map(p => ({
        ...p,
        sampleCV: p.sampleCV as CVData | null
    })) as CVCategory[];
}

// Get all categories for sitemap generation
export async function getAllCategories(): Promise<CVCategory[]> {
    const categories = await prisma.cVCategory.findMany({
        orderBy: [
            { type: 'asc' },
            { name: 'asc' }
        ]
    });

    return categories.map(c => ({
        ...c,
        sampleCV: c.sampleCV as CVData | null
    })) as CVCategory[];
}

// Get category with its full breadcrumb path
export async function getCategoryBreadcrumbs(category: CVCategory): Promise<CVCategory[]> {
    const breadcrumbs: CVCategory[] = [category];

    let currentParentId = category.parentId;
    while (currentParentId) {
        const parent = await prisma.cVCategory.findUnique({
            where: { id: currentParentId }
        });
        if (!parent) break;

        breadcrumbs.unshift({
            ...parent,
            sampleCV: parent.sampleCV as CVData | null
        } as CVCategory);
        currentParentId = parent.parentId;
    }

    return breadcrumbs;
}

// Build full URL path for a category
export async function getCategoryFullPath(category: CVCategory): Promise<string> {
    const breadcrumbs = await getCategoryBreadcrumbs(category);
    const slugs = breadcrumbs.map(b => b.slug);
    return `/cv-voorbeeld/${slugs.join('/')}`;
}

// Get related categories for internal linking
export async function getRelatedCategories(category: CVCategory, limit = 3): Promise<CVCategory[]> {
    // First try explicit siblings
    if (category.siblingIds.length > 0) {
        const siblings = await prisma.cVCategory.findMany({
            where: { id: { in: category.siblingIds.slice(0, limit) } }
        });
        return siblings.map(s => ({
            ...s,
            sampleCV: s.sampleCV as CVData | null
        })) as CVCategory[];
    }

    // Otherwise, get siblings from same parent
    const siblings = await prisma.cVCategory.findMany({
        where: {
            parentId: category.parentId,
            id: { not: category.id }
        },
        take: limit,
        orderBy: { name: 'asc' }
    });

    return siblings.map(s => ({
        ...s,
        sampleCV: s.sampleCV as CVData | null
    })) as CVCategory[];
}

// Get children categories
export async function getCategoryChildren(categoryId: string): Promise<CVCategory[]> {
    const children = await prisma.cVCategory.findMany({
        where: { parentId: categoryId },
        orderBy: { name: 'asc' }
    });

    return children.map(c => ({
        ...c,
        sampleCV: c.sampleCV as CVData | null
    })) as CVCategory[];
}
