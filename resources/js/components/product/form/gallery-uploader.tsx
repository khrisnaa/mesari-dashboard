import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ImageFile } from '@/pages/products/create';
import { GripVertical, Plus, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';

interface GalleryUploaderProps {
    onChange: (files: ImageFile[]) => void;
    onRemove: (tempId: string) => void;
}

export const GalleryUploader = ({ onChange, onRemove }: GalleryUploaderProps) => {
    const [images, setImages] = useState<ImageFile[]>([]);
    const [isDraggingOver, setIsDraggingOver] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

    const processFiles = (fileList: File[]) => {
        const validFiles = fileList.filter((file) => file.type.startsWith('image/'));

        if (!validFiles.length) return;

        const formattedFiles: ImageFile[] = validFiles.map((file) => ({
            tempId: uuid(),
            type: 'gallery',
            file: file,
            preview: URL.createObjectURL(file),
        }));

        setImages((prev) => [...prev, ...formattedFiles]);
        onChange(formattedFiles);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            processFiles(Array.from(e.target.files));
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleContainerDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        if (dragItem.current === null) {
            setIsDraggingOver(true);
        }
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
            setImages(copyListItems);
        }
    };

    const handleSortEnd = () => {
        dragItem.current = null;
        dragOverItem.current = null;
    };

    const handleRemoveImage = (tempId: string) => {
        setImages((prev) => {
            const removed = prev.find((img) => img.tempId === tempId);
            if (removed) URL.revokeObjectURL(removed.preview);
            return prev.filter((img) => img.tempId !== tempId);
        });

        onRemove(tempId);
    };

    useEffect(() => {
        return () => {
            images.forEach((img) => URL.revokeObjectURL(img.preview));
        };
    }, [images]);

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
                            key={image.preview}
                            draggable
                            onDragStart={(e) => handleSortStart(e, index)}
                            onDragEnter={(e) => handleSortEnter(e, index)}
                            onDragEnd={handleSortEnd}
                            onDragOver={(e) => e.preventDefault()} // Penting untuk memperbolehkan drop
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

                                <div className="absolute top-1 left-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-[10px] text-white backdrop-blur-sm">
                                    {index + 1}
                                </div>
                            </div>
                        </div>
                    ))}

                    {images.length <= 3 && (
                        <>
                            {Array.from({ length: 3 - images.length }).map((_, i) => (
                                <div
                                    key={i}
                                    className="aspect-square h-18 rounded-md bg-gray-100"
                                />
                            ))}
                        </>
                    )}
                </div>

                <div className="flex-shrink-0">
                    <div
                        className="flex aspect-square h-18 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-gray-400 hover:bg-gray-100"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Button variant="outline" size="icon" className="rounded-full">
                            <Plus />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
