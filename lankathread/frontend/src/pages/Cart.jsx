import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Table, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight, FiHeart } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { cartAPI } from '../services/api';
import { toast } from 'react-toastify';

const Cart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCartItems();
    } else {
      setLoading(false);
      // Load from localStorage for guest
      const guestCart = JSON.parse(localStorage.getItem('guestCart') || '[]');
      setCartItems(guestCart);
    }
  }, [user]);

  const fetchCartItems = async () => {
    try {
      const response = await cartAPI.getItems(user.id);
      if (response.data.success) {
        setCartItems(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQty) => {
    if (newQty < 1) return;
    if (user) {
      try {
        await cartAPI.updateItem(user.id, itemId, newQty);
        fetchCartItems();
      } catch (error) {
        toast.error('Failed to update quantity');
      }
    } else {
      const updated = cartItems.map(item => 
        item.id === itemId ? { ...item, quantity: newQty } : item
      );
      setCartItems(updated);
      localStorage.setItem('guestCart', JSON.stringify(updated));
    }
  };

  const removeItem = async (itemId) => {
    if (user) {
      try {
        await cartAPI.removeItem(user.id, itemId);
        fetchCartItems();
        toast.success('Item removed');
      } catch (error) {
        toast.error('Failed to remove item');
      }
    } else {
      const updated = cartItems.filter(item => item.id !== itemId);
      setCartItems(updated);
      localStorage.setItem('guestCart', JSON.stringify(updated));
      toast.success('Item removed');
    }
  };

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product?.salePrice || item.product?.price || 0;
    return sum + (price * item.quantity);
  }, 0);

  const shipping = subtotal > 5000 ? 0 : 350;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4 cart-page">
      <h1 className="page-title mb-4">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="empty-cart text-center py-5">
          <FiShoppingBag size={64} className="text-muted mb-3" />
          <h3>Your cart is empty</h3>
          <p className="text-muted">Looks like you haven't added any items yet</p>
          <Button as={Link} to="/products" className="btn-primary-custom mt-3">
            Start Shopping <FiArrowRight className="ms-2" />
          </Button>
        </div>
      ) : (
        <Row>
          <Col lg={8}>
            <div className="cart-items">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <Row className="align-items-center">
                    <Col xs={3} md={2}>
                      <Link to={`/products/${item.product?.slug}`}>
                        <img 
                          src={item.product?.mainImage} 
                          alt={item.product?.name} 
                          className="cart-item-img"
                        />
                      </Link>
                    </Col>
                    <Col xs={9} md={4}>
                      <Link to={`/products/${item.product?.slug}`} className="cart-item-name">
                        {item.product?.name}
                      </Link>
                      <p className="cart-item-variant text-muted mb-0">
                        {item.size && `Size: ${item.size}`} 
                        {item.color && ` | Color: ${item.color}`}
                      </p>
                      <p className="cart-item-brand text-muted small mb-0">{item.product?.brand}</p>
                    </Col>
                    <Col xs={6} md={3} className="mt-2 mt-md-0">
                      <div className="quantity-control">
                        <button 
                          className="qty-btn-sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <FiMinus size={14} />
                        </button>
                        <span className="qty-display">{item.quantity}</span>
                        <button 
                          className="qty-btn-sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <FiPlus size={14} />
                        </button>
                      </div>
                    </Col>
                    <Col xs={4} md={2} className="text-end mt-2 mt-md-0">
                      <span className="cart-item-price">
                        LKR {((item.product?.salePrice || item.product?.price) * item.quantity).toLocaleString()}
                      </span>
                    </Col>
                    <Col xs={2} md={1} className="text-end">
                      <Button 
                        variant="link" 
                        className="text-danger p-0"
                        onClick={() => removeItem(item.id)}
                      >
                        <FiTrash2 size={18} />
                      </Button>
                    </Col>
                  </Row>
                </div>
              ))}
            </div>

            <div className="cart-actions mt-3">
              <Button as={Link} to="/products" variant="outline-dark">
                Continue Shopping
              </Button>
              <Button 
                variant="link" 
                className="text-danger"
                onClick={() => {
                  setCartItems([]);
                  if (user) {
                    cartAPI.clear(user.id);
                  } else {
                    localStorage.removeItem('guestCart');
                  }
                }}
              >
                <FiTrash2 className="me-1" /> Clear Cart
              </Button>
            </div>
          </Col>

          <Col lg={4}>
            <div className="cart-summary">
              <h4 className="summary-title">Order Summary</h4>
              
              <div className="summary-row">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>LKR {subtotal.toLocaleString()}</span>
              </div>
              
              <div className="summary-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `LKR ${shipping.toLocaleString()}`}</span>
              </div>
              
              {shipping === 0 && (
                <div className="free-shipping-msg">
                  <FiHeart className="me-1" /> You got free shipping!
                </div>
              )}
              
              <div className="summary-divider"></div>
              
              <div className="summary-row total">
                <span>Total</span>
                <span>LKR {total.toLocaleString()}</span>
              </div>

              <Button 
                className="btn-checkout w-100 mt-3"
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
              </Button>

              <div className="payment-icons mt-3 text-center">
                <span className="payment-badge-sm">Cash on Delivery</span>
                <span className="payment-badge-sm">Visa</span>
                <span className="payment-badge-sm">Mastercard</span>
              </div>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Cart;
