
import { Product } from '@/data/mockData'; // Initially importing type, but we might likely redefine it or standardise

// We need to bridge the Prisma type and Frontend type. 
// Ideally we share types, but for now let's define the API response type.

export interface ApiProduct {
    id: string;
    shopId: string;
    rawText: string;
    parsedSpecs: any;
    price: number;
    imageUrl: string | null;
    createdAt: string;
    shop: {
        name: string;
        isVerified: boolean;
        trustScore: number;
        locationLat: number | null;
        locationLong: number | null;
    }
}

// Convert API response to UI Product model
export function mapApiProductToUi(apiProduct: ApiProduct): Product {
    return {
        id: apiProduct.id,
        title: apiProduct.rawText.split('\n')[0] || 'Unknown Product',
        rawText: apiProduct.rawText,
        price: apiProduct.price,
        condition: 'Used', // Default or need parsing
        shop: {
            id: apiProduct.shopId,
            name: apiProduct.shop.name,
            isVerified: apiProduct.shop.isVerified,
            trustScore: apiProduct.shop.trustScore,
        },
        imageUrl: apiProduct.imageUrl || 'https://via.placeholder.com/300',
        postedAt: new Date(apiProduct.createdAt).toLocaleDateString(),
        specs: apiProduct.parsedSpecs as any || {},
    }
}

export interface PaginatedResult {
    data: Product[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export async function fetchProducts(
    query?: string,
    minPrice?: string,
    maxPrice?: string,
    page: number = 1
): Promise<PaginatedResult> {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    params.append('page', page.toString());
    params.append('limit', '12');

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const url = typeof window === 'undefined'
        ? `${baseUrl}/api/products?${params.toString()}`
        : `/api/products?${params.toString()}`;

    try {
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) {
            console.error(`Failed to fetch products: ${res.status}`);
            return { data: [], pagination: { total: 0, page: 1, limit: 12, totalPages: 0 } };
        }
        const responseData = await res.json();

        // Handle both old array format (fallback) and new paginated format
        if (Array.isArray(responseData)) {
            return {
                data: responseData.map(mapApiProductToUi),
                pagination: { total: responseData.length, page: 1, limit: 12, totalPages: 1 }
            };
        }

        return {
            data: responseData.data.map(mapApiProductToUi),
            pagination: responseData.pagination
        };

    } catch (error) {
        console.error("Error fetching products:", error);
        return { data: [], pagination: { total: 0, page: 1, limit: 12, totalPages: 0 } };
    }
}
