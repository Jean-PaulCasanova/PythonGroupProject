import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "./ProductManagePage.css"; 

function ProductManagePage() {
  const [products, setProducts] = useState([]);
  const user = useSelector((state) => state.session.user);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/products/manage", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []));
  }, []);

  const handleDelete = async (productId) => {
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;

    const res = await fetch(`http://localhost:5000/api/products/${productId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } else {
      console.error("Failed to delete product");
    }
  };

  return (
    <div className="manage-products-container">
      <h1>Manage Your Products</h1>

      {products.length ? (
        <div className="product-list">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <Link to={`/products/${product.id}`} className="product-link">
                <img
                  src={product.cover_image_url}
                  alt={product.title}
                  className="product-thumbnail"
                />
                <h3>{product.title}</h3>
              </Link>

              <div className="product-actions">
                <button
                  className="update-button"
                  onClick={() => navigate(`/products/${product.id}/edit`)}
                >
                  Update
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(product.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
}

export default ProductManagePage;