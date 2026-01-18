import { cn } from '@/lib/utils';
import { Plus, X } from 'lucide-react';
import { useRef } from 'react';
import { v4 as uuid } from 'uuid';
import { Button } from './ui/button';

export interface ImageValue {
    file?: File;
    preview: string;
    tempId: string;
}

interface SingleImageUploadProps {
    value?: ImageValue | null;
    existingImage?: ImageValue | null;
    onChange: (image: ImageValue | null) => void;
    onRemoveExisting?: () => void;
    accept?: string;
    aspect?: 'square' | 'video' | 'banner';
    disabled?: boolean;
}

export function SingleImageUpload({
    value,
    existingImage,
    onChange,
    onRemoveExisting,
    accept = 'image/*',
    aspect = 'square',
    disabled = false,
}: SingleImageUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleTrigger = () => {
        if (!disabled) inputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        onChange({
            file,
            preview: URL.createObjectURL(file),
            tempId: uuid(),
        });
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(null);
        onRemoveExisting?.();
    };

    const hasImage = Boolean(value || existingImage);
    const image = value ?? existingImage;

    const aspectClass = {
        square: 'aspect-square',
        video: 'aspect-video',
        banner: 'aspect-[3/1]',
    }[aspect];

    return (
        <div
            className={cn(
                'group relative flex w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 bg-gray-50 transition-all',
                aspectClass,
                hasImage ? 'border-gray-300' : 'border-dashed border-gray-300',
                !disabled && 'hover:border-gray-400 hover:bg-gray-100',
            )}
            onClick={handleTrigger}
        >
            <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept={accept}
                onChange={handleFileChange}
                disabled={disabled}
            />

            {image && (
                <>
                    <img
                        src={image.preview}
                        alt="Preview"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {!disabled && (
                        <>
                            <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />

                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-100 shadow-md sm:opacity-0 sm:group-hover:opacity-100"
                                onClick={handleRemove}
                            >
                                <X className="h-4 w-4" />
                            </Button>

                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                                Click to change
                            </div>
                        </>
                    )}
                </>
            )}

            {!image && (
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
}
