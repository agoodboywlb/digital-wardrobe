import { useState, useEffect } from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    fallback?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
    src,
    alt,
    className,
    fallback = 'https://via.placeholder.com/300x400?text=No+Image',
    ...props
}) => {
    const [imgSrc, setImgSrc] = useState<string | undefined>(undefined);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!src) {
            setImgSrc(fallback);
            setLoading(false);
            return;
        }

        const cacheImage = async () => {
            try {
                const cache = await caches.open('wardrobe-image-cache');
                const cachedResponse = await cache.match(src);

                if (cachedResponse) {
                    const blob = await cachedResponse.blob();
                    setImgSrc(URL.createObjectURL(blob));
                    setLoading(false);
                    return;
                }

                // Fetch and cache
                const response = await fetch(src);
                if (response.ok) {
                    const clone = response.clone();
                    await cache.put(src, clone);
                    const blob = await response.blob();
                    setImgSrc(URL.createObjectURL(blob));
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error('Image cache error:', err);
                // Fallback to normal loading if cache fails
                setImgSrc(src);
            } finally {
                setLoading(false);
            }
        };

        void cacheImage();
    }, [src, fallback]);

    if (error || !imgSrc) {
        return <img src={fallback} alt={alt} className={className} {...props} />;
    }

    return (
        <div className={`relative ${className}`}>
            {loading && (
                <div className="absolute inset-0 bg-gray-100 dark:bg-white/5 animate-pulse" />
            )}
            <img
                src={imgSrc}
                alt={alt}
                className={`w-full h-full object-cover transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
                {...props}
            />
        </div>
    );
};

export default OptimizedImage;
