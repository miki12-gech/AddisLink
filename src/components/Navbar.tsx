
import Link from 'next/link';
import { Search, Menu } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="text-2xl font-bold text-blue-600 tracking-tight">
                            AddisLink
                        </Link>
                    </div>

                    <div className="hidden md:flex space-x-8 items-center">
                        <Link href="/" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                            Browse
                        </Link>
                        <Link href="https://t.me/AddisLink_bot" target="_blank" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                            For Sellers
                        </Link>
                        <Link href="https://t.me/AddisLink_bot" target="_blank" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                            Post Item
                        </Link>
                    </div>

                    <div className="flex items-center md:hidden">
                        <button className="text-gray-500 hover:text-gray-700 p-2">
                            <Search className="h-6 w-6" />
                        </button>
                        <button className="text-gray-500 hover:text-gray-700 p-2 ml-2">
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
