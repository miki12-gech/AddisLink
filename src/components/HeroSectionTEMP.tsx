
import { Search } from 'lucide-react';
import SearchSection from './SearchSection';

export default function HeroSection() {
    return (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-20 px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">
                The Ethiopian Electronics Market
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-blue-100 mb-10">
                Search thousands of laptops, phones, and accessories from verified Telegram shops in Addis Ababa.
            </p>

            <SearchSection />

            <div className="mt-8 flex justify-center gap-4 text-sm text-blue-200">
                <span>Popular:</span>
                <button className="hover:text-white underline decoration-blue-400">MacBook</button>
                <button className="hover:text-white underline decoration-blue-400">PlayStation 5</button>
                <button className="hover:text-white underline decoration-blue-400">iPhone 14</button>
            </div>
        </div>
    );
}
