/////OG CODE /////////////////

// import { NavLink } from "react-router-dom";
// import ProfileButton from "./ProfileButton";
// import "./Navigation.css";

// function Navigation() {
//   return (
//     <ul>
//       <li>
//         <NavLink to="/">Home</NavLink>
//       </li>

//       <li>
//         <ProfileButton />
//       </li>
//     </ul>
//   );
// }

// export default Navigation;





/// --- i like this one ----

// import { NavLink } from "react-router-dom";
// import { useSelector } from "react-redux";
// import ProfileButton from "./ProfileButton";
// import "./Navigation.css";

// function Navigation() {
//   const sessionUser = useSelector((state) => state.session.user);

//   return (
//     <ul className="nav-list">
//       <li>
//         <NavLink to="/">Home</NavLink>
//       </li>

//       {sessionUser && (
//         <>
//           <li className="create-product-link">
//             <NavLink to="/products/new">Create Product</NavLink>
//           </li>
//           <li className="manage-product-link">
//             <NavLink to="/products/manage">Manage Products</NavLink>
//           </li>
//         </>
//       )}

//       <li>
//         <ProfileButton />
//       </li>
//     </ul>
//   );
// }

// export default Navigation;







import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchCart } from "../../redux/cart";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation() {
  const sessionUser = useSelector((state) => state.session.user);
  const { item_count } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  useEffect(() => {
    if (sessionUser) {
      dispatch(fetchCart());
    }
  }, [dispatch, sessionUser]);

  return (
    <ul className="nav-list">
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      <li>
        <NavLink to="/products">🛍️ Shop</NavLink>
      </li>

      {sessionUser && (
        <>
          <li className="create-product-link">
            <NavLink to="/products/new">Create Product</NavLink>
          </li>
          <li className="manage-product-link">
            <NavLink to="/products/manage">Manage Products</NavLink>
          </li>
          <li className="wishlist-link">
            <NavLink to="/wishlist">
              ❤️ Wishlist
            </NavLink>
          </li>
          <li className="cart-link">
            <NavLink to="/cart">
              🛒 Cart {item_count > 0 && <span className="cart-count">({item_count})</span>}
            </NavLink>
          </li>
        </>
      )}

      <li>
        <ProfileButton />
      </li>
    </ul>
  );
}

export default Navigation;
