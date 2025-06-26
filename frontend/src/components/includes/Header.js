import React from 'react'
import { IoIosSearch, IoIosPerson, IoIosCart } from "react-icons/io";
import '../includes/Header.css'
import MobileMenu from "../MobileMenu";
import { useState, useContext, useEffect } from "react";
import img1 from '../images/bg/pngtree-e-commerce-logo-template-png-image_5066821-removebg-preview (1).png'
import { Link, useNavigate } from 'react-router-dom';
import useRoleAccess from '../useRoleAccess'
import { UserContext } from '../../App';
import useAxios from '../useAxios';

function Header() {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { userData, updateUserData } = useContext(UserContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const isCustomer = useRoleAccess(['CUSTOMER']);
  const isSeller = useRoleAccess(['SELLER']);
  const isAdmin = useRoleAccess(['ADMIN']);
  const [cartCount, setCartCount] = useState(0);
  const axiosInstance = useAxios();

  useEffect(() => {
    if (userData) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [userData]);

  const handleLogout = () => {
    updateUserData({ type: 'LOGOUT' });
  };

  const handleSearchClick = () => {
    setIsSearchOpen((prev) => !prev);
  };

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const response = await axiosInstance.get('/api/v1/products/cart/count/');
        setCartCount(response.data.cart_count);
      } catch (error) {
        console.error('Failed to fetch cart count:', error);
      }
    };

    fetchCartCount();
  }, [axiosInstance]);

  return (
    <header className="modern-header">
      <style jsx>{`
        .modern-header {
          background: linear-gradient(135deg, #ffffff 0%, #ffffff 100%);
          backdrop-filter: blur(20px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 1000;
          transition: all 0.3s ease;
        }

        .modern-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          z-index: -1;
        }

        .header-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 80px;
          position: relative;
        }

        .logo-section {
          flex: 0 0 auto;
          z-index: 10;
        }

        .logo-section img {
          height: 100px;
          width: 100px;
          filter: brightness(1.2) contrast(1.1);
          transition: transform 0.3s ease;
        }

        .logo-section img:hover {
          transform: scale(1.05);
        }

        .nav-section {
          flex: 1;
          display: flex;
          justify-content: center;
          position: relative;
        }

        .main-nav {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
          gap: 40px;
          align-items: center;
        }

        .nav-item {
          position: relative;
        }

        .nav-link {
          color: #000000;
          text-decoration: none;
          font-weight: 600;
          font-size: 16px;
          padding: 12px 20px;
          border-radius: 25px;
          transition: all 0.3s ease;
          text-transform: capitalize;
          position: relative;
          overflow: hidden;
        }

        .nav-link::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .nav-link:hover::before {
          left: 100%;
        }

        .nav-link:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .dropdown {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 15px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          min-width: 800px;
          padding: 30px;
          margin-top: 10px;
        }

        .nav-item:hover .dropdown {
          opacity: 1;
          visibility: visible;
          transform: translateX(-50%) translateY(0);
        }

        .mega-dropdown {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }

        .mega-section {
          text-align: left;
        }

        .mega-title {
          font-size: 18px;
          font-weight: 700;
          color: #333;
          margin-bottom: 15px;
          display: block;
          padding-bottom: 10px;
          border-bottom: 2px solid #667eea;
        }

        .mega-items {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .mega-items li {
          margin-bottom: 8px;
        }

        .mega-items a {
          color: #666;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
          display: block;
          padding: 8px 12px;
          border-radius: 8px;
        }

        .mega-items a:hover {
          color: #667eea;
          background: rgba(102, 126, 234, 0.1);
          transform: translateX(5px);
        }

        .simple-dropdown {
          min-width: 200px;
          padding: 20px 0;
        }

        .simple-dropdown a {
          display: block;
          padding: 12px 25px;
          color: #333;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .simple-dropdown a:hover {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          transform: translateX(10px);
        }

        .actions-section {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .search-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-input {
          width: ${isSearchOpen ? '300px' : '0'};
          height: 45px;
          border: none;
          border-radius: 25px;
          padding: 0 20px;
          font-size: 16px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          transition: all 0.4s ease;
          opacity: ${isSearchOpen ? '1' : '0'};
          transform: translateX(${isSearchOpen ? '0' : '20px'});
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .search-input:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
        }

        .action-btn {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: rgba(0, 0, 0, 0.9);
          font-size: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .action-btn::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          transition: all 0.3s ease;
          transform: translate(-50%, -50%);
        }

        .action-btn:hover::before {
          width: 100%;
          height: 100%;
        }

        .action-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
          background: rgba(255, 255, 255, 0.3);
        }

        .cart-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #ff4757;
          color: white;
          border-radius: 50%;
          width: 22px;
          height: 22px;
          font-size: 12px;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }

        .mobile-menu {
          display: none;
        }

        @media (max-width: 768px) {
          .nav-section {
            display: none;
          }

          .mobile-menu {
            display: block;
            margin-left: 20px;
          }

          .main-nav {
            display: none;
          }

          .header-content {
            min-height: 70px;
          }

          .actions-section {
            gap: 10px;
          }

          .action-btn {
            width: 45px;
            height: 45px;
            font-size: 18px;
          }

          .search-input {
            width: ${isSearchOpen ? '200px' : '0'};
          }
        }

        @media (max-width: 480px) {
          .header-container {
            padding: 0 15px;
          }

          .search-input {
            width: ${isSearchOpen ? '150px' : '0'};
          }
        }
      `}</style>

      <div className="header-container">
        <div className="header-content">
          <div className="logo-section">
            <Link to="/">
              <img src={img1} alt="Logo" />
            </Link>
          </div>

          <div className="nav-section">
            <nav>
              <ul className="main-nav">
                {isCustomer && (
                  <>
                    <li className="nav-item">
                      <Link to="" className="nav-link">Home</Link>
                    </li>
                    <li className="nav-item">
                      <Link to="#" className="nav-link">Women</Link>
                      <div className="dropdown">
                        <div className="mega-dropdown">
                          <div className="mega-section">
                            <span className="mega-title">Clothing</span>
                            <ul className="mega-items">
                              <li><Link to="/dress/">Dresses</Link></li>
                              <li><Link to="/tops/">Tops</Link></li>
                              <li><Link to="/outer/">Outerwear</Link></li>
                              <li><Link to="/active/">Activewear</Link></li>
                            </ul>
                          </div>
                          <div className="mega-section">
                            <span className="mega-title">Shoes</span>
                            <ul className="mega-items">
                              <li><Link to="/heels/">Heels</Link></li>
                              <li><Link to="/sneakers/">Sneakers</Link></li>
                              <li><Link to="/bootsW/">Boots</Link></li>
                              <li><Link to="/sandals/">Sandals</Link></li>
                            </ul>
                          </div>
                          <div className="mega-section">
                            <span className="mega-title">Accessories</span>
                            <ul className="mega-items">
                              <li><Link to="/handbag/">Handbags</Link></li>
                              <li><Link to="/jewel/">Jewelry</Link></li>
                              <li><Link to="/hatW/">Hats</Link></li>
                              <li><Link to="/scarves/">Scarves</Link></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="nav-item">
                      <Link to="#" className="nav-link">Men</Link>
                      <div className="dropdown">
                        <div className="mega-dropdown">
                          <div className="mega-section">
                            <span className="mega-title">Clothing</span>
                            <ul className="mega-items">
                              <li><Link to="/tshirt/">T-Shirts</Link></li>
                              <li><Link to="/shirt/">Shirts</Link></li>
                              <li><Link to="/pants/">Pants</Link></li>
                              <li><Link to="/jeans/">Jeans</Link></li>
                            </ul>
                          </div>
                          <div className="mega-section">
                            <span className="mega-title">Shoes</span>
                            <ul className="mega-items">
                              <li><Link to="/dressShoe/">Dress Shoes</Link></li>
                              <li><Link to="/casualShoe/">Casual Shoes</Link></li>
                              <li><Link to="/sneakerMen/">Sneakers</Link></li>
                              <li><Link to="/boots/">Boots</Link></li>
                            </ul>
                          </div>
                          <div className="mega-section">
                            <span className="mega-title">Accessories</span>
                            <ul className="mega-items">
                              <li><Link to="/watches/">Watches</Link></li>
                              <li><Link to="/wallets/">Wallets</Link></li>
                              <li><Link to="/belts/">Belts</Link></li>
                              <li><Link to="/hats/">Hats</Link></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="nav-item">
                      <Link to="#" className="nav-link">Pages</Link>
                      <div className="dropdown simple-dropdown">
                        <Link to="/blog/">Blog</Link>
                        <Link to="/top/">Top Rated</Link>
                        <Link to="/testimonial/">Testimonial</Link>
                        <Link to="/brand/">Brand</Link>
                        <Link to="/contact/">Contact</Link>
                      </div>
                    </li>
                    <li className="nav-item">
                      <Link to="/products/" className="nav-link">Products</Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/contact/" className="nav-link">Contact</Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/order_list/" className="nav-link">OrderList</Link>
                    </li>
                  </>
                )}
                {isSeller && (
                  <>
                    <li className="nav-item">
                      <Link to="/seller/add/" className="nav-link">Add Products</Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/seller/product/list/" className="nav-link">My Products</Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/seller/orders/" className="nav-link">Orders</Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/seller/analytics/" className="nav-link">Analytics</Link>
                    </li>
                  </>
                )}
                {isAdmin && (
                  <>
                    <li className="nav-item">
                      <Link to="/admin/users" className="nav-link">Manage Users</Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/admin/products" className="nav-link">All Products</Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/admin/orders" className="nav-link">All Orders</Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/admin/categories" className="nav-link">Categories</Link>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          </div>

          <div className="mobile-menu">
            <MobileMenu />
          </div>

          <div className="actions-section">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search items..."
                className="search-input"
              />
              <button className="action-btn" onClick={handleSearchClick}>
                <i className="fas fa-search"></i>
              </button>
            </div>

            <Link to="/profile/update/">
              <button className="action-btn">
                <i className="fas fa-user"></i>
              </button>
            </Link>

            {isLoggedIn ? (
              <>
                <button className="action-btn" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt"></i>
                </button>

                <Link to="/cart/">
                  <button className="action-btn">
                    <i className="fas fa-cart-shopping"></i>
                    {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                  </button>
                </Link>
              </>
            ) : (
              <Link to="/login/">
                <button className="action-btn">
                  <i className="fas fa-user"></i>
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;