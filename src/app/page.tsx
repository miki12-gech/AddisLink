
import HeroSection from "../components/HeroSection";
import ProductGrid from "../components/ProductGrid";
import SearchFilters from "../components/SearchFilters";
import Pagination from "../components/Pagination";

// 1. Import the API function we created earlier
// (Adjust the path '../api/Api' if your file is in a different folder, e.g., '@/api/Api')
import { fetchProducts } from "../lib/api";

type Props = {
  searchParams: Promise<{ q?: string; minPrice?: string; maxPrice?: string; page?: string }>;
};

export default async function Home({ searchParams }: Props) {
  // 1. Await params (Required for Next.js 15)
  const params = await searchParams;
  const currentPage = parseInt(params.page || '1', 10);

  // 2. Fetch Data from Render Backend
  // We use the API function instead of calling Prisma directly.
  // This fixes the build error and ensures we use the correct backend logic.
  const { data: products, pagination } = await fetchProducts(
    params.q,
    params.minPrice,
    params.maxPrice,
    currentPage
  );

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
            {/* 
              We pass the data from the API to the grid. 
              The API already formatted the data correctly.
            */}
            {/* @ts-ignore - Keeping this if your Grid types are slightly different */}
            <ProductGrid
              title={title}
              products={products}
            />

            {/* Pagination Controls */}
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
            />

            {/* Empty State */}
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