
import Image from 'next/image';
import { Product } from '@/data/mockData';
import { MapPin, Clock, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <Link href={`/products/${product.id}`} className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-blue-200 cursor-pointer block">
            <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                <Image
                    src={product.imageUrl}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                    {product.condition === 'New' && (
                        <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                            NEW
                        </span>
                    )}
                    {product.shop.isVerified && (
                        <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm flex items-center">
                            <ShieldCheck className="w-3 h-3 mr-1" />
                            VERIFIED
                        </span>
                    )}
                </div>
            </div>

            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                        {product.title}
                    </h3>
                </div>

                <div className="flex items-baseline mb-3">
                    <span className="text-xl font-bold text-blue-600">
                        {product.price.toLocaleString()} ETB
                    </span>
                </div>

                <div className="space-y-1 text-sm text-gray-500 mb-4">
                    {/* Specs: Showing RAM, Storage, Processor, Gen */}
                    <div className="flex flex-wrap gap-2">
                        {product.specs.ram && <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">{product.specs.ram}</span>}
                        {product.specs.storage && <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">{product.specs.storage}</span>}
                        {product.specs.processor && <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs border border-blue-100">{product.specs.processor}</span>}
                        {product.specs.generation && <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs border border-blue-100">{product.specs.generation}</span>}
                    </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                    <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {product.shop.name}
                    </div>
                    <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {product.postedAt}
                    </div>
                </div>
            </div>
        </Link>
    );
}
