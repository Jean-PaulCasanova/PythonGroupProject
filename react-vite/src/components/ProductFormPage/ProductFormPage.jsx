// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// function ProductFormPage() {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [price, setPrice] = useState("");
//   const [coverImageUrl, setCoverImageUrl] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const res = await fetch("http://localhost:5000/api/products", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       credentials: "include",
//       body: JSON.stringify({ title, description, price, cover_image_url: coverImageUrl }),
//     });

//     if (res.ok) {
//       const newProduct = await res.json();
//       navigate(`/products/${newProduct.id}`); // ← redirect to ProductShowPage
//     } else {
//       const error = await res.json();
//       console.error(error);
//     }
//   };

//   return (
//     <div>
//       <h1>Create a New Product</h1>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           required
//         />
//         <textarea
//           placeholder="Description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           required
//         />
//         <input
//           type="number"
//           step="0.01"
//           placeholder="Price"
//           value={price}
//           onChange={(e) => setPrice(e.target.value)}
//           required
//         />
//         <input
//           type="text"
//           placeholder="Cover Image URL"
//           value={coverImageUrl}
//           onChange={(e) => setCoverImageUrl(e.target.value)}
//         />
//         <button type="submit">Create</button>
//       </form>
//     </div>
//   );
// }

// export default ProductFormPage;


// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// function ProductFormPage() {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [price, setPrice] = useState("");
//   const [coverImageUrl, setCoverImageUrl] = useState("");
//   const navigate = useNavigate();

//   // Helper to get cookie value by name
//   function getCookie(name) {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) return parts.pop().split(";").shift();
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const csrfToken = getCookie("csrf_token");

//     const res = await fetch("http://localhost:5000/api/products", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "X-CSRFToken": csrfToken, // <-- Add CSRF token here
//       },
//       credentials: "include",
//       body: JSON.stringify({
//         title,
//         description,
//         price,
//         cover_image_url: coverImageUrl,
//       }),
//     });

//     if (res.ok) {
//       const newProduct = await res.json();
//       navigate(`/products/${newProduct.id}`); // redirect to ProductShowPage
//     } else {
//       const error = await res.json();
//       console.error(error);
//     }
//   };

//   return (
//     <div>
//       <h1>Create a New Product</h1>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           required
//         />
//         <textarea
//           placeholder="Description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           required
//         />
//         <input
//           type="number"
//           step="0.01"
//           placeholder="Price"
//           value={price}
//           onChange={(e) => setPrice(e.target.value)}
//           required
//         />
//         <input
//           type="text"
//           placeholder="Cover Image URL"
//           value={coverImageUrl}
//           onChange={(e) => setCoverImageUrl(e.target.value)}
//         />
//         <button type="submit">Create</button>
//       </form>
//     </div>
//   );
// }

// export default ProductFormPage;



// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { createProduct } from "../../redux/products"; 

// function ProductFormPage() {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [price, setPrice] = useState("");
//   const [coverImageUrl, setCoverImageUrl] = useState("");
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const productData = {
//       title,
//       description,
//       price,
//       cover_image_url: coverImageUrl,
//     };

//     try {
//       const newProduct = await dispatch(createProductThunk(productData));
//       if (newProduct && newProduct.id) {
//         navigate(`/products/${newProduct.id}`);
//       }
//     } catch (err) {
//       console.error("Failed to create product:", err);
//     }
//   };

//   return (
//     <div>
//       <h1>Create a New Product</h1>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           required
//         />
//         <textarea
//           placeholder="Description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           required
//         />
//         <input
//           type="number"
//           step="0.01"
//           placeholder="Price"
//           value={price}
//           onChange={(e) => setPrice(e.target.value)}
//           required
//         />
//         <input
//           type="text"
//           placeholder="Cover Image URL"
//           value={coverImageUrl}
//           onChange={(e) => setCoverImageUrl(e.target.value)}
//         />
//         <button type="submit">Create</button>
//       </form>
//     </div>
//   );
// }

// export default ProductFormPage;


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createProduct } from "../../redux/products"; // ✅ This is your thunk

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
      const newProduct = await dispatch(createProduct(productData)); // ✅ Fixed thunk name
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