import { Product } from '@/types/product';

interface PageProps {
    product: Product;
}

const Edit = ({ product }: PageProps) => {
    console.log(product);
    return <div>Edit</div>;
};
export default Edit;
