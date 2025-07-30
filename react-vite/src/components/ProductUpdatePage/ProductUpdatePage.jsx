import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ProductUpdatePage() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");

  useEffect(() => {
    // Load product to edit
    fetch(`http://localhost:5000/api/products/${productId}`)
      .then((res) => res.json())
      .then((product) => {
        setTitle(product.title || "");
        setDescription(product.description || "");
        setPrice(product.price || "");
        setCoverImageUrl(product.cover_image_url || "");
      })
      .catch((err) => console.error("Failed to load product for editing:", err));
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      title,
      description,
      price,
      cover_image_url: coverImageUrl,
    };

    try {
      const res = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        const updatedProduct = await res.json();
        navigate(`/products/${updatedProduct.id}`);
      } else {
        console.error("Failed to update product");
      }
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };

  return (
    <div>
      <h1>Update Product</h1>
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
        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default ProductUpdatePage;