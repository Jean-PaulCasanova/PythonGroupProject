import { useDispatch, useSelector } from "react-redux";
import { deleteExistingReview } from "../../redux/reviewsSlice";

const DeleteReviewButton = ({ review }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.session.user);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this review?")) {
        await dispatch(deleteExistingReview(review.id));
  }
};

    if (!currentUser || currentUser.id !== review.userId) return null;

  return (
   <button onClick={handleDelete} className="delete-review-button">
     Delete
      </button>
    );
  };

  export default DeleteReviewButton;