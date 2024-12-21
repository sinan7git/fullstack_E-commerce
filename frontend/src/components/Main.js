import React, { useEffect, useState } from "react";
import Header from "./includes/Header";
import Area from "./Area";
import "./includes/Header.css";
import BestSeller from "./BestSeller";
import Testimonial from "./Testimonial";
import TopRated from "./TopRated";
import Brand from "./Brand";
import Blog from "./Blog";
import Footer from "./includes/Footer";
import Banner from "./Banner";
import useAxios from "./useAxios"; // Custom Axios hook
import useRoleAccess from "./useRoleAccess"; // Hook to check role access
import SellerDashboard from "./seller/SellerDashboard";

function Main() {
  const [arrival, setArrival] = useState([]);
  const isCustomer = useRoleAccess(["CUSTOMER"]); // Check if user is a CUSTOMER
  const isSeller = useRoleAccess(["SELLER"]); // Check if user is a SELLER
  const axiosInstance = useAxios();

  // Fetch new arrivals if the user is a customer
  useEffect(() => {
    if (isCustomer) {
      axiosInstance
        .get("/api/v1/products/new_arrival/")
        .then((response) => {
          setArrival(response.data.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [axiosInstance, isCustomer]);

  const renderProduct = () => {
    if (!Array.isArray(arrival)) {
      return [];
    }
    return arrival.map((arr) => (
      <div key={arr.id} className="col-md-4 col-lg-3 col-sm-4 col-xs-12">
        <div className="category">
          <div className="ht__cat__thumb">
            <img
              src={arr.image}
              alt="slider images"
              style={{ width: "100%", height: "200px", objectFit: "contain" }}
            />
          </div>
          <div className="fr__hover__info"></div>
          <div className="fr__product__inner">
            <h4>
              <a href="##">{arr.name}</a>
            </h4>
            <ul className="fr__pro__prize">
              <li
                className="old__prize"
                style={{ textDecoration: "line-through" }}
              >
                ${arr.old_price}
              </li>
              <li>${arr.price}</li>
            </ul>
          </div>
        </div>
      </div>
    ));
  };

  if (isSeller) {
    // Render a separate template for sellers
    return (
      <>
      <Header />
      <SellerDashboard />
      <Footer />
    </>
    );
  }

  if (isCustomer) {
    // Render the customer template
    return (
      <>
        <Header />
        <Banner />
        <section className="htc__category__area ptb--100">
          <div className="container">
            <div className="row">
              <div className="col-xs-12">
                <div className="section__title--2 text-center">
                  <h2 className="title__line">New Arrivals</h2>
                  <p>"Fresh styles delivered to your door—New Arrivals!"</p>
                </div>
              </div>
            </div>
            <div className="htc__product__container">
              <div className="row">
                <div className="product__list clearfix mt--30">
                  {renderProduct()}
                </div>
              </div>
            </div>
          </div>
        </section>
        <Area />
        <BestSeller />
        <Testimonial />
        <TopRated />
        <Brand />
        <Blog />
        <Footer />
      </>
    );
  }

  // Render a fallback or loading state if no role is determined
  return (
    <div className="loading">
      <Header />
    </div>
  );
}

export default Main;
