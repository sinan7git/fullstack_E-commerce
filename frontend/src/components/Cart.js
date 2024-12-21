import React, { useEffect, useState } from "react";
import "./includes/Header.css";
import useAxios from "./useAxios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./includes/Header";
import { Link } from "react-router-dom";


function Cart() {
  const [cart, setCart] = useState([]); // Initialize cart as an empty array
  const axiosInstance = useAxios();
  const [cartTotal, setCartTotal] = useState(0);
  const [tax, setTax] = useState(9);

  // Fetch cart items
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axiosInstance.get("/api/v1/products/cart/");
        setCart(response.data.cart_items || []); // Ensure it sets an array
      } catch (error) {
        console.log(error);
      }
    };

    fetchCart();
  }, [axiosInstance]);

  // Handle deleting an item from the cart
  const handleDeleteCartItem = (itemId) => {
    axiosInstance
      .post(`http://127.0.0.1:8001/api/v1/products/dele_cart/${itemId}`, {})
      .then(() => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
        toast.success("Item removed from cart successfully!");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handlePlaceOrder = async () => {
    try {
      const response = await axiosInstance.post("/api/v1/products/place_order/");
      toast.success("Order placed successfully!");
      // Clear cart in frontend after placing order
      setCart([]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to place order.");
    }
  };

  // Calculate cart total
  useEffect(() => {
    const calculateCartTotal = () => {
      if (Array.isArray(cart) && cart.length > 0) {
        const total = cart.reduce((acc, item) => acc + item.price, 0);
        setCartTotal(total);
      } else {
        setCartTotal(0);
      }
    };

    calculateCartTotal();
  }, [cart]);

  // Safely calculate total order including tax
  const totalOrder = (Array.isArray(cart) ? cart.reduce((acc, item) => acc + item.price, 0) : 0) + tax;


  return (
    <>
      <Header />
      <div
        className="cart-main-area ptb--100 bg__white"
        style={{ marginBottom: "40px", marginTop: "-40px" }}
      >
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-sm-12 col-xs-12">
              <form action="#">
                <div className="table-content table-responsive">
                  <table>
                    <thead>
                      <tr>
                        <th className="product-thumbnail">Products</th>
                        <th className="product-name">Name of Products</th>
                        <th className="product-price">Price</th>
                        <th className="product-remove">Remove</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map((item) => (
                        <tr key={item.id}>
                          <td className="product-thumbnail">
                            <a href="#">
                              <img src={item.image} style={{ width: "50px" }} alt="product img" />
                            </a>
                          </td>
                          <td className="product-name">
                            <a href="#">{item.name}</a>
                          </td>
                          <td className="product-price">
                            <span className="amount">${item.price.toFixed(2)}</span>
                          </td>
                          <td className="product-remove">
                            <Link onClick={() => handleDeleteCartItem(item.id)}>
                              <i className="fas fa-trash icons"></i>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="row">
                  <div className="col-md-12 col-sm-12 col-xs-12">
                    <div className="buttons-cart--inner">
                      <div className="buttons-cart">
                        <a href="#">Continue Shopping</a>
                      </div>
                      <div className="buttons-cart checkout--btn">
                        <a href="#">Update</a>
                        <a onClick={handlePlaceOrder} className="btn btn-primary">
  Place Order
</a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 col-sm-12 col-xs-12">
                    <div className="ht__coupon__code">
                      <span>Enter Your Discount Code</span>
                      <div className="coupon__box">
                        <input type="text" placeholder="Discount Code" />
                        <div className="ht__cp__btn">
                          <a href="#">Enter</a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-sm-12 col-xs-12 smt-40 xmt-40">
                    <div className="htc__cart__total">
                      <h6>Cart Total</h6>
                      <div className="cart__desk__list">
                        <ul className="cart__desc">
                          <li>Cart Total</li>
                          <li>Tax</li>
                          <li>Shipping</li>
                        </ul>
                        <ul className="cart__price">
                          <li>${cartTotal.toFixed(2)}</li>
                          <li>${tax.toFixed(2)}</li>
                          <li>$0</li>
                        </ul>
                      </div>
                      <div className="cart__total">
                        <span>Order Total</span>
                        <span>${totalOrder.toFixed(2)}</span>
                      </div>
                      <ul className="payment__btn">
                        <li className="active">
                          <a href="#">Payment</a>
                        </li>
                        <li>
                          <a href="#">Continue Shopping</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default Cart;
