import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin, FiFacebook, FiInstagram, FiTwitter } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="footer-custom">
      <div className="footer-main">
        <Container>
          <Row>
            <Col lg={4} md={6} className="mb-4 mb-lg-0">
              <div className="footer-brand">
                <span className="brand-lanka">Lanka</span>
                <span className="brand-thread">Thread</span>
              </div>
              <p className="footer-about">
                Sri Lanka's premier online fashion destination. Discover the latest trends in clothing 
                for Women, Men, Kids, and Teens. Quality fashion delivered island-wide with Cash on Delivery.
              </p>
              <div className="social-links">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  <FiFacebook size={18} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  <FiInstagram size={18} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  <FiTwitter size={18} />
                </a>
              </div>
            </Col>

            <Col lg={2} md={6} className="mb-4 mb-lg-0">
              <h5 className="footer-title">Shop</h5>
              <ul className="footer-links">
                <li><Link to="/products?gender=WOMEN">Women</Link></li>
                <li><Link to="/products?gender=MEN">Men</Link></li>
                <li><Link to="/products?gender=KIDS">Kids</Link></li>
                <li><Link to="/products?gender=TEENS">Teens</Link></li>
                <li><Link to="/products?newArrivals=true">New Arrivals</Link></li>
              </ul>
            </Col>

            <Col lg={2} md={6} className="mb-4 mb-lg-0">
              <h5 className="footer-title">Help</h5>
              <ul className="footer-links">
                <li><Link to="/profile">My Account</Link></li>
                <li><Link to="/orders">Order Tracking</Link></li>
                <li><Link to="/cart">Shopping Cart</Link></li>
                <li><Link to="/wishlist">Wishlist</Link></li>
              </ul>
            </Col>

            <Col lg={4} md={6}>
              <h5 className="footer-title">Contact Us</h5>
              <ul className="footer-contact">
                <li>
                  <FiMapPin size={16} className="me-2" />
                  <span>42 Galle Road, Colombo 03, Sri Lanka</span>
                </li>
                <li>
                  <FiPhone size={16} className="me-2" />
                  <span>+94 11 234 5678</span>
                </li>
                <li>
                  <FiMail size={16} className="me-2" />
                  <span>support@lankathread.lk</span>
                </li>
              </ul>
              <div className="payment-icons mt-3">
                <span className="payment-badge">Cash on Delivery</span>
                <span className="payment-badge">Visa</span>
                <span className="payment-badge">Mastercard</span>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <div className="footer-bottom">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="text-center text-md-start">
              <p className="mb-0">&copy; 2024 LankaThread. All rights reserved.</p>
            </Col>
            <Col md={6} className="text-center text-md-end">
              <small>Designed for Sri Lanka | Prices in LKR</small>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
