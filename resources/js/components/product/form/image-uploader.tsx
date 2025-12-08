import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Plus, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
    FieldValues,
    Path,
    UseFormSetValue,
    UseFormWatch,
} from 'react-hook-form';

interface ImageUploaderProps<T extends FieldValues> {
    name: Path<T>;
    setValue: UseFormSetValue<T>;
    watch: UseFormWatch<T>;
}

export const ImageUploader = <T extends FieldValues>({
    name,
    setValue,
    watch,
}: ImageUploaderProps<T>) => {
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

            // Set value ke react hook form
            setValue(name, [file] as any);
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
