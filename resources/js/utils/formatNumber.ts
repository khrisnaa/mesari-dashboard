// 5000 => "5.000"
export const formatNumber = (value: string | number | undefined): string => {
    if (value === undefined || value === null) return '';
    const rawValue = value.toString().replace(/\D/g, '');
    if (rawValue === '') return '';
    return new Intl.NumberFormat('id-ID').format(Number(rawValue));
};

// "5.000" => 5000

export const parseNumber = (value: string | undefined): number => {
    if (!value) return 0;
    return Number(value.replace(/\D/g, ''));
};
