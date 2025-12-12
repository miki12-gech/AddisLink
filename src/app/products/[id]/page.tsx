
import { PrismaClient } from '@prisma/client';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { MapPin, Phone, ShieldCheck, ArrowLeft, Calendar } from 'lucide-react';
import Link from 'next/link';
import ImageGallery from '../../../components/ImageGallery';

const prisma = new PrismaClient();

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // We fetch directly from DB for SSG/SSR efficiency on detail pages
    const product = await prisma.product.findUnique({
        where: { id },
        include: { shop: true }
    });

    if (!product) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link href="/" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Search
                </Link>

                <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {/* Image Section */}
                        <div className="relative bg-gray-100 rounded-xl overflow-hidden">
                            <ImageGallery images={product.images.length > 0 ? product.images : (product.imageUrl ? [product.imageUrl] : [])} />
                        </div>

                        {/* Content Section */}
                        <div className="p-8 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    {product.shop.isVerified && (
                                        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center">
                                            <ShieldCheck className="w-3 h-3 mr-1" />
                                            Verified Shop
                                        </span>
                                    )}
                                    <span className="text-gray-500 text-xs flex items-center">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        {new Date(product.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                <h1 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                                    {/* Naive title extraction */}
                                    {product.rawText.split('\n')[0] || "Electronics Item"}
                                </h1>

                                <p className="text-3xl font-extrabold text-blue-600 mb-6">
                                    {product.price.toLocaleString()} ETB
                                </p>

                                {/* Specs parsing - reusing the stored JSONB or fallback */}
                                <div className="mb-6">
                                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Specs</h3>

                                    <div className="flex flex-wrap gap-2">
                                        {/* Try to cast the JSON to our known shape if possible, strictly typed it would be better */}
                                        {product.parsedSpecs && typeof product.parsedSpecs === 'object' && Object.entries(product.parsedSpecs).map(([key, value]) => (
                                            <span key={key} className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-md capitalize">
                                                {key}: {String(value)}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Original Caption */}
                                <div className="bg-gray-50 p-4 rounded-xl mb-6">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">Original Post</h3>
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{product.rawText}</p>
                                </div>
                            </div>

                            {/* Shop Details / CTA */}
                            <div className="border-t border-gray-100 pt-6">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <p className="font-bold text-gray-900 text-lg">{product.shop.name}</p>
                                        <p className="text-gray-500 text-sm flex items-center">
                                            <MapPin className="w-3 h-3 mr-1" />
                                            Lat: {product.shop.locationLat?.toFixed(4)}, Long: {product.shop.locationLong?.toFixed(4)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        {/* Placeholder map button */}
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${product.shop.locationLat},${product.shop.locationLong}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 text-xs hover:underline"
                                        >
                                            View on Map
                                        </a>
                                    </div>
                                </div>

                                <a
                                    href={`tel:${product.shop.phoneNumber}`}
                                    className="w-full flex justify-center items-center bg-green-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                                >
                                    <Phone className="w-5 h-5 mr-2" />
                                    Call Shop: {product.shop.phoneNumber}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
