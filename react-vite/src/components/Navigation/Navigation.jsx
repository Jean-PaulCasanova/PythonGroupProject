import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux"; // ← if you're using it
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation() {
  const user = useSelector((state) => state.session.user); // ✅ inside component

  return (
    <ul>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>

      {user && (
        <li>
          <NavLink to="/wishlist">Wishlist</NavLink>
        </li>
      )}

      <li>
        <ProfileButton />
      </li>
    </ul>
  );
}

export default Navigation;
