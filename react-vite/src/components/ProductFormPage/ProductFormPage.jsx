import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createProduct } from "../../redux/products";

function ProductFormPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = {
      title,
      description,
      price,
      cover_image_url: coverImageUrl,
    };

    try {
      const newProduct = await dispatch(createProduct(productData));
      if (newProduct && newProduct.id) {
        navigate(`/products/${newProduct.id}`);
      }
    } catch (err) {
      console.error("Failed to create product:", err);
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
    </div>
  );
}

export default ProductFormPage;