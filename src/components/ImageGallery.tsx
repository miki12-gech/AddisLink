'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageGalleryProps {
    images: string[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(images[0] || null);

    if (!selectedImage) {
        return <div className="h-96 flex items-center justify-center text-gray-400">No Image Available</div>;
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="relative h-96 w-full bg-white rounded-xl overflow-hidden border border-gray-100">
                <Image
                    src={selectedImage}
                    alt="Product Main"
                    fill
                    className="object-contain p-2"
                />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedImage(img)}
                            className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === img ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <Image
                                src={img}
                                alt={`Thumbnail ${idx + 1}`}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
