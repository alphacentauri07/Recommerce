import React from 'react'
import { Rating } from '@mui/lab';
import profilePng from "../../images/Profile.png"

const ReviewCard = ({review}) => {

  const options = {
    value: review.rating,
    readOnly: true,
    precision: 0.5,
    sx: {
      "& .MuiRating-iconFilled": { color: "#faaf00" }, // Set color for filled stars
      "& .MuiRating-iconEmpty": { color: "#ccc" },    // Optional: Set color for empty stars
    },
  };

  return (
    <div className="reviewCard">
    <img src={profilePng} alt="User"/>    
    <p>{review.name}</p>
    <Rating {...options}/>
    <span className="reviewCardComment">{review.comment}</span>
    </div>
  )
}

export default ReviewCard