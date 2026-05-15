import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await addToCart(product.id, 1);
      alert('Added to cart!');
    } catch (error) {
      alert('Failed to add to cart');
    }
  };

  return (
    <div className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
      <img src={product.imageUrl} alt={product.name} className="product-image" />
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <div className="product-rating">⭐ {product.rating}</div>
          <div className="product-price">${product.price.toFixed(2)}</div>
        </div>
        <div className="product-stock">
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </div>
        <button 
          onClick={handleAddToCart} 
          className="add-to-cart-btn"
          disabled={product.stock === 0}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
