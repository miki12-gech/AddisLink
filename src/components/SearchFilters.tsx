
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';

export default function SearchFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

    const [debouncedMin] = useDebounce(minPrice, 500);
    const [debouncedMax] = useDebounce(maxPrice, 500);

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());

        if (debouncedMin) params.set('minPrice', debouncedMin);
        else params.delete('minPrice');

        if (debouncedMax) params.set('maxPrice', debouncedMax);
        else params.delete('maxPrice');

        // Reset page on filter change
        params.delete('page');

        router.push(`/?${params.toString()}`);
    }, [debouncedMin, debouncedMax, router, searchParams]);

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-fit">
            <h3 className="font-bold text-gray-900 mb-4">Filters</h3>

            <div className="space-y-4">
                <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">Price Range (ETB)</label>
                    <div className="flex gap-2 items-center">
                        <input
                            type="number"
                            placeholder="Min"
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                        />
                        <span className="text-gray-400">-</span>
                        <input
                            type="number"
                            placeholder="Max"
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
