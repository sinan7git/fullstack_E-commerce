import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useRoleAccess from './useRoleAccess';
import './MobileMenu.css';

const MobileMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isCustomer = useRoleAccess(['CUSTOMER']);
  const isSeller = useRoleAccess(['SELLER']);
  const isAdmin = useRoleAccess(['ADMIN']);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="xysa">
      <button style={{ marginLeft: '94px',marginTop:'15px' }} className="xysa-toggle-button" onClick={toggleMenu}>
        <i className="fas fa-bars xysa-icon"></i>
      </button>
      {isMenuOpen && (
        <div className="xysa-Heyn">
          <ul className="xysa-mwv" style={{fontWeight:'bolder', fontFamily:""}}>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/products/">Products</Link>
            </li>
              {(isCustomer || isAdmin) && (
                  <>
            <li className="xysa-dropdown">
              <span>Men <i className="fas fa-chevron-down"></i></span>
              <ul className="xysa-dropdown-content">
              <ul class="mega__item">
                            <li>
                              <Link to="/tshirt/">T-Shirts</Link>
                            </li>
                            <li>
                              <Link to="/shirt/">Shirts</Link>
                            </li>
                            <li>
                              <Link to="/pants/">Pants</Link>
                            </li>
                            <li>
                              <Link to="/jeans/">Jeans</Link>
                            </li>
                          </ul>
                          <li>
                          <a class="mega__title" to="product-grid.html">
                          Shoes
                          </a>
                          <ul class="mega__item">
                            <li>
                              <Link to="/dressShoe/">Dress Shoes</Link>
                            </li>
                            <li>
                              <Link to="/casualShoe/">Casual Shoes
</Link>
                            </li>
                            <li>
                              <Link to="/sneakerMen/">Sneakers</Link>
                            </li>
                            <li>
                              <Link to="/boots/">Boots</Link>
                            </li>
                          </ul>
                        </li>
                        <li>
                          <a class="mega__title" to="product-grid.html">
                          Accessories
                          </a>
                          <ul class="mega__item">
                            <li>
                              <Link to="/watches/">Watches</Link>
                            </li>
                            <li>
                              <Link to="/wallets/">Wallets</Link>
                            </li>
                            <li>
                              <Link to="/belts/">Belts</Link>
                            </li>
                            <li>
                              <Link to="/hats/">Hats</Link>
                            </li>
                          </ul>
                        </li>
              </ul>
            </li>
            <li className="xysa-dropdown">
              <span>Women <i className="fas fa-chevron-down"></i></span>
              <ul className="xysa-dropdown-content">
              <li>
                              <Link to="/dress/"> Dresses</Link>
                            </li>
                            <li>
                              <Link to="/tops/">Tops</Link>
                            </li>
                            <li>
                              <Link to="/outer/">Outerwear</Link>
                            </li>
                            <li>
                              <Link to="/active/">Activewear</Link>
                            </li>
                            <li>
                          <a class="mega__title" to="product-grid.html">
                          Shoes
                          </a>
                          <ul class="mega__item">
                            <li>
                              <Link to="/heels/">Heels</Link>
                            </li>
                            <li>
                              <Link to="/sneakers/">Sneakers</Link>
                            </li>
                            <li>
                              <Link to="/bootsW/">Boots</Link>
                            </li>
                            <li>
                              <Link to="/sandals/">Sandals</Link>
                            </li>
                          </ul>
                        </li>
                        <li>
                          <a class="mega__title" to="product-grid.html">
                          Accessories
                          </a>
                          <ul class="mega__item">
                            <li>
                              <Link to="/handbag/">Handbags</Link>
                            </li>
                            <li>
                              <Link to="/jewel/">Jewelry</Link>
                            </li>
                            <li>
                              <Link to="/hatW/">Hats</Link>
                            </li>
                            <li>
                              <Link to="/scarves/">Scarves</Link>
                            </li>
                          </ul>
                        </li>
              </ul>
            </li>
                  </>
                  )}
              {isSeller && (
          <li className="xysa-dropdown">
            <span>Seller Dashboard <i className="fas fa-chevron-down"></i></span>
            <ul className="xysa-dropdown-content">
              <li><Link to="/seller/products">My Products</Link></li>
              <li><Link to="/seller/orders">Orders</Link></li>
              <li><Link to="/seller/analytics">Analytics</Link></li>
            </ul>
          </li>
        )}
              {isAdmin && (
          <li className="xysa-dropdown">
            <span>Admin Panel <i className="fas fa-chevron-down"></i></span>
            <ul className="xysa-dropdown-content">
              <li><Link to="/admin/users">Manage Users</Link></li>
              <li><Link to="/admin/products">All Products</Link></li>
              <li><Link to="/admin/orders">All Orders</Link></li>
              <li><Link to="/admin/categories">Categories</Link></li>
            </ul>
          </li>
        )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
