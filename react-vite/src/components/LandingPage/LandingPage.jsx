import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../config";
import "./LandingPage.css";

function LandingPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setProducts(data || []))
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setProducts([]);
      });
  }, []);

  return (
    <div className="landing-container">
      <h1>Discover Music</h1>

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
            </div>
          ))}
        </div>
      ) : (
        <p>No albums available right now.</p>
      )}
    </div>
  );
}

export default LandingPage;