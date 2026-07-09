import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShoppingBag, FiTruck, FiHeadphones, FiShield } from 'react-icons/fi';
import { productAPI, categoryAPI, promotionAPI } from '../services/api';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({}); // { parentId: [subcats] }
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [featuredRes, arrivalsRes, categoriesRes, promoRes] = await Promise.all([
        productAPI.getFeatured(),
        productAPI.getNewArrivals(),
        categoryAPI.getParentCategories(),
        promotionAPI.getActive()
      ]);

      if (featuredRes.data.success) setFeaturedProducts(featuredRes.data.data.slice(0, 8));
      if (arrivalsRes.data.success) setNewArrivals(arrivalsRes.data.data.slice(0, 8));
      if (categoriesRes.data.success) {
        const mainCats = categoriesRes.data.data;
        setCategories(mainCats);
        // Fetch subcategories for each main category
        mainCats.forEach(async (cat) => {
          try {
            const subRes = await categoryAPI.getSubcategories(cat.id);
            if (subRes.data.success) {
              setSubcategories(prev => ({ ...prev, [cat.id]: subRes.data.data }));
            }
          } catch (err) {
            console.error(`Error fetching subcategories for ${cat.name}:`, err);
          }
        });
      }
      if (promoRes.data) setPromotions(promoRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const displayFeatured = featuredProducts;
  const displayArrivals = newArrivals;

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <Container className="hero-content">
          <Row className="align-items-center min-vh-80">
            <Col lg={6} className="hero-text">
              <span className="hero-subtitle">New Collection 2024</span>
              <h1 className="hero-title">
                Discover Your
                <span className="text-gold"> Style</span>
              </h1>
              <p className="hero-description">
                Premium fashion for the entire family. From traditional elegance to modern trends, 
                find your perfect look at LankaThread. Island-wide delivery with Cash on Delivery.
              </p>
              <div className="hero-buttons">
                <Button as={Link} to="/products" className="btn-primary-custom">
                  Shop Now <FiArrowRight className="ms-2" />
                </Button>
                <Button as={Link} to="/products?newArrivals=true" variant="outline-light" className="btn-outline-custom">
                  New Arrivals
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Categories Section */}
      <section className="categories-section py-5">
        <Container>
          <div className="section-header text-center mb-5">
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Find exactly what you are looking for</p>
          </div>
          <Row className="g-4">
            {categories.map((cat, idx) => (
              <Col key={cat.id || idx} xs={6} md={3}>
                <Link to={`/products?parentCategory=${cat.id}`} className="category-card-link">
                  <div className="category-card">
                    <div className="category-img-wrapper">
                      <img src={cat.imageUrl || 'https://via.placeholder.com/400?text=No+Image'} alt={cat.name} className="category-img" />
                      <div className="category-overlay"></div>
                    </div>
                    <div className="category-info">
                      <h4 className="category-name">{cat.name}</h4>
                      <span className="category-count">Shop Now</span>
                    </div>
                  </div>
                </Link>
                {/* Show subcategories under main category */}
                {subcategories[cat.id] && subcategories[cat.id].length > 0 && (
                  <div className="mt-2 ps-2">
                    {subcategories[cat.id].map(sub => (
                      <Link
                        key={sub.id}
                        to={`/products?category=${sub.id}`}
                        className="d-block text-muted small text-decoration-none py-1 subcat-link"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Featured Products */}
      <section className="products-section py-5">
        <Container>
          <div className="section-header d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="section-title">Featured Products</h2>
              <p className="section-subtitle">Handpicked styles just for you</p>
            </div>
            <Button as={Link} to="/products" variant="link" className="view-all-link">
              View All <FiArrowRight />
            </Button>
          </div>
          <Row className="g-4">
            {displayFeatured.map(product => (
              <Col key={product.id} xs={6} md={4} lg={3}>
                <ProductCard product={product} promotions={promotions} />
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Banner Section */}
      <section className="banner-section">
        <Container>
          <div className="banner-content text-center">
            <span className="banner-subtitle">Summer Sale</span>
            <h2 className="banner-title">Up to 50% Off</h2>
            <p className="banner-text">On selected summer styles. Limited time offer!</p>
            <Button as={Link} to="/products" className="btn-primary-custom">
              Shop the Sale
            </Button>
          </div>
        </Container>
      </section>

      {/* New Arrivals */}
      <section className="products-section py-5">
        <Container>
          <div className="section-header d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="section-title">New Arrivals</h2>
              <p className="section-subtitle">The latest additions to our collection</p>
            </div>
            <Button as={Link} to="/products?newArrivals=true" variant="link" className="view-all-link">
              View All <FiArrowRight />
            </Button>
          </div>
          <Row className="g-4">
            {displayArrivals.map(product => (
              <Col key={product.id} xs={6} md={4} lg={3}>
                <ProductCard product={product} promotions={promotions} />
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section py-5">
        <Container>
          <Row className="g-4">
            {[
              { icon: <FiShoppingBag size={28} />, title: 'Island-wide Delivery', desc: 'Free delivery for orders over LKR 5,000' },
              { icon: <FiTruck size={28} />, title: 'Fast Shipping', desc: '2-5 business days delivery' },
              { icon: <FiHeadphones size={28} />, title: '24/7 Support', desc: 'WhatsApp support available' },
              { icon: <FiShield size={28} />, title: 'Secure Payments', desc: 'COD & card payments accepted' },
            ].map((feature, idx) => (
              <Col key={idx} xs={6} md={3}>
                <div className="feature-card text-center">
                  <div className="feature-icon">{feature.icon}</div>
                  <h5 className="feature-title">{feature.title}</h5>
                  <p className="feature-desc">{feature.desc}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </div>
  );
};

const ProductCard = ({ product, promotions }) => {
  const promo = promotions?.find(p => p.product?.id === product.id && p.isActive);
  return (
    <Card className="product-card">
      <Link to={`/products/${product.slug}`} className="product-link">
        <div className="product-img-wrapper">
          <Card.Img variant="top" src={product.mainImage} className="product-img" />
          {product.salePrice && (
            <Badge className="sale-badge">-{Math.round((1 - product.salePrice / product.price) * 100)}%</Badge>
          )}
          {promo && !product.salePrice && (
            <Badge className="sale-badge bg-danger">
              {promo.discountPercentage ? `${promo.discountPercentage}% OFF` :
               promo.discountAmount ? `LKR ${promo.discountAmount} OFF` : 'Sale'}
            </Badge>
          )}
          {product.isNewArrival && (
            <Badge className="new-badge">New</Badge>
          )}
          <div className="product-actions">
            <Button variant="light" className="action-btn" title="Add to Cart">
              <FiShoppingBag size={16} />
            </Button>
          </div>
        </div>
        <Card.Body className="product-body">
          <span className="product-brand">{product.brand}</span>
          <Card.Title className="product-title">{product.name}</Card.Title>
          <div className="product-price">
            {product.salePrice ? (
              <>
                <span className="sale-price">LKR {product.salePrice.toLocaleString()}</span>
                <span className="original-price">LKR {product.price.toLocaleString()}</span>
              </>
            ) : (
              <span className="current-price">LKR {product.price.toLocaleString()}</span>
            )}
          </div>
        </Card.Body>
      </Link>
    </Card>
  );
};

export default Home;
