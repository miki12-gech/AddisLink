'use client';
import React, { useState } from 'react';
import Image from 'next/image';

interface ImageGalleryProps {
    images: string[]; // Array of image URLs
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
    const [selected, setSelected] = useState(images[0] || '');

    if (!images || images.length === 0) {
        return <div className="flex items-center justify-center h-96 bg-gray-100 text-gray-400">No images</div>;
    }

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="relative h-96 w-full bg-gray-100 rounded-xl overflow-hidden">
                <Image src={selected} alt="Product image" fill className="object-contain" />
            </div>

            {/* Thumbnails */}
            <div className="flex flex-wrap gap-2 justify-center">
                {images.map((src, idx) => (
                    <button
                        key={idx}
                        type="button"
                        className={`relative h-20 w-20 rounded border ${src === selected ? 'border-blue-500' : 'border-gray-200'}`}
                        onClick={() => setSelected(src)}
                    >
                        <Image src={src} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ImageGallery;
