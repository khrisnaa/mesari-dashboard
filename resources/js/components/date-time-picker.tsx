'use client';

import { ChevronDownIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DateTimePickerProps {
    label?: string;
    value?: string | null;
    onChange: (value: string | null) => void;
    minDate?: Date | null;
    maxDate?: Date | null;
}

const extractLocalTime = (value?: string | null) => {
    if (!value) return '00:00';

    const [datePart, timePart] = value.split(' ');
    return timePart ?? '00:00';
};

const mergeLocal = (date: Date, time: string) => {
    const [h, m] = time.split(':').map(Number);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const hh = String(h ?? 0).padStart(2, '0');
    const mm = String(m ?? 0).padStart(2, '0');

    return `${year}-${month}-${day} ${hh}:${mm}`;
};

export function DateTimePicker({ label, value, onChange, minDate, maxDate }: DateTimePickerProps) {
    const [open, setOpen] = useState(false);

    const dateObj = value ? new Date(value) : undefined;
    const timeValue = extractLocalTime(value);

    const [localDate, setLocalDate] = useState<Date | undefined>(dateObj);
    const [localTime, setLocalTime] = useState<string>(timeValue);

    useEffect(() => {
        setLocalDate(dateObj);
        setLocalTime(timeValue);
    }, [value]);

    const handleDateSelect = (selected: Date | undefined) => {
        if (!selected) return;
        setLocalDate(selected);

        const final = mergeLocal(selected, localTime);
        onChange(final);

        setOpen(false);
    };

    const handleTimeChange = (time: string) => {
        setLocalTime(time);
        if (!localDate) return;

        const final = mergeLocal(localDate, time);
        onChange(final);
    };

    return (
        <div className="flex gap-4">
            <div className="flex flex-1 flex-col gap-3">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-between font-normal">
                            {localDate
                                ? localDate.toLocaleDateString('en-US', {
                                      day: '2-digit',
                                      month: 'short',
                                      year: 'numeric',
                                  })
                                : 'Pick a date'}
                            <ChevronDownIcon />
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-auto overflow-hidden p-0">
                        <Calendar
                            mode="single"
                            selected={localDate}
                            onSelect={handleDateSelect}
                            disabled={(date) => {
                                if (minDate && date < minDate) return true;
                                if (maxDate && date > maxDate) return true;
                                return false;
                            }}
                        />
                    </PopoverContent>
                </Popover>
            </div>

            <div className="flex flex-col gap-3">
                <Input
                    type="time"
                    step="60"
                    value={localTime}
                    onChange={(e) => handleTimeChange(e.target.value)}
                    className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden"
                />
            </div>
        </div>
    );
}
