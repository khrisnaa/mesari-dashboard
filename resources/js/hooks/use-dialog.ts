import { useCallback, useState } from 'react';

export const useDialog = <T = undefined>() => {
    const [isOpen, setIsOpen] = useState(false);
    const [payload, setPayload] = useState<T | undefined>(undefined);

    const open = useCallback((data?: T) => {
        setPayload(data);
        setIsOpen(true);
    }, []);

    const close = useCallback(() => {
        setIsOpen(false);
        setPayload(undefined);
    }, []);

    const onOpenChange = useCallback((state: boolean) => {
        setIsOpen(state);
        if (!state) setPayload(undefined);
    }, []);

    return {
        isOpen,
        open,
        close,
        onOpenChange,
        payload,
    };
};
