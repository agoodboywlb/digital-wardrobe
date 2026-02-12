import { Reorder } from 'framer-motion';
import { X, Star, GripVertical, Plus } from 'lucide-react';
import { useState, useRef } from 'react';

import ImageEditor from './ImageEditor';
import OptimizedImage from './OptimizedImage';

export interface MultiImageFile {
    id: string;
    url: string;
    file?: File;
    isPrimary: boolean;
    dbId?: string;
    label?: string;
}

interface MultiImageUploaderProps {
    images: MultiImageFile[];
    onImagesChange: (images: MultiImageFile[]) => void;
    maxImages?: number;
}

const MultiImageUploader: React.FC<MultiImageUploaderProps> = ({
    images,
    onImagesChange,
    maxImages = 8
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editingUrl, setEditingUrl] = useState<string>('');
    const [tempFile, setTempFile] = useState<File | null>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const url = URL.createObjectURL(file);
            setEditingUrl(url);
            setTempFile(file);
            setIsEditing(true);
        }
    };

    const handleImageSave = (blob: Blob, preview: string) => {
        const fileName = (tempFile?.name || 'item.jpg').replace(/\.[^/.]+$/, "") + ".webp";
        const file = new File([blob], fileName, { type: 'image/webp' });

        const newImage: MultiImageFile = {
            id: Math.random().toString(36).substring(7),
            url: preview,
            file,
            isPrimary: images.length === 0,
        };

        onImagesChange([...images, newImage]);
        setIsEditing(false);
        setTempFile(null);
    };

    const removeImage = (id: string) => {
        const newImages = images.filter(img => img.id !== id);
        // If we removed the primary, assign a new one if available
        if (images.find(img => img.id === id)?.isPrimary && newImages.length > 0) {
            newImages[0]!.isPrimary = true;
        }
        onImagesChange(newImages);
    };

    const setPrimary = (id: string) => {
        onImagesChange(images.map(img => ({
            ...img,
            isPrimary: img.id === id
        })));
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Reorder.Group
                    axis="y"
                    values={images}
                    onReorder={onImagesChange}
                    className="contents" // Use grid from parent
                >
                    {images.map((img) => (
                        <Reorder.Item
                            key={img.id}
                            value={img}
                            className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 group hover:ring-2 hover:ring-primary/30 transition-all touch-none"
                        >
                            <OptimizedImage
                                src={img.url}
                                className="w-full h-full object-cover"
                            />

                            {/* Primary Badge */}
                            {img.isPrimary && (
                                <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-primary text-text-main text-[9px] font-bold rounded-md flex items-center gap-0.5 shadow-sm">
                                    <Star className="w-2.5 h-2.5 fill-current" />
                                    主图
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                {!img.isPrimary && (
                                    <button
                                        onClick={() => setPrimary(img.id)}
                                        className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40"
                                        title="设为主图"
                                    >
                                        <Star className="w-4 h-4" />
                                    </button>
                                )}
                                <button
                                    onClick={() => removeImage(img.id)}
                                    className="p-2 bg-red-500/80 backdrop-blur-md rounded-full text-white hover:bg-red-600"
                                    title="删除"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Drag Handle */}
                            <div className="absolute bottom-2 right-2 p-1 bg-black/40 backdrop-blur-sm rounded text-white/50 cursor-grab">
                                <GripVertical className="w-3.5 h-3.5" />
                            </div>
                        </Reorder.Item>
                    ))}
                </Reorder.Group>

                {/* Add Button */}
                {images.length < maxImages && (
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all active:scale-[0.98]"
                    >
                        <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-full">
                            <Plus className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider">
                            添加 ({images.length}/{maxImages})
                        </span>
                    </button>
                )}
            </div>

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileSelect}
            />

            {isEditing && (
                <ImageEditor
                    image={editingUrl}
                    onSave={handleImageSave}
                    onCancel={() => setIsEditing(false)}
                />
            )}
        </div>
    );
};

export default MultiImageUploader;
