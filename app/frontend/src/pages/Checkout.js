import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMapPin, FiPhone, FiUser, FiCreditCard, FiTruck, FiCheck, FiShield } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import { toast } from 'react-toastify';

const Checkout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { buyNow, product } = location.state || {};

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    district: '',
    postalCode: '',
    deliveryNotes: '',
    paymentMethod: 'CASH_ON_DELIVERY'
  });

  // Mock cart items for checkout display
  const cartItems = buyNow && product 
    ? [{ id: 1, product, quantity: product.quantity || 1, size: product.selectedSize, color: product.selectedColor }]
    : JSON.parse(localStorage.getItem('guestCart') || '[]');

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product?.salePrice || item.product?.price || 0;
    return sum + (price * (item.quantity || 1));
  }, 0);
  
  const shipping = subtotal > 5000 ? 0 : 350;
  const total = subtotal + shipping;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.phone || !formData.address || !formData.city) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const orderRequest = {
        items: cartItems.map(item => ({
          productId: item.product?.id,
          quantity: item.quantity || 1,
          size: item.size || '',
          color: item.color || '',
          unitPrice: item.product?.salePrice || item.product?.price
        })),
        paymentMethod: formData.paymentMethod,
        shippingName: formData.fullName,
        shippingPhone: formData.phone,
        shippingAddress: formData.address,
        shippingCity: formData.city,
        shippingDistrict: formData.district,
        shippingPostalCode: formData.postalCode,
        deliveryNotes: formData.deliveryNotes,
        totalAmount: subtotal,
        shippingCost: shipping,
        finalAmount: total
      };

      if (user) {
        const response = await orderAPI.create(user.id, orderRequest);
        if (response.data.success) {
          setOrderNumber(response.data.data.orderNumber);
          setOrderPlaced(true);
          localStorage.removeItem('guestCart');
        }
      } else {
        // Guest checkout - redirect to login
        toast.info('Please login to complete your order');
        navigate('/login', { state: { from: '/checkout' } });
        return;
      }
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <Container className="py-5">
        <div className="order-success text-center">
          <div className="success-icon">
            <FiCheck size={64} />
          </div>
          <h2 className="mt-4">Order Placed Successfully!</h2>
          <p className="text-muted">Thank you for shopping with LankaThread</p>
          <div className="order-details-box mt-4">
            <p><strong>Order Number:</strong> <span className="order-number">{orderNumber}</span></p>
            <p><strong>Payment Method:</strong> {formData.paymentMethod === 'CASH_ON_DELIVERY' ? 'Cash on Delivery' : 'Card Payment'}</p>
            <p><strong>Total Amount:</strong> LKR {total.toLocaleString()}</p>
          </div>
          {formData.paymentMethod === 'CASH_ON_DELIVERY' && (
            <div className="cod-info mt-3">
              <FiTruck className="me-2" />
              Please keep LKR {total.toLocaleString()} ready at delivery
            </div>
          )}
          <Button as={Link} to="/orders" className="btn-primary-custom mt-4 me-2">
            View My Orders
          </Button>
          <Button as={Link} to="/" variant="outline-dark" className="mt-4">
            Continue Shopping
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4 checkout-page">
      <h1 className="page-title mb-4">Checkout</h1>

      {/* Progress Steps */}
      <div className="checkout-steps mb-4">
        <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
          <div className="step-number">1</div>
          <span>Shipping</span>
        </div>
        <div className="step-line"></div>
        <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
          <div className="step-number">2</div>
          <span>Payment</span>
        </div>
        <div className="step-line"></div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <span>Confirm</span>
        </div>
      </div>

      <Row>
        <Col lg={8}>
          {step === 1 && (
            <div className="checkout-section">
              <h4 className="section-title"><FiMapPin className="me-2" />Shipping Information</h4>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Full Name *</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="fullName" 
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Phone Number *</Form.Label>
                    <Form.Control 
                      type="tel" 
                      name="phone" 
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="07X XXX XXXX"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Address *</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={2}
                      name="address" 
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Street address, house number"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>City *</Form.Label>
                    <Form.Select name="city" value={formData.city} onChange={handleChange} required>
                      <option value="">Select City</option>
                      <option value="Colombo">Colombo</option>
                      <option value="Dehiwala">Dehiwala</option>
                      <option value="Moratuwa">Moratuwa</option>
                      <option value="Negombo">Negombo</option>
                      <option value="Kandy">Kandy</option>
                      <option value="Galle">Galle</option>
                      <option value="Jaffna">Jaffna</option>
                      <option value="Anuradhapura">Anuradhapura</option>
                      <option value="Batticaloa">Batticaloa</option>
                      <option value="Trincomalee">Trincomalee</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>District</Form.Label>
                    <Form.Select name="district" value={formData.district} onChange={handleChange}>
                      <option value="">Select District</option>
                      <option value="Colombo">Colombo</option>
                      <option value="Gampaha">Gampaha</option>
                      <option value="Kalutara">Kalutara</option>
                      <option value="Kandy">Kandy</option>
                      <option value="Galle">Galle</option>
                      <option value="Jaffna">Jaffna</option>
                      <option value="Northern">Northern</option>
                      <option value="Eastern">Eastern</option>
                      <option value="Central">Central</option>
                      <option value="Southern">Southern</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Postal Code</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="postalCode" 
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="XXXXX"
                    />
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Delivery Notes (Optional)</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={2}
                      name="deliveryNotes" 
                      value={formData.deliveryNotes}
                      onChange={handleChange}
                      placeholder="Any special instructions for delivery..."
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Button className="btn-primary-custom mt-4" onClick={() => setStep(2)}>
                Continue to Payment
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="checkout-section">
              <h4 className="section-title"><FiCreditCard className="me-2" />Payment Method</h4>
              
              <div className="payment-options">
                <div 
                  className={`payment-option ${formData.paymentMethod === 'CASH_ON_DELIVERY' ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, paymentMethod: 'CASH_ON_DELIVERY' })}
                >
                  <div className="payment-radio">
                    <div className="radio-circle">
                      {formData.paymentMethod === 'CASH_ON_DELIVERY' && <div className="radio-dot"></div>}
                    </div>
                  </div>
                  <div className="payment-info">
                    <h6>Cash on Delivery (COD)</h6>
                    <p className="text-muted mb-0">Pay when your order is delivered</p>
                  </div>
                  <FiTruck size={24} className="payment-icon" />
                </div>

                <div 
                  className={`payment-option ${formData.paymentMethod === 'CREDIT_CARD' ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, paymentMethod: 'CREDIT_CARD' })}
                >
                  <div className="payment-radio">
                    <div className="radio-circle">
                      {formData.paymentMethod === 'CREDIT_CARD' && <div className="radio-dot"></div>}
                    </div>
                  </div>
                  <div className="payment-info">
                    <h6>Credit / Debit Card</h6>
                    <p className="text-muted mb-0">Visa, Mastercard accepted</p>
                  </div>
                  <FiCreditCard size={24} className="payment-icon" />
                </div>

                <div 
                  className={`payment-option ${formData.paymentMethod === 'MOBILE_WALLET' ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, paymentMethod: 'MOBILE_WALLET' })}
                >
                  <div className="payment-radio">
                    <div className="radio-circle">
                      {formData.paymentMethod === 'MOBILE_WALLET' && <div className="radio-dot"></div>}
                    </div>
                  </div>
                  <div className="payment-info">
                    <h6>Mobile Wallet</h6>
                    <p className="text-muted mb-0">Pay via your mobile wallet</p>
                  </div>
                  <FiPhone size={24} className="payment-icon" />
                </div>
              </div>

              <div className="d-flex gap-2 mt-4">
                <Button variant="outline-dark" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button className="btn-primary-custom" onClick={() => setStep(3)}>
                  Review Order
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="checkout-section">
              <h4 className="section-title"><FiCheck className="me-2" />Order Summary</h4>
              
              <div className="review-section">
                <h6>Shipping To:</h6>
                <p className="mb-1"><strong>{formData.fullName}</strong></p>
                <p className="mb-1">{formData.phone}</p>
                <p className="mb-1">{formData.address}</p>
                <p className="mb-0">{formData.city}{formData.district ? `, ${formData.district}` : ''}</p>
                <Button variant="link" className="p-0" onClick={() => setStep(1)}>Change</Button>
              </div>

              <div className="review-section">
                <h6>Payment Method:</h6>
                <p className="mb-0">
                  {formData.paymentMethod === 'CASH_ON_DELIVERY' ? 'Cash on Delivery' :
                   formData.paymentMethod === 'CREDIT_CARD' ? 'Credit/Debit Card' : 'Mobile Wallet'}
                </p>
                <Button variant="link" className="p-0" onClick={() => setStep(2)}>Change</Button>
              </div>

              <div className="review-section">
                <h6>Items:</h6>
                {cartItems.map((item, idx) => (
                  <div key={idx} className="review-item">
                    <div className="d-flex align-items-center">
                      <img src={item.product?.mainImage} alt="" className="review-item-img" />
                      <div>
                        <p className="mb-0"><strong>{item.product?.name}</strong></p>
                        <small className="text-muted">
                          Qty: {item.quantity || 1} 
                          {item.size && ` | Size: ${item.size}`}
                          {item.color && ` | Color: ${item.color}`}
                        </small>
                      </div>
                    </div>
                    <span>LKR {((item.product?.salePrice || item.product?.price) * (item.quantity || 1)).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="d-flex gap-2 mt-4">
                <Button variant="outline-dark" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button 
                  className="btn-primary-custom" 
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? 'Placing Order...' : 'Place Order'}
                </Button>
              </div>
            </div>
          )}
        </Col>

        <Col lg={4}>
          <div className="checkout-summary">
            <h5 className="summary-title">Order Summary</h5>
            {cartItems.map((item, idx) => (
              <div key={idx} className="summary-item">
                <div className="d-flex align-items-center">
                  <img src={item.product?.mainImage} alt="" className="summary-item-img" />
                  <div>
                    <p className="mb-0 small">{item.product?.name}</p>
                    <small className="text-muted">x{item.quantity || 1}</small>
                  </div>
                </div>
                <span>LKR {((item.product?.salePrice || item.product?.price) * (item.quantity || 1)).toLocaleString()}</span>
              </div>
            ))}
            <div className="summary-divider"></div>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>LKR {subtotal.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'FREE' : `LKR ${shipping.toLocaleString()}`}</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row total">
              <span>Total</span>
              <span>LKR {total.toLocaleString()}</span>
            </div>
            <div className="secure-badge mt-3">
              <FiShield className="me-1" /> Secure Checkout
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Checkout;
