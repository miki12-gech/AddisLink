import HeroSection from "../components/HeroSection";
import ProductGrid from "../components/ProductGrid";
import SearchFilters from "../components/SearchFilters";
import Pagination from "../components/Pagination";
// 1. Import Prisma directly (No more fetch API calls)
import prisma from "../lib/prisma";
import { Prisma } from "@prisma/client";

type Props = {
  searchParams: Promise<{ q?: string; minPrice?: string; maxPrice?: string; page?: string }>;
};

// 2. This function runs on the server and talks directly to the DB
async function getProducts(params: { q?: string; minPrice?: string; maxPrice?: string; page?: string }) {
  const page = parseInt(params.page || '1', 10);
  const pageSize = 12;

  // Build the Search Logic (WHERE clause)
  const where: Prisma.ProductWhereInput = {};

  if (params.q) {
    where.OR = [
      { title: { contains: params.q, mode: 'insensitive' } },
      // Optional: Search in description if your model has it
      // { description: { contains: params.q, mode: 'insensitive' } }
    ];
  }

  if (params.minPrice) {
    where.price = { ...where.price as object, gte: parseFloat(params.minPrice) };
  }

  if (params.maxPrice) {
    where.price = { ...where.price as object, lte: parseFloat(params.maxPrice) };
  }

  // Execute DB Query
  const [rawProducts, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      take: pageSize,
      skip: (page - 1) * pageSize,
      orderBy: { createdAt: 'desc' },
      include: { shop: true } // Include shop details so we can show shop name
    }),
    prisma.product.count({ where })
  ]);

  // Convert Dates to Strings (To prevent "Date object" warnings in Next.js)
  const products = rawProducts.map(p => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    shop: p.shop ? {
      ...p.shop,
      createdAt: p.shop.createdAt.toISOString(),
      updatedAt: p.shop.updatedAt.toISOString(),
    } : null
  }));

  return {
    products,
    pagination: {
      page,
      totalPages: Math.ceil(totalCount / pageSize),
      totalItems: totalCount
    }
  };
}

export default async function Home({ searchParams }: Props) {
  const params = await searchParams;

  // 3. Call the DB function directly
  const { products, pagination } = await getProducts(params);

  const title = params.q ? `Search Results for "${params.q}"` : "Featured Products";

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <SearchFilters />
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-12">
            {/* @ts-ignore - Suppress loose type matching for the grid */}
            <ProductGrid
              title={title}
              products={products}
            />

            <Pagination page={pagination.page} totalPages={pagination.totalPages} />

            {!products.length && (
              <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
                <p className="text-lg">No products found matching your criteria.</p>
                <p className="text-sm">Try using different filters or search terms.</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-16 bg-white py-12 border-y border-gray-100 rounded-2xl mx-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Why use AddisLink?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="p-6 bg-blue-50 rounded-xl">
                <h3 className="font-bold text-lg mb-2 text-blue-900">Verified Sellers</h3>
                <p className="text-blue-700">We verify every shop location and identity.</p>
              </div>
              <div className="p-6 bg-blue-50 rounded-xl">
                <h3 className="font-bold text-lg mb-2 text-blue-900">Direct Prices</h3>
                <p className="text-blue-700">See the real Telegram prices, updated instantly.</p>
              </div>
              <div className="p-6 bg-blue-50 rounded-xl">
                <h3 className="font-bold text-lg mb-2 text-blue-900">Smart Search</h3>
                <p className="text-blue-700">Find exactly what you want with our filters.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}