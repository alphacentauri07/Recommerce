import { configureStore } from "@reduxjs/toolkit";
import {thunk} from "redux-thunk";
import { productDetailsReducer, productsReducer } from "./reducers/productReducer";
import { profileReducer, userReducer } from "./reducers/userReducer";




const store = configureStore({
  reducer: {
   products:productsReducer,
   productDetails:productDetailsReducer,
   user:userReducer,
   profile:profileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(thunk), // Add custom middleware like thunk
});

export default store;

//making redux store
// while working with redux we need 3 things constants,reducers,actions