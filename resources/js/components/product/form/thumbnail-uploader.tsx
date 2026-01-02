import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ImageFile } from '@/pages/products/create';
import { Plus, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';

interface ThumbnailUploaderProps {
    existingImage?: ImageFile | null;
    onChange: (file: ImageFile) => void;
    onRemove: (tempId: string) => void;
}

export const ThumbnailUploader = ({
    onChange,
    onRemove,
    existingImage,
}: ThumbnailUploaderProps) => {
    const [image, setImage] = useState<ImageFile | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleTriggerUpload = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please upload image only.');
            return;
        }

        const objectUrl = URL.createObjectURL(file);

        const formattedFile: ImageFile = {
            tempId: uuid(),
            type: 'thumbnail',
            file: file,
            preview: objectUrl,
        };

        onChange(formattedFile);
        setImage(formattedFile);
    };

    const handleRemoveImage = (tempId: string) => {
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        setImage(null);
        onRemove(tempId);
    };

    useEffect(() => {
        return () => {
            if (image) URL.revokeObjectURL(image.preview);
        };
    }, [image]);

    const hasExistingImage = !!existingImage && !image;
    const hasNewImage = !!image;

    console.log(existingImage);
    return (
        <div
            className={cn(
                'group relative flex aspect-square w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-gray-300 bg-gray-50 transition-all hover:border-gray-400 hover:bg-gray-100',
                !image && 'border-dashed',
            )}
            onClick={handleTriggerUpload}
        >
            <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
            />

            {hasExistingImage && (
                <>
                    <img
                        src={`${existingImage.preview}`}
                        alt="Thumbnail"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />

                    <div className="absolute top-2 right-2">
                        <Button
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8 rounded-full opacity-100 shadow-md transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveImage(existingImage.tempId);
                            }}
                            type="button"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                        Click to change
                    </div>
                </>
            )}

            {hasNewImage && (
                <>
                    <img
                        src={image.preview}
                        alt="Thumbnail"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />

                    <div className="absolute top-2 right-2">
                        <Button
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8 rounded-full opacity-100 shadow-md transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveImage(image.tempId);
                            }}
                            type="button"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                        Click to change
                    </div>
                </>
            )}

            {!hasExistingImage && !hasNewImage && (
                <div className="flex flex-col items-center justify-center gap-2 text-center text-gray-500">
                    <Button variant="outline" size="icon" className="rounded-full">
                        <Plus />
                    </Button>
                    <div className="space-y-1">
                        <p className="text-sm font-semibold text-gray-700">Click to upload</p>
                        <p className="text-xs text-gray-500">JPEG, PNG, JPG or WEBP</p>
                    </div>
                </div>
            )}
        </div>
    );
};
