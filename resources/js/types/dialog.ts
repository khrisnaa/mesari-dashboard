export interface DialogComponentProps<T = undefined> {
    isOpen: boolean;
    close: () => void;
    onOpenChange: (state: boolean) => void;
    payload?: T;
}
