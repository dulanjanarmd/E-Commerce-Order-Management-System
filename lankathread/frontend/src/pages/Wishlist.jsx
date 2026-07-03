import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiTrash2, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { wishlistAPI, cartAPI } from '../services/api';
import { toast } from 'react-toastify';

const Wishlist = () => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setLoading(false);
      // Load from localStorage for guest
      const savedWishlist = JSON.parse(localStorage.getItem('guestWishlist') || '[]');
      setWishlistItems(savedWishlist);
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const response = await wishlistAPI.getItems(user.id);
      if (response.data.success) {
        setWishlistItems(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId) => {
    if (user) {
      try {
        await wishlistAPI.removeItem(user.id, productId);
        fetchWishlist();
        toast.success('Removed from wishlist');
      } catch (error) {
        toast.error('Failed to remove');
      }
    } else {
      const updated = wishlistItems.filter(item => item.product?.id !== productId);
      setWishlistItems(updated);
      localStorage.setItem('guestWishlist', JSON.stringify(updated));
    }
  };

  const moveToCart = async (product) => {
    if (user) {
      try {
        await cartAPI.addItem(user.id, {
          productId: product.id,
          quantity: 1,
          size: product.sizes?.[0] || '',
          color: product.colors?.[0] || ''
        });
        await wishlistAPI.removeItem(user.id, product.id);
        fetchWishlist();
        toast.success('Moved to cart');
      } catch (error) {
        toast.error('Failed to move to cart');
      }
    } else {
      toast.info('Please login to add items to cart');
    }
  };

  const mockWishlist = [
    {
      id: 1,
      product: {
        id: 1,
        name: 'Floral Summer Dress',
        slug: 'floral-summer-dress',
        price: 4590,
        salePrice: 3290,
        mainImage: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400',
        brand: 'LankaThread',
        sizes: ['S', 'M', 'L'],
        colors: ['Pink', 'Blue'],
        stockQuantity: 15
      }
    },
    {
      id: 2,
      product: {
        id: 5,
        name: 'Traditional Saree',
        slug: 'traditional-saree',
        price: 12500,
        mainImage: 'https://images.unsplash.com/photo-1583391733951-8f1cb5da7574?w=400',
        brand: 'Heritage',
        sizes: ['Free Size'],
        colors: ['Red', 'Gold'],
        stockQuantity: 5
      }
    },
    {
      id: 3,
      product: {
        id: 7,
        name: 'Elegant Kurti',
        slug: 'elegant-kurti',
        price: 4590,
        mainImage: 'https://images.unsplash.com/photo-1610030465003-7c65e3d6d681?w=400',
        brand: 'Heritage',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Green', 'Purple'],
        stockQuantity: 12
      }
    }
  ];

  const displayItems = wishlistItems.length > 0 ? wishlistItems : mockWishlist;

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
    <Container className="py-4">
      <h1 className="page-title mb-4">
        <FiHeart className="me-2" /> My Wishlist
      </h1>

      {displayItems.length === 0 ? (
        <div className="empty-wishlist text-center py-5">
          <FiHeart size={64} className="text-muted mb-3" />
          <h3>Your wishlist is empty</h3>
          <p className="text-muted">Save your favorite items to buy them later</p>
          <Button as={Link} to="/products" className="btn-primary-custom mt-3">
            Browse Products <FiArrowRight className="ms-2" />
          </Button>
        </div>
      ) : (
        <Row className="g-4">
          {displayItems.map(item => (
            <Col key={item.id} xs={6} md={4} lg={3}>
              <Card className="wishlist-card">
                <div className="wishlist-img-wrapper">
                  <Link to={`/products/${item.product?.slug}`}>
                    <Card.Img 
                      variant="top" 
                      src={item.product?.mainImage} 
                      className="wishlist-img"
                    />
                  </Link>
                  {item.product?.salePrice && (
                    <Badge className="sale-badge">-{Math.round((1 - item.product.salePrice / item.product.price) * 100)}%</Badge>
                  )}
                  <Button
                    variant="light"
                    className="remove-btn"
                    onClick={() => removeItem(item.product?.id)}
                  >
                    <FiTrash2 size={16} />
                  </Button>
                </div>
                <Card.Body className="wishlist-body">
                  <span className="product-brand">{item.product?.brand}</span>
                  <Card.Title className="wishlist-title">
                    <Link to={`/products/${item.product?.slug}`}>
                      {item.product?.name}
                    </Link>
                  </Card.Title>
                  <div className="product-price mb-3">
                    {item.product?.salePrice ? (
                      <>
                        <span className="sale-price">LKR {item.product.salePrice.toLocaleString()}</span>
                        <span className="original-price">LKR {item.product.price.toLocaleString()}</span>
                      </>
                    ) : (
                      <span className="current-price">LKR {item.product?.price?.toLocaleString()}</span>
                    )}
                  </div>
                  <Button 
                    className="btn-add-cart w-100"
                    onClick={() => moveToCart(item.product)}
                    disabled={item.product?.stockQuantity <= 0}
                  >
                    <FiShoppingCart className="me-2" />
                    {item.product?.stockQuantity > 0 ? 'Move to Cart' : 'Out of Stock'}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Wishlist;
