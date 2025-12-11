
'use client';

import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce'; // We might need to install this or write custom hook

export default function SearchSection() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [text, setText] = useState(searchParams.get('q') || '');
    const [query] = useDebounce(text, 500);

    useEffect(() => {
        if (query !== searchParams.get('q')) { // Only push if changed to avoid loop
            if (query) {
                router.push(`/?q=${encodeURIComponent(query)}`);
            } else {
                router.push('/');
            }
        }
    }, [query, router, searchParams]);

    return (
        <div className="max-w-3xl mx-auto relative">
            <div className="relative flex items-center">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
                <input
                    type="text"
                    className="w-full bg-white rounded-full py-4 pl-14 pr-4 shadow-xl text-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all border-none"
                    placeholder="Search for 'MacBook Pro' or 'iPhone 14'..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors">
                    Search
                </button>
            </div>
        </div>
    );
}
