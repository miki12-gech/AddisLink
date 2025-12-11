
'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function Pagination({ page, totalPages }: { page: number, totalPages: number }) {
    const searchParams = useSearchParams();

    const createPageLink = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', newPage.toString());
        return `/?${params.toString()}`;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="mt-12 flex justify-center gap-4 items-center">
            {page > 1 ? (
                <Link
                    href={createPageLink(page - 1)}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
                >
                    Previous
                </Link>
            ) : (
                <span className="px-4 py-2 border border-gray-200 rounded-md text-gray-300 cursor-not-allowed">Previous</span>
            )}

            <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>

            {page < totalPages ? (
                <Link
                    href={createPageLink(page + 1)}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
                >
                    Next
                </Link>
            ) : (
                <span className="px-4 py-2 border border-gray-200 rounded-md text-gray-300 cursor-not-allowed">Next</span>
            )}
        </div>
    );
}
