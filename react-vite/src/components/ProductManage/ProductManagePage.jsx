// import { useEffect, useState } from "react";

// function ProductManagePage() {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     fetch("http://localhost:5000/api/products/manage", {
//       credentials: "include",
//     })
//       .then((res) => res.json())
//       .then((data) => setProducts(data.products || []));
//   }, []);

//   return (
//     <div>
//       <h1>Manage Your Products</h1>
//       {products.length ? (
//         <ul>
//           {products.map((product) => (
//             <li key={product.id}>
//               <strong>{product.title}</strong> - ${product.price}
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No products found.</p>
//       )}
//     </div>
//   );
// }

// export default ProductManagePage;


// ------ OG DELETE --------------------

import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "../../config";
import "./ProductManagePage.css"; 

function ProductManagePage() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products/manage`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []));
  }, []);

  const handleDelete = async (productId) => {
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;

    try {
      console.log(`Attempting to delete product ${productId}`);
      const res = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });

      console.log(`Delete response status: ${res.status}`);
      
      if (res.ok) {
        console.log("Product deleted successfully");
        setProducts((prev) => prev.filter((p) => p.id !== productId));
        alert("Product deleted successfully!");
      } else {
        const errorData = await res.text();
        console.error("Failed to delete product:", res.status, errorData);
        alert(`Failed to delete product: ${res.status} - ${errorData}`);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert(`Error deleting product: ${error.message}`);
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
                  src={product.cover_image_url || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f0f0f0'/%3E%3Ctext x='100' y='100' text-anchor='middle' dy='0.3em' font-family='Arial' font-size='14' fill='%23666'%3ENo Image%3C/text%3E%3C/svg%3E"}
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