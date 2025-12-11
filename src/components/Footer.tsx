
export default function Footer() {
    return (
        <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">AddisLink</h3>
                        <p className="mt-4 text-base text-gray-500">
                            Connecting buyers and sellers in Addis Ababa through a trusted, transparent marketplace.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Contact</h3>
                        <p className="mt-4 text-base text-gray-500">
                            support@addislink.com<br />
                            +251 900 000 000
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">For Sellers</h3>
                        <p className="mt-4 text-base text-gray-500">
                            <a href="#" className="hover:text-gray-900">Register Shop</a><br />
                            <a href="#" className="hover:text-gray-900">Telegram Bot</a>
                        </p>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-200 pt-8 text-center">
                    <p className="text-base text-gray-400">&copy; 2025 AddisLink. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
