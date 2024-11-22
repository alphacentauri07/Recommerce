
import React, { Fragment} from "react";
import { CgMouse } from "react-icons/cg";
import "./Home.css";
import Product from "./Product.js"


const product = {
 name:"blue shirt",
 images:[{url:"https://m.media-amazon.com/images/I/71eUwDk8z+L._AC_UL480_FMwebp_QL65_.jpg"}],
 price:"2000",
 _id:"valay",
 
};


const Home = () => {
  return (
        <Fragment>
          <div className="banner">
            <p>Welcome to Ecommerce</p>
            <h1>FIND AMAZING PRODUCTS BELOW</h1>

            <a href="#container">
              <button>
                Scroll <CgMouse />
              </button>
            </a>
          </div>

          <h2 className="homeHeading">Featured Products</h2>

          <div className="container" id="container">
           <Product product={product}/>
           <Product product={product}/>
           <Product product={product}/>
           <Product product={product}/>
           <Product product={product}/>
           <Product product={product}/>
           <Product product={product}/>
           <Product product={product}/>

          </div>
        </Fragment>
  );
};


export default Home