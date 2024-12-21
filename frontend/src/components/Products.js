import React, { useEffect, useState } from "react";
import useAxios from "../components/useAxios"; // Custom Axios instance
import Header from "./includes/Header";
import { Link } from "react-router-dom";

function Products() {
  const axiosInstance = useAxios(); // Use the Axios instance with token handling
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/api/v1/products/");
        setProducts(response.data.data); // Assuming the API returns products in `data.data`
      } catch (err) {
        console.error("Error fetching products:", err.response || err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [axiosInstance]);

  const renderProduct = () => {
    if (!Array.isArray(products)) {
      return [];
    }
    return products.map((pro) => (
      <div key={pro.id} className="col-md-4 col-lg-3 col-sm-4 col-xs-12">
        <div className="category">
          <div className="ht__cat__thumb">
            <Link to={`/product/${pro.id}`}>
              <img
                src={`http://127.0.0.1:8001${pro.image}`}
                alt={pro.name}
                style={{ width: "100%", height: "200px", objectFit: "contain" }}
              />
            </Link>
          </div>
          <div className="fr__hover__info">
            <ul className="product__action">
              <li>
                <a href="wishlist.html">
                  <i className="fas fa-heart icons"></i>
                </a>
              </li>
              <li>
                <a href="cart.html">
                  <i className="fas fa-shopping-cart icons"></i>
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fas fa-shuffle icons"></i>
                </a>
              </li>
            </ul>
          </div>
          <div className="fr__product__inner">
            <h4>
              <a href="product-details.html">{pro.name}</a>
            </h4>
            <ul className="fr__pro__prize">
              <li
                className="old__prize"
                style={{ textDecoration: "line-through" }}
              >
                ${pro.old_price}
              </li>
              <li>${pro.price}</li>
            </ul>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <>
      <Header />
      <section className="htc__category__area ptb--100">
        <div className="container">
          <div className="row">
            <div className="col-xs-12">
              <div className="section__title--2 text-center">
                <h2 className="title__line">All Products</h2>
                <p>"Fresh styles delivered to your door—All Products!"</p>
              </div>
            </div>
          </div>
          <div className="htc__product__container">
            <div className="row">
              <div
                className="product__list clearfix mt--30"
                style={{ display: "flex", flexWrap: "wrap" }}
              >
                {loading ? (
                  <p>Loading...</p>
                ) : error ? (
                  <p style={{ color: "red" }}>{error}</p>
                ) : (
                  renderProduct()
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Products;
