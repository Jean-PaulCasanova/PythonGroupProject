import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createProduct } from "../../redux/products";

function ProductFormPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.products);
  const sessionUser = useSelector((state) => state.session.user);

  // Redirect to login if user is not authenticated
  if (!sessionUser) {
    return <Navigate to="/login" replace={true} />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting product data...');

    const productData = {
      title,
      description,
      price,
      cover_image_url: coverImageUrl,
    };

    console.log('Product data to be dispatched:', productData);

    const newProduct = await dispatch(createProduct(productData));
    if (newProduct && newProduct.id) {
      navigate(`/products/${newProduct.id}`);
    }
  };

  return (
    <div>
      <h1>Create a New Product</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="number"
          step="0.01"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Cover Image URL"
          value={coverImageUrl}
          onChange={(e) => setCoverImageUrl(e.target.value)}
        />
        <button type="submit">Create</button>
      </form>
      {error && <p className="error">{error.message || 'An error occurred.'}</p>}
    </div>
  );
}

export default ProductFormPage;