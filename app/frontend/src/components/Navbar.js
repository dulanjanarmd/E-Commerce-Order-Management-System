import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Badge, Form, Button, Dropdown } from 'react-bootstrap';
import { FiShoppingCart, FiHeart, FiUser, FiSearch, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { productAPI } from '../services/api';

const AppNavbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setExpanded(false);
  }, [location]);

  useEffect(() => {
    if (user) {
      setCartCount(2); // Mock cart count - would be fetched from API
    }
  }, [user]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  const handleSearchInput = async (value) => {
    setSearchQuery(value);
    if (value.length > 2) {
      try {
        const response = await productAPI.search(value);
        if (response.data.success) {
          setSearchResults(response.data.data.slice(0, 5));
        }
      } catch (error) {
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  return (
    <>
      <Navbar expand="lg" className="navbar-custom sticky-top" expanded={expanded}>
        <Container>
          <Navbar.Brand as={Link} to="/" className="brand-logo">
            <span className="brand-lanka">Lanka</span>
            <span className="brand-thread">Thread</span>
          </Navbar.Brand>

          <div className="d-flex align-items-center d-lg-none">
            <Button variant="link" className="nav-icon-btn me-2" onClick={() => setShowSearch(!showSearch)}>
              <FiSearch size={20} />
            </Button>
            <Button variant="link" className="nav-icon-btn me-2" as={Link} to="/cart">
              <FiShoppingCart size={20} />
              {cartCount > 0 && <span className="cart-badge-mobile">{cartCount}</span>}
            </Button>
            <Navbar.Toggle aria-controls="main-nav" onClick={() => setExpanded(!expanded)}>
              {expanded ? <FiX size={22} /> : <FiMenu size={22} />}
            </Navbar.Toggle>
          </div>

          <Navbar.Collapse id="main-nav">
            <Nav className="mx-auto">
              <Nav.Link as={Link} to="/" className="nav-link-custom">Home</Nav.Link>
              <Nav.Link as={Link} to="/products?gender=WOMEN" className="nav-link-custom">Women</Nav.Link>
              <Nav.Link as={Link} to="/products?gender=MEN" className="nav-link-custom">Men</Nav.Link>
              <Nav.Link as={Link} to="/products?gender=KIDS" className="nav-link-custom">Kids</Nav.Link>
              <Nav.Link as={Link} to="/products?gender=TEENS" className="nav-link-custom">Teens</Nav.Link>
              <Nav.Link as={Link} to="/products?newArrivals=true" className="nav-link-custom text-gold">New Arrivals</Nav.Link>
            </Nav>

            <div className="d-flex align-items-center">
              <Form className="d-none d-lg-flex search-form me-3" onSubmit={handleSearch}>
                <div className="search-wrapper">
                  <Form.Control
                    type="search"
                    placeholder="Search products..."
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => handleSearchInput(e.target.value)}
                  />
                  <Button type="submit" className="search-btn">
                    <FiSearch size={16} />
                  </Button>
                  {searchResults.length > 0 && (
                    <div className="search-suggestions">
                      {searchResults.map(product => (
                        <div 
                          key={product.id} 
                          className="search-suggestion-item"
                          onClick={() => {
                            navigate(`/products/${product.slug}`);
                            setSearchResults([]);
                            setSearchQuery('');
                          }}
                        >
                          <img src={product.mainImage || '/images/placeholder.jpg'} alt={product.name} className="suggestion-img" />
                          <div>
                            <div className="suggestion-name">{product.name}</div>
                            <div className="suggestion-price">LKR {product.price?.toLocaleString()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Form>

              <Button variant="link" className="nav-icon-btn d-none d-lg-block me-2" as={Link} to="/wishlist">
                <FiHeart size={20} />
              </Button>

              <Button variant="link" className="nav-icon-btn d-none d-lg-block me-2 position-relative" as={Link} to="/cart">
                <FiShoppingCart size={20} />
                {cartCount > 0 && (
                  <Badge bg="danger" className="cart-badge">{cartCount}</Badge>
                )}
              </Button>

              {user ? (
                <Dropdown align="end">
                  <Dropdown.Toggle variant="link" className="nav-icon-btn user-dropdown">
                    <FiUser size={20} />
                    <span className="d-none d-lg-inline ms-1">{user.fullName?.split(' ')[0]}</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="dropdown-menu-custom">
                    <Dropdown.Item as={Link} to="/profile">My Profile</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/orders">My Orders</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/wishlist">Wishlist</Dropdown.Item>
                    {isAdmin() && (
                      <Dropdown.Item as={Link} to="/admin">Admin Dashboard</Dropdown.Item>
                    )}
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <Button variant="outline-gold" className="btn-login" as={Link} to="/login">
                  Sign In
                </Button>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {showSearch && (
        <div className="mobile-search-bar d-lg-none">
          <Container>
            <Form onSubmit={handleSearch}>
              <div className="search-wrapper">
                <Form.Control
                  type="search"
                  placeholder="Search products..."
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  autoFocus
                />
                <Button type="submit" className="search-btn">
                  <FiSearch size={16} />
                </Button>
              </div>
              {searchResults.length > 0 && (
                <div className="search-suggestions-mobile">
                  {searchResults.map(product => (
                    <div 
                      key={product.id} 
                      className="search-suggestion-item"
                      onClick={() => {
                        navigate(`/products/${product.slug}`);
                        setShowSearch(false);
                        setSearchResults([]);
                        setSearchQuery('');
                      }}
                    >
                      <span>{product.name}</span>
                      <span className="suggestion-price">LKR {product.price?.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </Form>
          </Container>
        </div>
      )}
    </>
  );
};

export default AppNavbar;
