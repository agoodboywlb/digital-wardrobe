import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { useState, useRef } from 'react';

import OptimizedImage from './OptimizedImage';

import type { ItemImage } from '@/types/index';

interface ImageGalleryProps {
    images?: ItemImage[];
    mainImageUrl: string;
    name: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images = [], mainImageUrl, name }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    // If no detailed images, show only the main one
    const displayImages = images.length > 0
        ? images
        : [{ id: 'primary', imageUrl: mainImageUrl, isPrimary: true }];

    const handleScroll = () => {
        if (scrollRef.current) {
            const scrollLeft = scrollRef.current.scrollLeft;
            const width = scrollRef.current.offsetWidth;
            const index = Math.round(scrollLeft / width);
            setCurrentIndex(index);
        }
    };

    const scrollTo = (index: number) => {
        if (scrollRef.current) {
            const width = scrollRef.current.offsetWidth;
            scrollRef.current.scrollTo({
                left: index * width,
                behavior: 'smooth'
            });
            setCurrentIndex(index);
        }
    };

    return (
        <div className="relative w-full aspect-square group">
            {/* Scroll Container */}
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-none no-scrollbar"
                style={{ scrollBehavior: 'smooth' }}
            >
                {displayImages.map((img, idx) => (
                    <div key={img.id} className="flex-shrink-0 w-full h-full snap-center">
                        <OptimizedImage
                            src={img.imageUrl}
                            alt={`${name} - ${idx + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
            </div>

            {/* Pagination Indicators */}
            {displayImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 px-3 py-1.5 bg-black/20 backdrop-blur-md rounded-full">
                    {displayImages.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => scrollTo(idx)}
                            className={`size-1.5 rounded-full transition-all duration-300 ${currentIndex === idx ? 'bg-white w-4' : 'bg-white/50'
                                }`}
                        />
                    ))}
                </div>
            )}

            {/* Navigation Arrows (Visible on hover if non-mobile) */}
            {displayImages.length > 1 && (
                <>
                    <button
                        onClick={() => scrollTo(Math.max(0, currentIndex - 1))}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 dark:bg-black/20 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => scrollTo(Math.min(displayImages.length - 1, currentIndex + 1))}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 dark:bg-black/20 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </>
            )}

            {/* Image Counter (Top Right) */}
            {displayImages.length > 1 && (
                <div className="absolute top-4 right-4 px-2.5 py-1 bg-black/40 backdrop-blur-md rounded-lg text-[10px] font-bold text-white tracking-widest uppercase">
                    {currentIndex + 1} / {displayImages.length}
                </div>
            )}

            {/* View Fullscreen Toggle Placeholder */}
            <button className="absolute bottom-4 right-4 p-2 rounded-full bg-black/20 backdrop-blur-md text-white active:scale-90 transition-transform">
                <Maximize2 className="w-4 h-4 opacity-70" />
            </button>
        </div>
    );
};

export default ImageGallery;
