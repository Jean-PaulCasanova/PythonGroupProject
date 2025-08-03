import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import './ProductForm.css';
import { useHistory, useParams } from 'react-router-dom';
import { createProduct, updateProduct, fetchProduct } from '../../store/products';

const ProductForm = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { productId } = useParams();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [coverImageUrl, setCoverImageUrl] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (productId) {
            dispatch(fetchProduct(productId)).then(product => {
                if (product) {
                    setTitle(product.title);
                    setDescription(product.description);
                    setPrice(product.price);
                    setCoverImageUrl(product.cover_image_url);
                }
            });
        }
    }, [dispatch, productId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const productData = { title, description, price, cover_image_url: coverImageUrl };

        let result;
        if (productId) {
            result = await dispatch(updateProduct(productId, productData));
        } else {
            result = await dispatch(createProduct(productData));
        }

        if (result.errors) {
            setErrors(result.errors);
        } else {
            history.push('/products/manage');
        }
    };

    return (
        <form className="product-form" onSubmit={handleSubmit}>
            <h2>{productId ? 'Update Product' : 'Create Product'}</h2>
            <div>
                <label>Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                {errors.title && <p>{errors.title}</p>}
            </div>
            <div>
                <label>Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                {errors.description && <p>{errors.description}</p>}
            </div>
            <div>
                <label>Price</label>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
                {errors.price && <p>{errors.price}</p>}
            </div>
            <div>
                <label>Cover Image URL</label>
                <input type="text" value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} />
                {errors.cover_image_url && <p>{errors.cover_image_url}</p>}
            </div>
            <button type="submit">{productId ? 'Update' : 'Create'}</button>
        </form>
    );
};

export default ProductForm;