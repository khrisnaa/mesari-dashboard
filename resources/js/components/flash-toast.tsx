// components/FlashToast.tsx

import { cleanFlashMessage } from '@/utils/cleanFlashMessage';
import { PageProps } from '@inertiajs/core';
import { usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

export interface FlashProps extends PageProps {
    flash?: {
        success?: string;
        error?: string;
    };
}

const FlashToast = () => {
    const { flash } = usePage<FlashProps>().props;

    const shownRef = useRef({
        success: '',
        error: '',
    });

    useEffect(() => {
        if (flash?.success && flash.success !== shownRef.current.success) {
            toast.success(cleanFlashMessage(flash.success));
            shownRef.current.success = flash.success;
        }

        if (flash?.error && flash.error !== shownRef.current.error) {
            toast.error(flash.error);
            shownRef.current.error = flash.error;
        }
    }, [flash]);

    return null;
};

export default FlashToast;
