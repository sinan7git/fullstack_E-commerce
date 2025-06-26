import React, { useEffect, useState } from 'react';
import useAxios from './useAxios'; // Make sure path is correct

function BestSeller() {
  const [seller, setSeller] = useState([]);
  const axiosInstance = useAxios(); // your authenticated Axios

  useEffect(() => {
    axiosInstance
      .get('/api/v1/products/best_seller/')
      .then((response) => {
        setSeller(response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching best sellers:', error);
      });
  }, [axiosInstance]);

  const renderProduct = () => {
    if (!Array.isArray(seller)) return [];

    return seller.map((sell) => (
      <div key={sell.id} className="col-md-4 col-lg-3 col-sm-4 col-xs-12">
        <div className="category">
          <div className="ht__cat__thumb">
            <img src={sell.image} alt={sell.name} style={{ width: '90%' }} />
          </div>
          <div className="fr__hover__info"></div>
          <div className="fr__product__inner">
            <h4><a href="#">{sell.name}</a></h4>
            <ul className="fr__pro__prize">
              <li className="old__prize" style={{ textDecoration: 'line-through' }}>
                {sell.old_price}
              </li>
              <li>${sell.price}</li>
            </ul>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <section className="ftr__product__area ptb--100">
      <div className="container">
        <div className="row">
          <div className="col-xs-12">
            <div className="section__title--2 text-center">
              <h2 className="title__line">Best Seller</h2>
              <p>
                "Customer favorites - our best sellers! Discover top-rated products for an exceptional shopping experience."
              </p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="product__wrap clearfix">{renderProduct()}</div>
        </div>
      </div>
    </section>
  );
}

export default BestSeller;
