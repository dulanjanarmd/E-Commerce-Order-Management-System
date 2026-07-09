import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Badge, Form, Button, Dropdown } from 'react-bootstrap';
import { FiShoppingCart, FiHeart, FiUser, FiSearch, FiMenu, FiX, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { productAPI, categoryAPI } from '../services/api';

const AppNavbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [pinnedCategories, setPinnedCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({}); // { parentId: [subcats] }
  const [hoveredCat, setHoveredCat] = useState(null);
  const hoverTimeout = useRef(null);

  useEffect(() => {
    setExpanded(false);
  }, [location]);

  useEffect(() => {
    if (user) {
      setCartCount(2); // Mock cart count
    }
  }, [user]);

  // Fetch pinned categories for navbar
  useEffect(() => {
    fetchPinnedCategories();
  }, []);

  const fetchPinnedCategories = async () => {
    try {
      const res = await categoryAPI.getPinnedCategories();
      if (res.data.success) {
        setPinnedCategories(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching pinned categories:', error);
    }
  };

  // Fetch subcategories when hovering a pinned category
  const handleCatMouseEnter = async (catId) => {
    clearTimeout(hoverTimeout.current);
    setHoveredCat(catId);
    if (!subcategories[catId]) {
      try {
        const res = await categoryAPI.getSubcategories(catId);
        if (res.data.success) {
          setSubcategories(prev => ({ ...prev, [catId]: res.data.data }));
        }
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      }
    }
  };

  const handleCatMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => setHoveredCat(null), 200);
  };

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

              {/* Dynamic pinned categories with subcategory dropdown */}
              {pinnedCategories.map(cat => (
                <div
                  key={cat.id}
                  className="nav-cat-wrapper d-none d-lg-block"
                  onMouseEnter={() => handleCatMouseEnter(cat.id)}
                  onMouseLeave={handleCatMouseLeave}
                >
                  <Nav.Link
                    as={Link}
                    to={`/products?parentCategory=${cat.id}`}
                    className="nav-link-custom"
                  >
                    {cat.name} <FiChevronDown size={12} className="ms-1" />
                  </Nav.Link>
                  {hoveredCat === cat.id && subcategories[cat.id] && subcategories[cat.id].length > 0 && (
                    <div className="nav-subcat-dropdown">
                      {subcategories[cat.id].map(sub => (
                        <Link
                          key={sub.id}
                          to={`/products?category=${sub.id}`}
                          className="nav-subcat-item"
                          onClick={() => setHoveredCat(null)}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Mobile: show pinned categories as simple links */}
              {pinnedCategories.map(cat => (
                <Nav.Link
                  key={`m-${cat.id}`}
                  as={Link}
                  to={`/products?parentCategory=${cat.id}`}
                  className="nav-link-custom d-lg-none"
                >
                  {cat.name}
                </Nav.Link>
              ))}

              {/* Mobile: show subcategories under each main cat */}
              {pinnedCategories.map(cat => (
                subcategories[cat.id]?.map(sub => (
                  <Nav.Link
                    key={`ms-${sub.id}`}
                    as={Link}
                    to={`/products?category=${sub.id}`}
                    className="nav-link-custom d-lg-none ps-4 small"
                  >
                    ↳ {sub.name}
                  </Nav.Link>
                ))
              ))}

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
