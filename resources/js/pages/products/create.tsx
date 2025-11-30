import { ColorPickerDialog } from '@/components/color-picker';
import { InputDescription } from '@/components/input-description';
import InputError from '@/components/input-error';
import { MultiplePricesDialog } from '@/components/product/form/multiple-prices';
import { NewCategoryDialog } from '@/components/product/form/new-category';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { SelectValue } from '@radix-ui/react-select';
import { GripVertical, Plus, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';

interface Color {
    hex: string;
    label: string;
}
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: '/products',
    },
    {
        title: 'Create',
        href: '/products/create',
    },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const COLORS = [
    { label: 'Black', hex: '#4B4B4B' },
    { label: 'White', hex: '#F5F5F5' },
    { label: 'Red', hex: '#FF7F7F' },
    { label: 'Green', hex: '#77DD77' },
    { label: 'Blue', hex: '#AEC6CF' },
    { label: 'Yellow', hex: '#FFFACD' },
    { label: 'Orange', hex: '#FFB347' },
    { label: 'Purple', hex: '#CBAACB' },
];

export const DISCOUNT_EVENT_TYPES = [
    { value: 'NEW_YEAR', label: 'New Year' },
    { value: 'CHRISTMAS', label: 'Christmas' },
    { value: 'BLACK_FRIDAY', label: 'Black Friday' },
    { value: 'CYBER_MONDAY', label: 'Cyber Monday' },
    { value: 'RAMADAN', label: 'Ramadan' },
    { value: 'EID', label: 'Eid al-Fitr' },
    { value: 'INDEPENDENCE_DAY', label: 'Independence Day' },
    { value: 'HALLOWEEN', label: 'Halloween' },
    { value: 'BACK_TO_SCHOOL', label: 'Back to School' },
    { value: 'FLASH_SALE', label: 'Flash Sale' },
    { value: 'CLEARANCE', label: 'Clearance Sale' },
    { value: 'BIRTHDAY', label: 'Birthday Sale' },
];

export const PRODUCT_OUTFIT_CATEGORIES = [
    { value: 'TOPS', label: 'Tops' },
    { value: 'BOTTOMS', label: 'Bottoms' },
    { value: 'DRESSES', label: 'Dresses' },
    { value: 'OUTERWEAR', label: 'Outerwear' },
    { value: 'ACTIVEWEAR', label: 'Activewear' },
    { value: 'SWIMWEAR', label: 'Swimwear' },
    { value: 'FOOTWEAR', label: 'Footwear' },
    { value: 'ACCESSORIES', label: 'Accessories' },
];

const Create = () => {
    const [sizes, setSizes] = useState<string[]>([]);
    const handleToggleSize = (size: string) => {
        setSizes((prev) =>
            prev.includes(size)
                ? prev.filter((p) => p != size)
                : [...prev, size],
        );
    };

    const [colors, setColors] = useState<Color[]>([]);
    const handleToggleColor = (color: Color) => {
        setColors((prev) =>
            prev.includes(color)
                ? prev.filter((p) => p.hex != color.hex)
                : [...prev, color],
        );
    };

    const [showColorPicker, setShowColorPicker] = useState(false);
    const [customColors, setCustomColors] = useState<Color[]>([]);
    const handleAddColor = (color: Color) => {
        setCustomColors((prev) => [...prev, color]);
    };

    const [showPricesDialog, setShowPricesDialog] = useState(false);
    const [showNewCategoryDialog, setShowNewCategoryDialog] = useState(false);

    //Form handler

    const handleSubmit = () => {};

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Product" />
            <div className="space-y-6 p-4">
                <section className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h3 className="text-xl font-medium">Add New Product</h3>
                    </div>
                    <div>
                        <Button size="lg" className="rounded-full">
                            <Plus />
                            Add Product
                        </Button>
                    </div>
                </section>

                <section className="flex gap-6">
                    {/* Left Section */}
                    <section className="w-full space-y-6">
                        <div className="space-y-4 rounded-lg border p-4">
                            <h4 className="font-semibold">
                                General Information
                            </h4>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name Product</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        autoComplete="off"
                                        name="name"
                                        placeholder="Name"
                                    />
                                    <InputError message="" className="mt-2" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="description">
                                        Description Product
                                    </Label>
                                    <Textarea
                                        id="description"
                                        autoComplete="off"
                                        name="description"
                                        placeholder="Description"
                                        className="min-h-32"
                                    />
                                    <InputError message="" className="mt-2" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="grid h-fit gap-2">
                                    <Label htmlFor="size">Size</Label>
                                    <InputDescription>
                                        Pick Available Size
                                    </InputDescription>

                                    <div className="flex gap-2">
                                        {SIZES.map((size, i) => (
                                            <Button
                                                key={i}
                                                variant="outline"
                                                size="icon"
                                                className={cn(
                                                    sizes.includes(size) &&
                                                        'bg-primary text-secondary hover:bg-primary/90 hover:text-secondary',
                                                )}
                                                onClick={() =>
                                                    handleToggleSize(size)
                                                }
                                            >
                                                <span>{size}</span>
                                            </Button>
                                        ))}
                                    </div>
                                    <InputError message="" className="mt-2" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="color">Color</Label>
                                    <InputDescription>
                                        Pick Color Variant
                                    </InputDescription>
                                    <div className="flex flex-wrap gap-2">
                                        {[...COLORS, ...customColors].map(
                                            (color, i) => (
                                                <Button
                                                    key={i}
                                                    variant="ghost"
                                                    size="icon"
                                                    className={cn(
                                                        'group relative inset-0 overflow-hidden rounded-full hover:border-2 hover:border-neutral-300',
                                                        colors.some(
                                                            (c) =>
                                                                c.hex ===
                                                                color.hex,
                                                        ) &&
                                                            'border-2 border-primary hover:border-primary',
                                                    )}
                                                    onClick={() =>
                                                        handleToggleColor(color)
                                                    }
                                                >
                                                    <div
                                                        className={cn(
                                                            'h-full w-full rounded-full transition-transform duration-200 group-hover:scale-[85%]',
                                                            colors.some(
                                                                (c) =>
                                                                    c.hex ===
                                                                    color.hex,
                                                            ) && 'scale-[85%]',
                                                        )}
                                                        style={{
                                                            backgroundColor:
                                                                color.hex,
                                                        }}
                                                    ></div>
                                                </Button>
                                            ),
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="rounded-full border-2"
                                            onClick={() =>
                                                setShowColorPicker(true)
                                            }
                                        >
                                            <Plus />
                                        </Button>
                                    </div>
                                    <InputError message="" className="mt-2" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 rounded-lg border p-4">
                            <h4 className="font-semibold">Pricing and Stock</h4>

                            <div className="grid gap-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="pricing">
                                            Base Pricing
                                        </Label>
                                        <Input
                                            id="pricing"
                                            type="text"
                                            autoComplete="off"
                                            name="pricing"
                                            placeholder="50000"
                                        />
                                        <InputError
                                            message=""
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="stock">Stock</Label>
                                        <Input
                                            id="stock"
                                            type="text"
                                            autoComplete="off"
                                            name="stock"
                                            placeholder="0"
                                        />
                                        <InputError
                                            message=""
                                            className="mt-2"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="pricing">
                                            Discount
                                        </Label>
                                        <Input
                                            id="pricing"
                                            type="text"
                                            autoComplete="off"
                                            name="pricing"
                                            placeholder="50000"
                                        />
                                        <InputError
                                            message=""
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="stock">
                                            Discount Type
                                        </Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select discount type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {DISCOUNT_EVENT_TYPES.map(
                                                    (discount, i) => (
                                                        <SelectItem
                                                            key={i}
                                                            value={
                                                                discount.value
                                                            }
                                                        >
                                                            {discount.label}
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <InputError
                                            message=""
                                            className="mt-2"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <Button
                                        onClick={() =>
                                            setShowPricesDialog(true)
                                        }
                                        size="lg"
                                        className="w-fit rounded-full"
                                    >
                                        Add more prices
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Right Section */}
                    <section className="w-full max-w-sm space-y-6">
                        <div className="space-y-4 rounded-lg border p-4">
                            <h4 className="font-semibold">Product Images</h4>
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-center bg-gray-100">
                                    <ImageUploader />
                                </div>
                                <MultiImageUploader />
                            </div>
                        </div>

                        <div className="space-y-4 rounded-lg border p-4">
                            <h4 className="font-semibold">Category</h4>
                            <div className="grid gap-2">
                                <Label htmlFor="stock">Product category</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select product category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PRODUCT_OUTFIT_CATEGORIES.map(
                                            (category, i) => (
                                                <SelectItem
                                                    key={i}
                                                    value={category.value}
                                                >
                                                    {category.label}
                                                </SelectItem>
                                            ),
                                        )}
                                    </SelectContent>
                                </Select>
                                <InputError message="" className="mt-2" />
                            </div>

                            <div className="flex justify-end">
                                <Button
                                    onClick={() =>
                                        setShowNewCategoryDialog(true)
                                    }
                                    size="lg"
                                    className="rounded-full"
                                >
                                    Add category
                                </Button>
                            </div>
                        </div>
                    </section>
                </section>
                {/* Dialog Components */}
                <ColorPickerDialog
                    open={showColorPicker}
                    onOpenChange={setShowColorPicker}
                    onColorSelect={handleAddColor}
                />

                <MultiplePricesDialog
                    open={showPricesDialog}
                    onOpenChange={setShowPricesDialog}
                    onSubmit={() => console.log('submited')}
                    colors={colors}
                    sizes={sizes}
                />

                <NewCategoryDialog
                    open={showNewCategoryDialog}
                    onOpenChange={setShowNewCategoryDialog}
                />
            </div>
        </AppLayout>
    );
};
export default Create;

const ImageUploader = () => {
    // State untuk menyimpan URL preview (string atau null)
    const [preview, setPreview] = useState<string | null>(null);

    // Ref untuk elemen input file HTML
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fungsi untuk memicu klik pada input file yang tersembunyi
    const handleTriggerUpload = () => {
        fileInputRef.current?.click();
    };

    // Fungsi saat user memilih file
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validasi sederhana (opsional: cek tipe file)
            if (!file.type.startsWith('image/')) {
                alert('Please upload image only.');
                return;
            }

            // Buat URL sementara untuk preview
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
        }
    };

    // Fungsi untuk menghapus gambar
    const handleRemoveImage = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation(); // Mencegah trigger upload saat klik tombol hapus
        setPreview(null);
        // Reset value input agar user bisa memilih file yang sama jika diinginkan
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Cleanup object URL untuk mencegah memory leak saat komponen unmount
    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    return (
        <div
            className={cn(
                'group relative flex aspect-square w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-gray-300 bg-gray-50 transition-all hover:border-gray-400 hover:bg-gray-100',
                !preview && 'border-dashed',
            )}
            onClick={handleTriggerUpload}
        >
            {/* Input File Tersembunyi */}
            <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
            />

            {preview ? (
                // --- TAMPILAN JIKA GAMBAR SUDAH DIPILIH ---
                <>
                    <img
                        src={preview}
                        alt="Preview"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Overlay Hitam Transparan saat Hover */}
                    <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />

                    {/* Tombol Hapus (Muncul saat hover atau selalu muncul di mobile) */}
                    <div className="absolute top-2 right-2">
                        <Button
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8 rounded-full opacity-100 shadow-md transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
                            onClick={handleRemoveImage}
                            type="button"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Label Ganti Gambar (Opsional) */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                        Click to change
                    </div>
                </>
            ) : (
                // --- TAMPILAN INPUT (DASHED BOX) ---
                <div className="flex flex-col items-center justify-center gap-2 text-center text-gray-500">
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                    >
                        <Plus />
                    </Button>
                    <div className="space-y-1">
                        <p className="text-sm font-semibold text-gray-700">
                            Click to upload
                        </p>
                        <p className="text-xs text-gray-500">
                            JPEG, PNG, JPG or WEBP
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

interface ImageFile {
    id: string;
    url: string;
    file: File;
}

const MultiImageUploader = () => {
    const [images, setImages] = useState<ImageFile[]>([]);
    const [isDraggingOver, setIsDraggingOver] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const dragItem = useRef<number | null>(null); // Menyimpan index item yang sedang di-drag (sorting)
    const dragOverItem = useRef<number | null>(null); // Menyimpan index target (sorting)

    // --- File Handling Logic ---

    const processFiles = (fileList: File[]) => {
        const validFiles = fileList.filter((file) =>
            file.type.startsWith('image/'),
        );

        if (validFiles.length > 0) {
            const newImages: ImageFile[] = validFiles.map((file) => ({
                id: uuid(),
                url: URL.createObjectURL(file),
                file: file,
            }));
            setImages((prev) => [...prev, ...newImages]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            processFiles(Array.from(e.target.files));
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // --- Drag & Drop Upload Logic (Dropzone) ---

    const handleContainerDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        // Hanya aktifkan visual dropzone jika user drag file eksternal, bukan item internal
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

        // Cek apakah ini drop file dari OS (bukan sorting internal)
        if (
            dragItem.current === null &&
            e.dataTransfer.files &&
            e.dataTransfer.files.length > 0
        ) {
            processFiles(Array.from(e.dataTransfer.files));
            e.dataTransfer.clearData();
        }
    };

    // --- Drag & Drop Sorting Logic ---

    const handleSortStart = (e: React.DragEvent, position: number) => {
        dragItem.current = position;
        // Set opacity item yang di-drag sedikit transparan (opsional visual effect)
        // e.dataTransfer.effectAllowed = "move";
    };

    const handleSortEnter = (e: React.DragEvent, position: number) => {
        // Logic: Saat item yang didrag melewati item lain, tukar posisi array
        if (dragItem.current !== null && dragItem.current !== position) {
            const copyListItems = [...images];
            const dragItemContent = copyListItems[dragItem.current];

            // Hapus item dari posisi lama
            copyListItems.splice(dragItem.current, 1);
            // Masukkan ke posisi baru
            copyListItems.splice(position, 0, dragItemContent);

            // Update ref dan state
            dragItem.current = position;
            setImages(copyListItems);
        }
    };

    const handleSortEnd = () => {
        dragItem.current = null;
        dragOverItem.current = null;
    };

    // --- Utils ---

    const removeImage = (idToRemove: string) => {
        setImages((prev) => {
            const filtered = prev.filter((img) => img.id !== idToRemove);
            const removedItem = prev.find((img) => img.id === idToRemove);
            if (removedItem) URL.revokeObjectURL(removedItem.url);
            return filtered;
        });
    };

    useEffect(() => {
        return () => {
            images.forEach((img) => URL.revokeObjectURL(img.url));
        };
    }, []);

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
                {/* Scrollable Container */}
                <div className="custom-scrollbar flex gap-4 overflow-x-auto pb-2">
                    {/* Draggable Image Items */}
                    {images.map((image, index) => (
                        <div
                            key={image.id}
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
                                    src={image.url}
                                    alt={`Preview ${index}`}
                                    className="pointer-events-none h-full w-full object-cover" // pointer-events-none agar gambar tidak di-drag sebagai file terpisah
                                />

                                {/* Overlay saat Hover */}
                                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />

                                {/* Indikator Grip (Opsional, untuk visual cue draggable) */}
                                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 opacity-0 transition-opacity group-hover:opacity-70">
                                    <GripVertical className="h-4 w-4 rotate-90 text-white drop-shadow-md" />
                                </div>

                                {/* Tombol Hapus */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeImage(image.id);
                                    }}
                                    className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100 hover:bg-red-600"
                                    type="button"
                                >
                                    <X className="h-3 w-3" />
                                </button>

                                {/* Badge Urutan */}
                                <div className="absolute top-1 left-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-[10px] text-white backdrop-blur-sm">
                                    {index + 1}
                                </div>
                            </div>
                        </div>
                    ))}

                    {images.length <= 3 && (
                        <>
                            {Array.from({ length: 3 - images.length }).map(
                                (_, i) => (
                                    <div
                                        key={i}
                                        className="aspect-square h-18 rounded-md bg-gray-100"
                                    />
                                ),
                            )}
                        </>
                    )}
                </div>
                {/* Add Button (Selalu di akhir list) */}
                <div className="flex-shrink-0">
                    <div
                        className="flex aspect-square h-18 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-gray-400 hover:bg-gray-100"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full"
                        >
                            <Plus />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
