import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogFooter, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface HSV {
    h: number;
    s: number;
    v: number;
}

interface ColorPickerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onColorSelect?: (value: any) => void;
}

interface SaturationAreaProps {
    hsv: HSV;
    onChange: (hsv: HSV) => void;
}

interface HueSliderProps {
    hsv: HSV;
    onChange: (hsv: HSV) => void;
}

const hexToHsv = (hex: string): HSV => {
    let color = hex.replace('#', '');
    if (color.length === 3) {
        color = color
            .split('')
            .map((c) => c + c)
            .join('');
    }

    if (color.length !== 6) return { h: 0, s: 0, v: 0 };

    const r = parseInt(color.substring(0, 2), 16) / 255;
    const g = parseInt(color.substring(2, 4), 16) / 255;
    const b = parseInt(color.substring(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;

    const s = max === 0 ? 0 : d / max;
    const v = max;
    let h = 0;

    if (max !== min) {
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }

    return { h: h * 360, s: s * 100, v: v * 100 };
};

const hsvToHex = (h: number, s: number, v: number): string => {
    s /= 100;
    v /= 100;
    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;

    let r = 0,
        g = 0,
        b = 0;

    if (0 <= h && h < 60) {
        r = c;
        g = x;
        b = 0;
    } else if (60 <= h && h < 120) {
        r = x;
        g = c;
        b = 0;
    } else if (120 <= h && h < 180) {
        r = 0;
        g = c;
        b = x;
    } else if (180 <= h && h < 240) {
        r = 0;
        g = x;
        b = c;
    } else if (240 <= h && h < 300) {
        r = x;
        g = 0;
        b = c;
    } else if (300 <= h && h < 360) {
        r = c;
        g = 0;
        b = x;
    }

    const toHex = (n: number) => {
        const hexStr = Math.round((n + m) * 255).toString(16);
        return hexStr.length === 1 ? '0' + hexStr : hexStr;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
};

const SaturationArea: React.FC<SaturationAreaProps> = ({ hsv, onChange }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleMove = useCallback(
        (
            event:
                | MouseEvent
                | TouchEvent
                | React.MouseEvent
                | React.TouchEvent,
        ) => {
            if (!containerRef.current) return;
            const { left, top, width, height } =
                containerRef.current.getBoundingClientRect();

            let clientX: number, clientY: number;

            if ('touches' in event) {
                clientX = event.touches[0].clientX;
                clientY = event.touches[0].clientY;
            } else {
                clientX = (event as MouseEvent).clientX;
                clientY = (event as MouseEvent).clientY;
            }

            let x = Math.min(Math.max(0, clientX - left), width);
            let y = Math.min(Math.max(0, clientY - top), height);

            const s = (x / width) * 100;
            const v = 100 - (y / height) * 100;

            onChange({ ...hsv, s, v });
        },
        [hsv, onChange],
    );

    useEffect(() => {
        const handleUp = () => setIsDragging(false);
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) handleMove(e);
        };
        const handleTouchMove = (e: TouchEvent) => {
            if (isDragging) {
                e.preventDefault();
                handleMove(e);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleUp);
        window.addEventListener('touchmove', handleTouchMove, {
            passive: false,
        });
        window.addEventListener('touchend', handleUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleUp);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleUp);
        };
    }, [isDragging, handleMove]);

    const bgColor = `hsl(${hsv.h}, 100%, 50%)`;

    return (
        <div
            ref={containerRef}
            className="relative h-48 w-full cursor-pointer touch-none overflow-hidden rounded-lg shadow-sm"
            style={{ backgroundColor: bgColor }}
            onMouseDown={(e) => {
                setIsDragging(true);
                handleMove(e);
            }}
            onTouchStart={(e) => {
                setIsDragging(true);
                handleMove(e);
            }}
        >
            <div
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(to right, #fff, transparent)',
                }}
            />
            <div
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(to top, #000, transparent)',
                }}
            />

            <div
                className="pointer-events-none absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 transform rounded-full border-2 border-white bg-transparent shadow-md"
                style={{
                    left: `${hsv.s}%`,
                    top: `${100 - hsv.v}%`,
                }}
            />
        </div>
    );
};

const HueSlider: React.FC<HueSliderProps> = ({ hsv, onChange }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleMove = useCallback(
        (
            event:
                | MouseEvent
                | TouchEvent
                | React.MouseEvent
                | React.TouchEvent,
        ) => {
            if (!containerRef.current) return;
            const { left, width } =
                containerRef.current.getBoundingClientRect();

            let clientX: number;
            if ('touches' in event) {
                clientX = event.touches[0].clientX;
            } else {
                clientX = (event as MouseEvent).clientX;
            }

            let x = Math.min(Math.max(0, clientX - left), width);
            const h = (x / width) * 360;

            onChange({ ...hsv, h });
        },
        [hsv, onChange],
    );

    useEffect(() => {
        const handleUp = () => setIsDragging(false);
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) handleMove(e);
        };
        const handleTouchMove = (e: TouchEvent) => {
            if (isDragging) {
                e.preventDefault();
                handleMove(e);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleUp);
        window.addEventListener('touchmove', handleTouchMove, {
            passive: false,
        });
        window.addEventListener('touchend', handleUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleUp);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleUp);
        };
    }, [isDragging, handleMove]);

    return (
        <div
            ref={containerRef}
            className="relative mt-4 h-4 w-full cursor-pointer touch-none rounded-full shadow-inner"
            style={{
                background:
                    'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)',
            }}
            onMouseDown={(e) => {
                setIsDragging(true);
                handleMove(e);
            }}
            onTouchStart={(e) => {
                setIsDragging(true);
                handleMove(e);
            }}
        >
            <div
                className="pointer-events-none absolute h-5 w-5 -translate-x-1/2 -translate-y-[2px] transform rounded-full border-2 border-white bg-white shadow-md"
                style={{
                    left: `${(hsv.h / 360) * 100}%`,
                    backgroundColor: `hsl(${hsv.h}, 100%, 50%)`,
                }}
            />
        </div>
    );
};

export const ColorPickerDialog = ({
    open,
    onOpenChange,
    onColorSelect,
}: ColorPickerDialogProps) => {
    const [hsv, setHsv] = useState<HSV>({ h: 210, s: 50, v: 90 });
    const [hex, setHex] = useState<string>('#73A0E6');
    const [colorLabel, setColorLabel] = useState<string>('Custom Color');

    const handleHsvChange = (newHsv: HSV) => {
        setHsv(newHsv);
        setHex(hsvToHex(newHsv.h, newHsv.s, newHsv.v));
    };

    const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setHex(val);

        const hexRegex = /^#?([0-9A-F]{3}|[0-9A-F]{6})$/i;
        if (hexRegex.test(val)) {
            setHsv(hexToHsv(val));
        }
    };

    const handleOnSave = () => {
        onOpenChange(false);
        if (!onColorSelect) return;
        onColorSelect({ name: colorLabel, hex });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-md p-4 [&>#btn-close]:hidden">
                <DialogTitle className="text-sm">Add a new color</DialogTitle>
                <div className="space-y-4">
                    <section className="relative z-10 space-y-4">
                        <SaturationArea hsv={hsv} onChange={handleHsvChange} />

                        <HueSlider hsv={hsv} onChange={handleHsvChange} />
                    </section>
                    <section className="grid grid-cols-2 gap-6">
                        <div className="grid gap-2">
                            <Label
                                htmlFor="hex"
                                className="text-xs text-muted-foreground"
                            >
                                Color Hex
                            </Label>
                            <div className="relative">
                                <Input
                                    id="hex"
                                    value={hex}
                                    onChange={handleHexInputChange}
                                    type="text"
                                    autoComplete="off"
                                    name="hex"
                                    placeholder="#000000"
                                    className="pl-8"
                                />
                                <div
                                    style={{ backgroundColor: hex }}
                                    className="absolute top-1/2 left-2 aspect-square h-5 -translate-y-1/2 rounded-full"
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label
                                htmlFor="name"
                                className="text-xs text-muted-foreground"
                            >
                                Color label
                            </Label>
                            <Input
                                id="name"
                                onChange={(e) => setColorLabel(e.target.value)}
                                type="text"
                                autoFocus
                                autoComplete="off"
                                name="name"
                                placeholder="Black"
                            />
                        </div>
                    </section>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Close
                    </Button>
                    <Button onClick={handleOnSave}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
