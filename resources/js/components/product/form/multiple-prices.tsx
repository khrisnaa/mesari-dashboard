import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useMemo } from 'react';

interface Color {
    hex: string;
    label: string;
}

interface PricesDialogProps {
    open: boolean;
    onOpenChange: (value: boolean) => void;
    onSubmit: () => void;
    colors: Color[];
    sizes: string[];
}
export const MultiplePricesDialog = ({
    open,
    onOpenChange,
    onSubmit,
    colors,
    sizes,
}: PricesDialogProps) => {
    const handleSubmit = () => {};

    const variants = useMemo(() => {
        return sizes.flatMap((size) =>
            colors.map((color) => ({
                size,
                color,
            })),
        );
    }, [colors, sizes]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Pricing and Stock</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-6">
                    <div className="grid h-fit grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="pricing">Base Pricing</Label>
                            <Input
                                id="pricing"
                                type="text"
                                autoComplete="off"
                                name="pricing"
                                placeholder="50000"
                            />
                            <InputError message="" className="mt-2" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="stock">Base Stock</Label>
                            <Input
                                id="stock"
                                type="text"
                                autoComplete="off"
                                name="stock"
                                placeholder="0"
                            />
                            <InputError message="" className="mt-2" />
                        </div>
                    </div>
                    <Separator />
                    <div className="custom-scrollbar flex h-[50dvh] flex-col justify-between gap-4 overflow-y-auto pr-4">
                        <div className="grid gap-4">
                            <div className="grid h-fit grid-cols-5 gap-4">
                                <Label>Variant</Label>
                                <Label className="col-span-2">Pricing</Label>
                                <Label className="col-span-2">Stock</Label>
                            </div>
                            {variants.map((variant, i) => (
                                <div
                                    key={i}
                                    className="grid h-fit grid-cols-5 gap-4"
                                >
                                    <div className="col-span-1 flex items-center gap-2">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div
                                                    style={{
                                                        backgroundColor:
                                                            variant.color.hex,
                                                    }}
                                                    className="aspect-square h-5 rounded-full"
                                                />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{variant.color.label}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                        <h4>{variant.size}</h4>
                                    </div>
                                    <div className="col-span-2">
                                        <Input
                                            id="pricing"
                                            type="text"
                                            autoComplete="off"
                                            name="pricing"
                                            placeholder="50000"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <Input
                                            id="stock"
                                            type="text"
                                            autoComplete="off"
                                            name="stock"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button
                                size="lg"
                                onClick={() => onOpenChange(false)}
                                variant="outline"
                                className="rounded-full"
                            >
                                Cancel
                            </Button>
                            <Button size="lg" className="rounded-full">
                                Save Prices
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
