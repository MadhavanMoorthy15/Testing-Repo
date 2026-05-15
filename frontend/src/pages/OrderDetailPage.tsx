import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrder } from '../services/api';
import { Order } from '../types';
import './OrderDetailPage.css';

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  const fetchOrder = async () => {
    try {
      const data = await getOrder(id!);
      setOrder(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch order:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading order...</div>;
  }

  if (!order) {
    return (
      <div className="order-detail-page">
        <div className="error">Order not found</div>
        <button onClick={() => navigate('/orders')} className="back-btn">
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="order-detail-page">
      <button onClick={() => navigate('/orders')} className="back-btn">
        ← Back to Orders
      </button>

      <div className="order-detail-container">
        <div className="order-header">
          <h1>Order #{order.id.substring(0, 8)}</h1>
          <div className={`order-status status-${order.status}`}>
            {order.status}
          </div>
        </div>

        <div className="order-info-grid">
          <div className="info-card">
            <h3>Order Information</h3>
            <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            <p><strong>Last Updated:</strong> {new Date(order.updatedAt).toLocaleString()}</p>
            <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
          </div>

          <div className="info-card">
            <h3>Shipping Address</h3>
            <p>{order.shippingAddress}</p>
          </div>
        </div>

        <div className="order-items">
          <h2>Order Items</h2>
          <table className="items-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.productName}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>{item.quantity}</td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="order-total">
          <div className="total-row">
            <span>Total Amount:</span>
            <span className="total-amount">${order.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
