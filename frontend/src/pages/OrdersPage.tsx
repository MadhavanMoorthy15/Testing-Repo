import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders } from '../services/api';
import { Order } from '../types';
import './OrdersPage.css';

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setLoading(false);
    }
  };

  const getStatusClass = (status: string) => {
    return `status-${status}`;
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="orders-page">
        <div className="empty-orders">
          <h2>No orders yet</h2>
          <button onClick={() => navigate('/')} className="start-shopping-btn">
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h1>My Orders</h1>
      
      <div className="orders-list">
        {orders.map(order => (
          <div 
            key={order.id} 
            className="order-card"
            onClick={() => navigate(`/orders/${order.id}`)}
          >
            <div className="order-header">
              <div className="order-id">Order #{order.id.substring(0, 8)}</div>
              <div className={`order-status ${getStatusClass(order.status)}`}>
                {order.status}
              </div>
            </div>
            
            <div className="order-details">
              <div className="order-info">
                <span>Date: {new Date(order.createdAt).toLocaleDateString()}</span>
                <span>Items: {order.items.length}</span>
                <span>Total: ${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="order-items-preview">
              {order.items.slice(0, 3).map((item, index) => (
                <span key={index} className="item-preview">
                  {item.productName} x{item.quantity}
                </span>
              ))}
              {order.items.length > 3 && (
                <span className="more-items">+{order.items.length - 3} more</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
