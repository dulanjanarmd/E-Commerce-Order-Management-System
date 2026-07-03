import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Badge, Form, Tab, Tabs } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiShare2, FiTruck, FiShield, FiRefreshCw, FiCheck, FiStar } from 'react-icons/fi';
import { productAPI, cartAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await productAPI.getBySlug(slug);
      if (response.data.success) {
        const prod = response.data.data;
        setProduct(prod);
        if (prod.sizes?.length > 0) setSelectedSize(prod.sizes[0]);
        if (prod.colors?.length > 0) setSelectedColor(prod.colors[0]);
        setSelectedImage(0);
        
        // Fetch related products
        const relatedRes = await productAPI.getByCategory(prod.category?.id);
        if (relatedRes.data.success) {
          setRelatedProducts(relatedRes.data.data.filter(p => p.id !== prod.id).slice(0, 4));
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      // Use mock data
      const mockProduct = getMockProduct();
      setProduct(mockProduct);
      if (mockProduct.sizes?.length > 0) setSelectedSize(mockProduct.sizes[0]);
      if (mockProduct.colors?.length > 0) setSelectedColor(mockProduct.colors[0]);
      setRelatedProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const getMockProduct = () => ({
    id: 1,
    name: 'Floral Summer Dress',
    slug: 'floral-summer-dress',
    description: 'A beautiful floral summer dress perfect for the Sri Lankan climate. Made from lightweight, breathable cotton fabric with a flattering A-line silhouette. Features a V-neckline, short flutter sleeves, and a comfortable elastic waistband. The vibrant floral print adds a touch of tropical elegance.',
    price: 4590,
    salePrice: 3290,
    mainImage: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600',
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600'
    ],
    brand: 'LankaThread',
    gender: 'WOMEN',
    category: { name: 'Dresses' },
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Pink', 'Blue', 'White'],
    material: '100% Cotton',
    careInstructions: 'Machine wash cold, gentle cycle. Do not bleach. Tumble dry low. Iron on low heat if needed.',
    stockQuantity: 15,
    sizeStock: [
      { size: 'S', stock: 5 },
      { size: 'M', stock: 8 },
      { size: 'L', stock: 2 },
      { size: 'XL', stock: 0 }
    ],
    isNewArrival: true
  });

  const handleAddToCart = async () => {
    if (!user) {
      toast.info('Please login to add items to cart');
      navigate('/login');
      return;
    }
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    try {
      await cartAPI.addItem(user.id, {
        productId: product.id,
        quantity,
        size: selectedSize,
        color: selectedColor
      });
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      toast.info('Please login to continue');
      navigate('/login');
      return;
    }
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    navigate('/checkout', { 
      state: { 
        buyNow: true, 
        product: { ...product, selectedSize, selectedColor, quantity } 
      } 
    });
  };

  const getStockForSize = (size) => {
    return product?.sizeStock?.find(s => s.size === size)?.stock || 0;
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="py-5 text-center">
        <h3>Product not found</h3>
        <Button as={Link} to="/products" variant="dark" className="mt-3">
          Browse Products
        </Button>
      </Container>
    );
  }

  const images = product.images || [product.mainImage];

  return (
    <div className="product-detail-page">
      <Container className="py-4">
        {/* Breadcrumb */}
        <nav className="breadcrumb-custom mb-4">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/products">Products</Link>
          <span>/</span>
          <Link to={`/products?gender=${product.gender}`}>{product.gender}</Link>
          <span>/</span>
          <span className="active">{product.name}</span>
        </nav>

        <Row>
          {/* Image Gallery */}
          <Col lg={6} className="mb-4">
            <div className="product-gallery">
              <div className="main-image-wrapper">
                <img src={images[selectedImage]} alt={product.name} className="main-image" />
                {product.salePrice && (
                  <Badge className="sale-badge-lg">-{Math.round((1 - product.salePrice / product.price) * 100)}% OFF</Badge>
                )}
                {product.isNewArrival && (
                  <Badge className="new-badge-lg">NEW ARRIVAL</Badge>
                )}
              </div>
              {images.length > 1 && (
                <div className="thumbnail-row">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      className={`thumbnail-btn ${selectedImage === idx ? 'active' : ''}`}
                      onClick={() => setSelectedImage(idx)}
                    >
                      <img src={img} alt={`${product.name} ${idx + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Col>

          {/* Product Info */}
          <Col lg={6}>
            <div className="product-info">
              <span className="product-brand">{product.brand}</span>
              <h1 className="product-name">{product.name}</h1>
              
              <div className="product-rating mb-3">
                {[1, 2, 3, 4, 5].map(star => (
                  <FiStar key={star} className="star-filled" />
                ))}
                <span className="rating-count">(24 reviews)</span>
              </div>

              <div className="product-price-lg mb-4">
                {product.salePrice ? (
                  <>
                    <span className="sale-price-lg">LKR {product.salePrice.toLocaleString()}</span>
                    <span className="original-price-lg">LKR {product.price.toLocaleString()}</span>
                    <Badge bg="success" className="ms-2">Save LKR {(product.price - product.salePrice).toLocaleString()}</Badge>
                  </>
                ) : (
                  <span className="current-price-lg">LKR {product.price.toLocaleString()}</span>
                )}
              </div>

              <p className="product-short-desc">{product.description?.substring(0, 150)}...</p>

              {/* Size Selection */}
              <div className="selection-group mb-3">
                <label className="selection-label">
                  Size: <span className="selected-value">{selectedSize}</span>
                </label>
                <div className="size-options">
                  {product.sizes?.map(size => {
                    const stock = getStockForSize(size);
                    return (
                      <button
                        key={size}
                        className={`size-btn ${selectedSize === size ? 'active' : ''} ${stock === 0 ? 'disabled' : ''}`}
                        onClick={() => stock > 0 && setSelectedSize(size)}
                        disabled={stock === 0}
                      >
                        {size}
                        {stock === 0 && <span className="stock-badge">Out</span>}
                        {stock > 0 && stock <= 3 && <span className="stock-badge low">{stock} left</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="selection-group mb-3">
                  <label className="selection-label">
                    Color: <span className="selected-value">{selectedColor}</span>
                  </label>
                  <div className="color-options">
                    {product.colors.map(color => (
                      <button
                        key={color}
                        className={`color-btn ${selectedColor === color ? 'active' : ''}`}
                        onClick={() => setSelectedColor(color)}
                        title={color}
                      >
                        <span className="color-dot" style={{ backgroundColor: color.toLowerCase() }}></span>
                        <span className="color-name">{color}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="selection-group mb-4">
                <label className="selection-label">Quantity:</label>
                <div className="quantity-selector">
                  <button 
                    className="qty-btn" 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <span className="qty-value">{quantity}</span>
                  <button 
                    className="qty-btn" 
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="product-actions-lg mb-4">
                <Button className="btn-add-cart" onClick={handleAddToCart}>
                  <FiShoppingCart className="me-2" /> Add to Cart
                </Button>
                <Button className="btn-buy-now" onClick={handleBuyNow}>
                  Buy Now
                </Button>
                <Button variant="outline-dark" className="btn-wishlist">
                  <FiHeart />
                </Button>
                <Button variant="outline-dark" className="btn-share">
                  <FiShare2 />
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="trust-badges">
                <div className="trust-item">
                  <FiTruck size={20} />
                  <span>Island-wide Delivery</span>
                </div>
                <div className="trust-item">
                  <FiShield size={20} />
                  <span>Secure Payment</span>
                </div>
                <div className="trust-item">
                  <FiRefreshCw size={20} />
                  <span>7-Day Returns</span>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Product Details Tabs */}
        <Row className="mt-5">
          <Col>
            <Tabs defaultActiveKey="details" className="product-tabs">
              <Tab eventKey="details" title="Product Details">
                <div className="tab-content-wrapper">
                  <p>{product.description}</p>
                  <table className="product-specs">
                    <tbody>
                      <tr>
                        <td>Brand</td>
                        <td>{product.brand}</td>
                      </tr>
                      <tr>
                        <td>Category</td>
                        <td>{product.category?.name}</td>
                      </tr>
                      <tr>
                        <td>Gender</td>
                        <td>{product.gender}</td>
                      </tr>
                      <tr>
                        <td>Material</td>
                        <td>{product.material}</td>
                      </tr>
                      <tr>
                        <td>Care Instructions</td>
                        <td>{product.careInstructions}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Tab>
              <Tab eventKey="size" title="Size Guide">
                <div className="tab-content-wrapper">
                  <h5>Size Chart (inches)</h5>
                  <table className="size-chart-table">
                    <thead>
                      <tr>
                        <th>Size</th>
                        <th>Bust/Chest</th>
                        <th>Waist</th>
                        <th>Hip</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>XS</td>
                        <td>32-34</td>
                        <td>26-28</td>
                        <td>34-36</td>
                      </tr>
                      <tr>
                        <td>S</td>
                        <td>34-36</td>
                        <td>28-30</td>
                        <td>36-38</td>
                      </tr>
                      <tr>
                        <td>M</td>
                        <td>36-38</td>
                        <td>30-32</td>
                        <td>38-40</td>
                      </tr>
                      <tr>
                        <td>L</td>
                        <td>38-40</td>
                        <td>32-34</td>
                        <td>40-42</td>
                      </tr>
                      <tr>
                        <td>XL</td>
                        <td>40-42</td>
                        <td>34-36</td>
                        <td>42-44</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Tab>
              <Tab eventKey="shipping" title="Shipping & Returns">
                <div className="tab-content-wrapper">
                  <h5>Shipping Information</h5>
                  <ul>
                    <li><FiCheck className="text-success me-2" />Free delivery for orders over LKR 5,000</li>
                    <li><FiCheck className="text-success me-2" />Colombo & Western Province: 1-2 business days</li>
                    <li><FiCheck className="text-success me-2" />Other provinces: 3-5 business days</li>
                    <li><FiCheck className="text-success me-2" />Cash on Delivery available island-wide</li>
                  </ul>
                  <h5 className="mt-4">Return Policy</h5>
                  <ul>
                    <li><FiCheck className="text-success me-2" />7-day return policy for unused items</li>
                    <li><FiCheck className="text-success me-2" />Items must be in original packaging</li>
                    <li><FiCheck className="text-success me-2" />Return shipping is free for defective items</li>
                  </ul>
                </div>
              </Tab>
            </Tabs>
          </Col>
        </Row>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="related-products mt-5">
            <h3 className="section-title">You May Also Like</h3>
            <Row className="g-4">
              {relatedProducts.map(p => (
                <Col key={p.id} xs={6} md={3}>
                  <Link to={`/products/${p.slug}`} className="related-product-link">
                    <div className="related-product-card">
                      <img src={p.mainImage} alt={p.name} className="related-img" />
                      <h6 className="related-name">{p.name}</h6>
                      <span className="related-price">LKR {p.price?.toLocaleString()}</span>
                    </div>
                  </Link>
                </Col>
              ))}
            </Row>
          </section>
        )}
      </Container>
    </div>
  );
};

export default ProductDetail;
