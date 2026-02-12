import { RotateCw, Maximize, Check, X, Wand2 } from 'lucide-react';
import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';

import { autoDetectCrop, type PixelCrop } from '@/utils/imageUtils';

import type React from 'react';

interface ImageEditorProps {
    image: string;
    onSave: (croppedImage: Blob, previewUrl: string) => void;
    onCancel: () => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ image, onSave, onCancel }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [rotation, setRotation] = useState(0);
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<PixelCrop | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const onCropComplete = useCallback((_showedArea: any, b: PixelCrop) => {
        setCroppedAreaPixels(b);
    }, []);

    const handleRotate = () => {
        setRotation((prev) => (prev + 90) % 360);
    };

    const handleSmartCrop = async () => {
        setIsProcessing(true);
        try {
            const bestCrop = await autoDetectCrop(image);
            console.log('Best crop suggestion:', bestCrop);
            alert('已为您自动识别最佳区域');
        } catch (error) {
            console.error('Smart crop failed', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSave = async () => {
        if (!croppedAreaPixels) {return;}

        setIsProcessing(true);
        try {
            const { getCroppedImg } = await import('@/utils/imageUtils');
            const croppedBlob = await getCroppedImg(image, croppedAreaPixels, rotation);

            if (croppedBlob) {
                const previewUrl = URL.createObjectURL(croppedBlob);
                onSave(croppedBlob, previewUrl);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col">
            <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-md z-10">
                <button onClick={onCancel} className="p-2 text-white/70 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                </button>
                <h3 className="text-white font-bold">编辑图片</h3>
                <button
                    onClick={handleSave}
                    disabled={isProcessing}
                    className="bg-primary text-slate-900 px-4 py-2 rounded-full font-bold flex items-center gap-2 active:scale-95 transition-all disabled:opacity-50"
                >
                    {isProcessing ? '处理中...' : (
                        <>
                            <Check className="w-4 h-4" />
                            <span>保存</span>
                        </>
                    )}
                </button>
            </div>

            <div className="relative flex-1 bg-neutral-900">
                <Cropper
                    image={image}
                    crop={crop}
                    rotation={rotation}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onRotationChange={setRotation}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                />
            </div>

            <div className="p-6 bg-black/50 backdrop-blur-md space-y-6">
                <div className="flex items-center gap-4">
                    <span className="text-white/50 text-xs font-bold uppercase tracking-widest w-12 text-center">缩放</span>
                    <input
                        type="range"
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        aria-labelledby="Zoom"
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="flex-1 accent-primary h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                    />
                </div>

                <div className="flex justify-around items-center">
                    <button
                        onClick={handleRotate}
                        className="flex flex-col items-center gap-1.5 text-white/70 hover:text-primary transition-colors group"
                    >
                        <div className="size-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <RotateCw className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider">旋转</span>
                    </button>

                    <button
                        onClick={handleSmartCrop}
                        disabled={isProcessing}
                        className="flex flex-col items-center gap-1.5 text-white/70 hover:text-primary transition-colors group"
                    >
                        <div className="size-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <Wand2 className="w-5 h-5 font-bold" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider">自动识别</span>
                    </button>

                    <button
                        onClick={() => { setZoom(1); setCrop({ x: 0, y: 0 }); setRotation(0); }}
                        className="flex flex-col items-center gap-1.5 text-white/70 hover:text-primary transition-colors group"
                    >
                        <div className="size-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <Maximize className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider">重置</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageEditor;
