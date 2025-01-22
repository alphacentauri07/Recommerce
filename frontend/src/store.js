import { configureStore } from "@reduxjs/toolkit";
import {thunk} from "redux-thunk";
import { newReviewReducer, productDetailsReducer, productsReducer } from "./reducers/productReducer";
import { forgotPasswordReducer, profileReducer, userReducer } from "./reducers/userReducer";
import { cartReducer } from "./reducers/cartReducer";
import { myOrdersReducer, newOrderReducer, orderDetailsReducer } from "./reducers/orderReducer";


let initialState = {
  cart: {
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
    shippingInfo: localStorage.getItem("shippingInfo")
      ? JSON.parse(localStorage.getItem("shippingInfo"))
      : {},
  },
};


const store = configureStore({
  reducer: {
   products:productsReducer,
   productDetails:productDetailsReducer,
   user:userReducer,
   profile:profileReducer,
   forgotPassword:forgotPasswordReducer,
   cart:cartReducer,
   newOrder:newOrderReducer,
   myOrders:myOrdersReducer,
   orderDetails:orderDetailsReducer,
   newReview:newReviewReducer,
  },
  preloadedState: initialState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(thunk), // Add custom middleware like thunk
});

export default store;

//making redux store
// while working with redux we need 3 things constants,reducers,actions