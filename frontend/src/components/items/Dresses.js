import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Header from '../includes/Header';
import  { BASE_URL } from '../includes/Api'
import { Link } from 'react-router-dom';
import useAxios from "../useAxios";

function Dresses() {

    const [dress, setDress] = useState([]);
    const axiosInstance = useAxios();
    const BASE_IMAGE_URL = "http://localhost:8001";

        useEffect(() => {
          axiosInstance.get(`${BASE_URL}?q=2`)
            .then((response) => {
              setDress(response.data.data);
            })
            .catch((err) => {
              console.log(err);
            });
        }, [axiosInstance]);


    const renderItem = () => {
  if (!Array.isArray(dress)) return [];

  return dress.map((pro) => (
    <div key={pro.id} className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4">
      <div className="category">
        <div className="ht__cat__thumb">
          <Link to={`/product/${pro.id}`}>
            <img
              src={`${BASE_IMAGE_URL}${pro.image}`}
              alt={pro.name}
              style={{ width: "100%", height: "300px", objectFit: "contain" }}
            />
          </Link>
        </div>
        <div className="fr__hover__info">
          <ul className="product__action">
            <li><a href="#"><i className="fas fa-heart icons"></i></a></li>
            <li><a href="#"><i className="fas fa-shopping-cart icons"></i></a></li>
            <li><a href="#"><i className="fas fa-shuffle icons"></i></a></li>
          </ul>
        </div>
        <div className="fr__product__inner">
          <h4>{pro.name}</h4>
          <ul className="fr__pro__prize">
            <li className="old__prize" style={{ textDecoration: "line-through" }}>
              ${pro.old_price?.parsedValue}
            </li>
            <li>${pro.price?.parsedValue}</li>
          </ul>
        </div>
      </div>
    </div>
  ));
};

  return (
    <>
    <Header/>
    <section className="htc__category__area ptb--100">
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <div className="section__title--2 text-center">
              <h2 className="title__line">Dress</h2>
              <p>"Fresh styles delivered to your door"</p>
            </div>
          </div>
        </div>
        <div className="htc__product__container" >
          <div className="row" >
            <div className="product__list clearfix mt--30" style={{ display: "flex", flexWrap: "wrap" }}>
              {renderItem()}
              </div>
          </div>
        </div>
      </div>
      
    </section>
    </>
  )
}

export default Dresses