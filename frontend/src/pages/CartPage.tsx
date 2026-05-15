import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './CartPage.css';

const CartPage: React.FC = () => {
  const { cart, updateCartItem, removeFromCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItem(productId, newQuantity);
    } catch (error) {
      alert('Failed to update cart');
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      await removeFromCart(productId);
    } catch (error) {
      alert('Failed to remove item');
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <button onClick={() => navigate('/')} className="continue-shopping-btn">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>
      
      <div className="cart-container">
        <div className="cart-items">
          {cart.map(item => (
            <div key={item.productId} className="cart-item">
              <img src={item.product?.imageUrl} alt={item.product?.name} />
              <div className="cart-item-info">
                <h3>{item.product?.name}</h3>
                <p className="cart-item-price">${item.product?.price.toFixed(2)}</p>
              </div>
              <div className="cart-item-quantity">
                <button onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}>
                  -
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}>
                  +
                </button>
              </div>
              <div className="cart-item-total">
                ${((item.product?.price || 0) * item.quantity).toFixed(2)}
              </div>
              <button 
                onClick={() => handleRemove(item.productId)}
                className="remove-btn"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>${getCartTotal().toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping:</span>
            <span>$10.00</span>
          </div>
          <div className="summary-row total">
            <span>Total:</span>
            <span>${(getCartTotal() + 10).toFixed(2)}</span>
          </div>
          <button onClick={handleCheckout} className="checkout-btn">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
