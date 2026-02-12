import smartcrop from 'smartcrop';

export interface PixelCrop {
    x: number;
    y: number;
    width: number;
    height: number;
}

/**
 * 创建一个图片对象
 */
export const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.setAttribute('crossOrigin', 'anonymous'); // 避免 CORS 问题
        image.src = url;
    });

/**
 * 获取图片旋转后的预览或最终结果
 * 优化：增加尺寸压缩和质量控制，使用 webp 格式
 */
export async function getCroppedImg(
    imageSrc: string,
    pixelCrop: PixelCrop,
    rotation = 0,
    flip = { horizontal: false, vertical: false },
    options = { maxWidth: 1200, quality: 0.8 }
): Promise<Blob | null> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        return null;
    }

    const rotRad = (rotation * Math.PI) / 180;

    // 计算旋转后的画布大小
    const { width: bWidth, height: bHeight } = rotateSize(
        image.width,
        image.height,
        rotation
    );

    canvas.width = bWidth;
    canvas.height = bHeight;

    // 变换原点到画布中心并旋转
    ctx.translate(bWidth / 2, bHeight / 2);
    ctx.rotate(rotRad);
    ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
    ctx.translate(-image.width / 2, -image.height / 2);

    // 绘制整张图
    ctx.drawImage(image, 0, 0);

    // 从旋转后的画布中提取裁切区域
    const data = ctx.getImageData(
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height
    );

    // 计算缩放比例
    let targetWidth = pixelCrop.width;
    let targetHeight = pixelCrop.height;

    if (targetWidth > options.maxWidth) {
        const scale = options.maxWidth / targetWidth;
        targetWidth = options.maxWidth;
        targetHeight = Math.round(targetHeight * scale);
    }

    // 设置最终画布大小为裁切大小（可能经过缩放）
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // 重新绘制裁切后的内容（支持缩放）
    // 先清理原有的 translate 和 rotate 状态
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    // 使用临时 canvas 来处理缩放，或者使用 ctx.drawImage 处理原始 ImageData
    // 更简单的方法是直接再创建一个离屏 canvas
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = pixelCrop.width;
    tempCanvas.height = pixelCrop.height;
    tempCanvas.getContext('2d')?.putImageData(data, 0, 0);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 渲染时自动执行缩放
    ctx.drawImage(tempCanvas, 0, 0, pixelCrop.width, pixelCrop.height, 0, 0, targetWidth, targetHeight);

    // 返回 Blob，优先使用 webp 格式进行压缩
    return new Promise((resolve) => {
        canvas.toBlob((file) => {
            resolve(file);
        }, 'image/webp', options.quality);
    });
}

/**
 * 计算旋转后的容器大小
 */
function rotateSize(width: number, height: number, rotation: number) {
    const rotRad = (rotation * Math.PI) / 180;

    return {
        width:
            Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
        height:
            Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
    };
}

/**
 * 使用 smartcrop-js 自动检测最佳裁剪区域
 */
export async function autoDetectCrop(imageSrc: string): Promise<PixelCrop> {
    const image = await createImage(imageSrc);
    // @ts-ignore - smartcrop types might be missing
    const result = await smartcrop.crop(image, { width: 400, height: 400 });
    return result.topCrop;
}
