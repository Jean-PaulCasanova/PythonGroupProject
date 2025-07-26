// //? --------- OG SHOW PAGE ----------

// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";

// function ProductShowPage() {
//   const { productId } = useParams();
//   const [product, setProduct] = useState(null);

//   useEffect(() => {
//     fetch(`http://localhost:5000/api/products/${productId}`)
//       .then((res) => res.json())
//       .then(setProduct)
//       .catch((err) => console.error("Failed to load product:", err));
//   }, [productId]);

//   if (!product) return <p>Loading...</p>;

//   return (
//     <div className="product-show-page">
//       <div style={{ display: "flex" }}>
//         {/* Album photo */}
//         <div>
//           <img
//             src={product.cover_image_url}
//             alt={product.title}
//             style={{ width: "300px", height: "300px", objectFit: "cover" }}
//           />
//           <div>
//             <button>Cart</button>
//             <button>Wish</button>
//           </div>
//         </div>

//         {/* Album info */}
//         <div style={{ marginLeft: "30px" }}>
//           <h1>{product.title}</h1>
//           <h3>By: {product.seller?.username || "Artist name"}</h3>

//           <div>
//             <button>▶</button> Featured Track
//           </div>

//           <h4>Digital Album</h4>
//           <div
//             style={{
//               border: "1px solid gray",
//               padding: "10px",
//               minWidth: "300px",
//             }}
//           >
//             {product.description}
//           </div>
//         </div>
//       </div>

//       <div style={{ marginTop: "30px" }}>
//         <h3>Reviews</h3>
//         <p><em>Be the first</em></p>
//         <p>“Feature coming soon”</p>
//       </div>
//     </div>
//   );
// }

// export default ProductShowPage;


// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import "./ProductShowPage.css";

// function ProductShowPage() {
//   const { productId } = useParams();
//   const [product, setProduct] = useState(null);

//   useEffect(() => {
//     fetch(`http://localhost:5000/api/products/${productId}`)
//       .then((res) => res.json())
//       .then(setProduct)
//       .catch((err) => console.error("Failed to load product:", err));
//   }, [productId]);

//   if (!product) return <p>Loading...</p>;

//   return (
//     <div className="product-show-page">
//       <div className="product-show-main">
//         {/* Album cover & buttons */}
//         <div className="product-image-section">
//           <img
//             src={product.cover_image_url}
//             alt={product.title}
//             className="product-image"
//           />
//           <div className="action-buttons">
//             <button className="cart-button">Add to Cart</button>
//             <button className="wishlist-button">Add to Wishlist</button>
//           </div>
//         </div>

//         {/* Album Info */}
//         <div className="product-info-section">
//           <h1>{product.title}</h1>
//           <h3>By: {product.seller?.username || "Artist name"}</h3>

//           <div className="featured-track">
//             <button className="play-button">▶</button>
//             <span> Featured Track</span>
//           </div>

//           <h4>Digital Album</h4>
//           <div className="product-description">
//             {product.description}
//           </div>
//         </div>
//       </div>

//       {/* Reviews Section */}
//       <div className="reviews-section">
//         <h3>Reviews</h3>
//         <p><em>Be the first to review this album!</em></p>
//         <p>“Review feature coming soon”</p>
//       </div>
//     </div>
//   );
// }

// export default ProductShowPage;

// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import "./ProductShowPage.css";

// function ProductShowPage() {
//   const { productId } = useParams();
//   const [product, setProduct] = useState(null);

//   useEffect(() => {
//     fetch(`http://localhost:5000/api/products/${productId}`)
//       .then((res) => res.json())
//       .then(setProduct)
//       .catch((err) => console.error("Failed to load product:", err));
//   }, [productId]);

//   if (!product) return <p>Loading...</p>;

//   return (
//     <div className="product-show-page">
//       <div className="product-show-main">
//         <div className="product-image-section">
//           <img
//             src={product.cover_image_url}
//             alt={product.title}
//             className="product-image"
//           />
//           <div className="action-buttons">
//             <button className="cart-button">Add to Cart</button>
//             <button className="wishlist-button">Add to Wishlist</button>
//           </div>
//         </div>

//         <div className="product-info-section">
//           <h1>{product.title}</h1>
//           <h3>By: {product.seller?.username || "Artist name"}</h3>

//           <div className="featured-track">
//             <button className="play-button">▶</button>
//             <span> Featured Track</span>
//           </div>

//           <h4>Digital Album</h4>
//           <div className="product-description">{product.description}</div>
//         </div>
//       </div>

//       <div className="reviews-section">
//         <h3>Reviews</h3>
//         <p><em>Be the first to review this album!</em></p>
//         <p>“Review feature coming soon”</p>
//       </div>
//     </div>
//   );
// }

// export default ProductShowPage;


import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./ProductShowPage.css";

function ProductShowPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${productId}`)
      .then((res) => res.json())
      .then(setProduct)
      .catch((err) => console.error("Failed to load product:", err));
  }, [productId]);

  if (!product) return <p>Loading...</p>;

  return (
    <div className="product-show-page">
      <div className="product-show-main">
        <div className="product-image-section">
          <img
            src={product.cover_image_url}
            alt={product.title}
            className="product-image"
          />
          <div className="action-buttons">
            <button className="cart-button">Add to Cart</button>
            <button className="wishlist-button">Add to Wishlist</button>
          </div>
        </div>

        <div className="product-info-section">
          <h1>{product.title}</h1>
          <h3>By: {product.seller?.username || "Artist name"}</h3>

          <div className="featured-track">
            <button
              className="play-button"
              onClick={() => alert("Feature coming soon!")}
            >
              ▶
            </button>
            <span> Featured Track</span>
          </div>

          <h4>Digital Album</h4>
          <div className="product-description">{product.description}</div>
        </div>
      </div>

      <div className="reviews-section">
        <h3>Reviews</h3>
        <p><em>Be the first to review this album!</em></p>
        <p>“Review feature coming soon”</p>
      </div>
    </div>
  );
}

export default ProductShowPage;