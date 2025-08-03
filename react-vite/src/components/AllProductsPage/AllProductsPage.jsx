import { useEffect, useState } from "react";
import ProductCard from "../ProductCard/ProductCard";
import "./AllProductsPage.css"; // Optional for styles

function AllProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // ⏳ Loading state
  const [error, setError] = useState(null);     // ⚠️ Error state

  useEffect(() => {
    fetch("/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products.");
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error: {error}</p>;
  if (products.length === 0) return <p>No products available yet.</p>;

  return (
    <div className="all-products-page">
      <h1>All Products</h1>
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default AllProductsPage;