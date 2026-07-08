import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiPackage, FiCheck, FiTruck, FiClock, FiX, FiEye } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import { toast } from 'react-toastify';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getUserOrders(user.id);
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'PENDING': { bg: 'warning', icon: <FiClock className="me-1" /> },
      'CONFIRMED': { bg: 'info', icon: <FiCheck className="me-1" /> },
      'SHIPPED': { bg: 'primary', icon: <FiTruck className="me-1" /> },
      'DELIVERED': { bg: 'success', icon: <FiCheck className="me-1" /> },
      'CANCELLED': { bg: 'danger', icon: <FiX className="me-1" /> }
    };
    const config = statusConfig[status] || statusConfig['PENDING'];
    return (
      <Badge bg={config.bg} className="order-status-badge">
        {config.icon} {status}
      </Badge>
    );
  };

  const displayOrders = orders;

  if (!user) {
    return (
      <Container className="py-5 text-center">
        <FiPackage size={64} className="text-muted mb-3" />
        <h3>Please login to view your orders</h3>
        <Button as={Link} to="/login" className="btn-primary-custom mt-3">
          Sign In
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1 className="page-title mb-4">My Orders</h1>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : displayOrders.length === 0 ? (
        <div className="text-center py-5">
          <FiPackage size={64} className="text-muted mb-3" />
          <h3>No orders yet</h3>
          <p className="text-muted">Start shopping to place your first order</p>
          <Button as={Link} to="/products" className="btn-primary-custom mt-3">
            Browse Products
          </Button>
        </div>
      ) : (
        <div className="orders-list">
          {displayOrders.map(order => (
            <Card key={order.id} className="order-card mb-3">
              <Card.Header className="order-header">
                <div className="d-flex flex-wrap justify-content-between align-items-center">
                  <div>
                    <span className="order-number">{order.orderNumber}</span>
                    <span className="order-date ms-3">
                      {new Date(order.createdAt).toLocaleDateString('en-LK', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="mt-2 mt-sm-0">
                    {getStatusBadge(order.status)}
                  </div>
                </div>
              </Card.Header>
              <Card.Body>
                {order.orderItems?.map((item, idx) => (
                  <div key={idx} className="order-item-row">
                    <img src={item.product?.mainImage} alt="" className="order-item-img" />
                    <div className="order-item-details">
                      <h6 className="mb-1">{item.product?.name}</h6>
                      <small className="text-muted">
                        Size: {item.size} | Qty: {item.quantity}
                      </small>
                    </div>
                    <span className="order-item-price">
                      LKR {item.totalPrice?.toLocaleString()}
                    </span>
                  </div>
                ))}
                <div className="order-footer mt-3 pt-3 border-top">
                  <div className="d-flex justify-content-between align-items-center flex-wrap">
                    <div>
                      <small className="text-muted">
                        Payment: {order.paymentMethod === 'CASH_ON_DELIVERY' ? 'Cash on Delivery' : 'Card'} | 
                        {' '}Status: {order.paymentStatus}
                      </small>
                    </div>
                    <div className="order-total">
                      Total: <strong>LKR {order.finalAmount?.toLocaleString()}</strong>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
};

export default Orders;
