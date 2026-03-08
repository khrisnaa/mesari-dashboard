'useclient';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { GripVertical, Plus, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';

export enum ImageType {
    THUMBNAIL = 'thumbnail',
    GALLERY = 'gallery',
    FRONT = 'front',
    BACK = 'back',
    LEFT = 'left',
    RIGHT = 'right',
}

export interface ImageState {
    id?: string;
    tempId: string;
    file?: File;
    type: ImageType;
    preview: string;
    sort_order?: number;
}

interface GalleryUploaderProps {
    isCustomizable: boolean;
    existingImages?: ImageState[] | [];
    onChange: (files: ImageState[]) => void;
    onRemove: (tempId: string) => void;
    onSortOrder: (images: ImageState[]) => void;
}

export const GalleryUploader = ({
    isCustomizable,
    existingImages,
    onChange,
    onRemove,
    onSortOrder,
}: GalleryUploaderProps) => {
    const [images, setImages] = useState<ImageState[]>(existingImages || []);
    const [isDraggingOver, setIsDraggingOver] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

    const assignTypes = (imgList: ImageState[], custom: boolean): ImageState[] => {
        return imgList.map((img, index) => {
            if (!custom) return { ...img, type: ImageType.GALLERY };
            if (index === 0) return { ...img, type: ImageType.FRONT };
            if (index === 1) return { ...img, type: ImageType.BACK };
            if (index === 2) return { ...img, type: ImageType.LEFT };
            if (index === 3) return { ...img, type: ImageType.RIGHT };
            return { ...img, type: ImageType.GALLERY };
        });
    };

    useEffect(() => {
        setImages((prev) => {
            const updated = assignTypes(prev, isCustomizable);
            const hasChanged = updated.some((img, i) => img.type !== prev[i].type);

            if (hasChanged) {
                setTimeout(() => onSortOrder(updated), 0);
                return updated;
            }
            return prev;
        });
    }, [isCustomizable]); // eslint-disable-line react-hooks/exhaustive-deps

    // processing new images
    const processFiles = (fileList: File[]) => {
        const validFiles = fileList.filter((file) => file.type.startsWith('image/'));

        if (!validFiles.length) return;

        const formattedFiles: ImageState[] = validFiles.map((file) => ({
            tempId: uuid(),
            type: ImageType.GALLERY,
            file: file,
            preview: URL.createObjectURL(file),
        }));

        setImages((prev) => {
            const newImages = [...prev, ...formattedFiles];
            const typedImages = assignTypes(newImages, isCustomizable);

            const newlyTyped = typedImages.slice(prev.length);

            setTimeout(() => {
                onChange(newlyTyped);
                onSortOrder(typedImages);
            }, 0);

            return typedImages;
        });
    };

    // handle upload new image
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            processFiles(Array.from(e.target.files));
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleContainerDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        if (dragItem.current === null) setIsDraggingOver(true);
    };

    const handleContainerDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDraggingOver(false);
    };

    const handleContainerDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDraggingOver(false);
        if (dragItem.current === null && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFiles(Array.from(e.dataTransfer.files));
            e.dataTransfer.clearData();
        }
    };

    const handleSortStart = (e: React.DragEvent, position: number) => {
        dragItem.current = position;
    };

    const handleSortEnter = (e: React.DragEvent, position: number) => {
        if (dragItem.current !== null && dragItem.current !== position) {
            const copyListItems = [...images];
            const dragItemContent = copyListItems[dragItem.current];

            copyListItems.splice(dragItem.current, 1);
            copyListItems.splice(position, 0, dragItemContent);

            dragItem.current = position;

            // Re-assign type setiap kali posisinya bertukar
            const typedImages = assignTypes(copyListItems, isCustomizable);
            setImages(typedImages);
        }
    };

    const handleSortEnd = () => {
        onSortOrder(images);
        dragItem.current = null;
        dragOverItem.current = null;
    };

    const handleRemoveImage = (tempId: string) => {
        setImages((prev) => {
            const removed = prev.find((img) => img.tempId === tempId);
            if (removed) URL.revokeObjectURL(removed.preview);

            const filtered = prev.filter((img) => img.tempId !== tempId);
            const typedImages = assignTypes(filtered, isCustomizable);

            setTimeout(() => {
                onRemove(tempId);
                onSortOrder(typedImages);
            }, 0);

            return typedImages;
        });
    };

    const minSlots = isCustomizable ? 4 : 3;
    const placeholderLabels = ['Front', 'Back', 'Left', 'Right'];

    return (
        <div
            className={`w-full transition-all duration-200 ease-in-out ${
                isDraggingOver
                    ? 'scale-[1.01] border-blue-500 bg-blue-50/50'
                    : 'border-gray-200 bg-transparent'
            }`}
            onDragOver={handleContainerDragOver}
            onDragLeave={handleContainerDragLeave}
            onDrop={handleContainerDrop}
        >
            <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
            />

            <div className="flex justify-between gap-4">
                <div className="custom-scrollbar flex gap-4 overflow-x-auto pb-2">
                    {images.map((image, index) => (
                        <div
                            key={image.id ? image.id : image.tempId}
                            draggable
                            onDragStart={(e) => handleSortStart(e, index)}
                            onDragEnter={(e) => handleSortEnter(e, index)}
                            onDragEnd={handleSortEnd}
                            onDragOver={(e) => e.preventDefault()}
                            className={cn(
                                'group relative flex-shrink-0 cursor-move transition-all active:scale-95',
                            )}
                        >
                            <div className="relative aspect-square h-18 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md">
                                <img
                                    src={image.preview}
                                    alt={`Preview ${index}`}
                                    className="pointer-events-none h-full w-full object-cover"
                                />

                                {image.type !== 'gallery' && (
                                    <div className="absolute top-1 left-1/2 -translate-x-1/2 rounded-full bg-slate-900/80 px-2 py-0.5 text-[9px] font-bold tracking-wider text-white uppercase backdrop-blur-sm">
                                        {image.type}
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />

                                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 opacity-0 transition-opacity group-hover:opacity-70">
                                    <GripVertical className="h-4 w-4 rotate-90 text-white drop-shadow-md" />
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveImage(image.tempId);
                                    }}
                                    className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100 hover:bg-red-600"
                                    type="button"
                                >
                                    <X className="h-3 w-3" />
                                </button>

                                <div className="absolute right-1 bottom-1 flex h-4 w-4 items-center justify-center rounded-full bg-black/50 text-[9px] text-white backdrop-blur-sm">
                                    {index + 1}
                                </div>
                            </div>
                        </div>
                    ))}

                    {images.length < minSlots && (
                        <>
                            {Array.from({ length: minSlots - images.length }).map((_, i) => {
                                const slotIndex = images.length + i;
                                return (
                                    <div
                                        key={i}
                                        className="relative flex aspect-square h-18 flex-shrink-0 items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50"
                                    >
                                        {isCustomizable && slotIndex < 4 && (
                                            <span className="text-[10px] font-semibold text-gray-400 uppercase">
                                                {placeholderLabels[slotIndex]}
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </>
                    )}
                </div>

                <div className="flex-shrink-0">
                    <div
                        className="flex aspect-square h-18 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-gray-400 hover:bg-gray-100"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Button
                            variant="outline"
                            size="icon"
                            className="pointer-events-none rounded-full"
                        >
                            <Plus />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
