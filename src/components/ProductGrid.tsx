import { Product } from '@/data/mockData';
import ProductCard from './ProductCard';

interface ProductGridProps {
    title: string;
    products: Product[];
}

export default function ProductGrid({ title, products }: ProductGridProps) {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8">{title}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}
