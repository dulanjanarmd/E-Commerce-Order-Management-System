import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Badge, Offcanvas } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiFilter, FiHeart, FiShoppingBag, FiSearch, FiX, FiGrid, FiList } from 'react-icons/fi';
import { productAPI, categoryAPI } from '../services/api';

const Products = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const [filters, setFilters] = useState({
    search: queryParams.get('search') || '',
    gender: queryParams.get('gender') || '',
    categoryId: queryParams.get('category') || '',
    minPrice: '',
    maxPrice: '',
    brands: [],
    sizes: [],
    colors: [],
    inStock: false,
    newArrivals: queryParams.get('newArrivals') === 'true' || false,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];
  const allColors = ['Black', 'White', 'Red', 'Blue', 'Green', 'Pink', 'Yellow', 'Purple', 'Brown', 'Grey'];

  useEffect(() => {
    fetchCategoriesAndBrands();
    fetchProducts();
  }, [location.search, currentPage]);

  const fetchCategoriesAndBrands = async () => {
    try {
      const [catRes, brandRes] = await Promise.all([
        categoryAPI.getParentCategories(),
        productAPI.getBrands()
      ]);
      if (catRes.data.success) setCategories(catRes.data.data);
      if (brandRes.data.success) setBrands(brandRes.data.data);
    } catch (error) {
      console.error('Error fetching categories/brands:', error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const filterPayload = {
        ...filters,
        gender: filters.gender,
        categoryId: filters.categoryId ? parseInt(filters.categoryId) : null,
        minPrice: filters.minPrice ? parseFloat(filters.minPrice) : null,
        maxPrice: filters.maxPrice ? parseFloat(filters.maxPrice) : null,
        inStock: filters.inStock || null,
        newArrivals: filters.newArrivals || null
      };

      const response = await productAPI.filter(filterPayload, currentPage, 20);
      if (response.data.success) {
        const pageData = response.data.data;
        setProducts(pageData.content || []);
        setTotalPages(pageData.totalPages || 0);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      // Use mock data if API fails
      setProducts(getMockProducts());
    } finally {
      setLoading(false);
    }
  };

  const getMockProducts = () => {
    const mockProducts = [
      { id: 1, name: 'Floral Summer Dress', price: 4590, salePrice: 3290, mainImage: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400', slug: 'floral-summer-dress', brand: 'LankaThread', gender: 'WOMEN', sizes: ['S', 'M', 'L'], colors: ['Pink', 'Blue'], stockQuantity: 15, isNewArrival: true, category: { name: 'Dresses' } },
      { id: 2, name: 'Classic Linen Shirt', price: 3890, mainImage: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400', slug: 'classic-linen-shirt', brand: 'LankaThread', gender: 'MEN', sizes: ['M', 'L', 'XL'], colors: ['White', 'Blue'], stockQuantity: 20, isNewArrival: false, category: { name: 'Shirts' } },
      { id: 3, name: 'Kids Cotton T-Shirt', price: 1890, mainImage: 'https://images.unsplash.com/photo-1519278407-7e5f4b54cc6a?w=400', slug: 'kids-cotton-tshirt', brand: 'LankaThread', gender: 'KIDS', sizes: ['XS', 'S', 'M'], colors: ['Red', 'Yellow', 'Green'], stockQuantity: 30, isNewArrival: true, category: { name: 'T-Shirts' } },
      { id: 4, name: 'Teen Denim Jacket', price: 5990, salePrice: 4590, mainImage: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=400', slug: 'teen-denim-jacket', brand: 'LankaThread', gender: 'TEENS', sizes: ['S', 'M', 'L'], colors: ['Blue'], stockQuantity: 8, isNewArrival: false, category: { name: 'Jackets' } },
      { id: 5, name: 'Traditional Saree', price: 12500, mainImage: 'https://images.unsplash.com/photo-1583391733951-8f1cb5da7574?w=400', slug: 'traditional-saree', brand: 'Heritage', gender: 'WOMEN', sizes: ['Free Size'], colors: ['Red', 'Gold'], stockQuantity: 5, isNewArrival: true, category: { name: 'Sarees' } },
      { id: 6, name: 'Casual Polo Shirt', price: 2890, mainImage: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400', slug: 'casual-polo-shirt', brand: 'LankaThread', gender: 'MEN', sizes: ['S', 'M', 'L', 'XL'], colors: ['Black', 'White', 'Navy'], stockQuantity: 25, isNewArrival: false, category: { name: 'Polo Shirts' } },
      { id: 7, name: 'Elegant Kurti', price: 4590, mainImage: 'https://images.unsplash.com/photo-1610030465003-7c65e3d6d681?w=400', slug: 'elegant-kurti', brand: 'Heritage', gender: 'WOMEN', sizes: ['S', 'M', 'L', 'XL'], colors: ['Green', 'Purple'], stockQuantity: 12, isNewArrival: true, category: { name: 'Kurtis' } },
      { id: 8, name: 'Beach Shorts', price: 2290, mainImage: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400', slug: 'beach-shorts', brand: 'LankaThread', gender: 'MEN', sizes: ['S', 'M', 'L'], colors: ['Blue', 'Green'], stockQuantity: 18, isNewArrival: false, category: { name: 'Shorts' } },
      { id: 9, name: 'Party Wear Gown', price: 8500, mainImage: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400', slug: 'party-wear-gown', brand: 'LankaThread', gender: 'WOMEN', sizes: ['S', 'M', 'L'], colors: ['Black', 'Red'], stockQuantity: 6, isNewArrival: true, category: { name: 'Gowns' } },
      { id: 10, name: 'School Uniform Set', price: 3500, mainImage: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=400', slug: 'school-uniform-set', brand: 'LankaThread', gender: 'KIDS', sizes: ['XS', 'S', 'M', 'L'], colors: ['White', 'Navy'], stockQuantity: 40, isNewArrival: false, category: { name: 'Uniforms' } },
      { id: 11, name: 'Winter Hoodie', price: 4200, salePrice: 3500, mainImage: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400', slug: 'winter-hoodie', brand: 'LankaThread', gender: 'TEENS', sizes: ['S', 'M', 'L', 'XL'], colors: ['Black', 'Grey', 'Blue'], stockQuantity: 14, isNewArrival: false, category: { name: 'Hoodies' } },
      { id: 12, name: 'Cotton Salwar', price: 3800, mainImage: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400', slug: 'cotton-salwar', brand: 'Heritage', gender: 'WOMEN', sizes: ['S', 'M', 'L', 'XL'], colors: ['Pink', 'Blue', 'Green'], stockQuantity: 10, isNewArrival: true, category: { name: 'Salwar' } },
    ];

    let filtered = mockProducts;
    if (filters.gender) {
      filtered = filtered.filter(p => p.gender === filters.gender);
    }
    if (filters.search) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(filters.search.toLowerCase()));
    }
    if (filters.newArrivals) {
      filtered = filtered.filter(p => p.isNewArrival);
    }
    return filtered;
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value) 
        ? prev[key].filter(v => v !== value)
        : [...prev[key], value]
    }));
  };

  const applyFilters = () => {
    setCurrentPage(0);
    fetchProducts();
    setShowFilters(false);
  };

  const resetFilters = () => {
    setFilters({
      search: '', gender: '', categoryId: '', minPrice: '', maxPrice: '',
      brands: [], sizes: [], colors: [], inStock: false, newArrivals: false,
      sortBy: 'createdAt', sortOrder: 'desc'
    });
    navigate('/products');
  };

  const FilterContent = () => (
    <div className="filters-panel">
      <div className="d-flex justify-content-between align-items-center mb-3 d-lg-none">
        <h5 className="mb-0">Filters</h5>
        <Button variant="link" onClick={() => setShowFilters(false)}><FiX /></Button>
      </div>

      <div className="filter-group">
        <h6 className="filter-title">Gender</h6>
        <Form.Select 
          value={filters.gender} 
          onChange={(e) => handleFilterChange('gender', e.target.value)}
          className="filter-select"
        >
          <option value="">All Genders</option>
          <option value="WOMEN">Women</option>
          <option value="MEN">Men</option>
          <option value="KIDS">Kids</option>
          <option value="TEENS">Teens</option>
        </Form.Select>
      </div>

      <div className="filter-group">
        <h6 className="filter-title">Price Range (LKR)</h6>
        <div className="d-flex gap-2">
          <Form.Control 
            type="number" 
            placeholder="Min" 
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            className="filter-input"
          />
          <Form.Control 
            type="number" 
            placeholder="Max" 
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            className="filter-input"
          />
        </div>
      </div>

      <div className="filter-group">
        <h6 className="filter-title">Size</h6>
        <div className="filter-chips">
          {allSizes.map(size => (
            <Button
              key={size}
              variant={filters.sizes.includes(size) ? 'dark' : 'outline-dark'}
              className="filter-chip"
              onClick={() => toggleArrayFilter('sizes', size)}
            >
              {size}
            </Button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <h6 className="filter-title">Color</h6>
        <div className="filter-color-chips">
          {allColors.map(color => (
            <button
              key={color}
              className={`color-chip ${filters.colors.includes(color) ? 'active' : ''}`}
              style={{ backgroundColor: color.toLowerCase() }}
              onClick={() => toggleArrayFilter('colors', color)}
              title={color}
            />
          ))}
        </div>
      </div>

      <div className="filter-group">
        <Form.Check
          type="checkbox"
          id="inStock"
          label="In Stock Only"
          checked={filters.inStock}
          onChange={(e) => handleFilterChange('inStock', e.target.checked)}
          className="filter-checkbox"
        />
        <Form.Check
          type="checkbox"
          id="newArrivals"
          label="New Arrivals"
          checked={filters.newArrivals}
          onChange={(e) => handleFilterChange('newArrivals', e.target.checked)}
          className="filter-checkbox"
        />
      </div>

      <div className="filter-actions">
        <Button className="btn-primary-custom w-100 mb-2" onClick={applyFilters}>
          Apply Filters
        </Button>
        <Button variant="outline-secondary" className="w-100" onClick={resetFilters}>
          Reset All
        </Button>
      </div>
    </div>
  );

  return (
    <Container className="py-4">
      {/* Header */}
      <div className="products-header mb-4">
        <h1 className="page-title">
          {filters.search ? `Search: "${filters.search}"` : 
           filters.newArrivals ? 'New Arrivals' :
           filters.gender ? `${filters.gender.charAt(0) + filters.gender.slice(1).toLowerCase()}'s Collection` : 
           'All Products'}
        </h1>
        <div className="d-flex gap-2 align-items-center">
          <Button 
            variant="outline-dark" 
            className="d-lg-none" 
            onClick={() => setShowFilters(true)}
          >
            <FiFilter className="me-1" /> Filters
          </Button>
          <div className="view-toggle d-none d-md-flex">
            <Button 
              variant={viewMode === 'grid' ? 'dark' : 'outline-dark'} 
              className="view-btn"
              onClick={() => setViewMode('grid')}
            >
              <FiGrid />
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'dark' : 'outline-dark'} 
              className="view-btn"
              onClick={() => setViewMode('list')}
            >
              <FiList />
            </Button>
          </div>
          <Form.Select 
            className="sort-select"
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-');
              handleFilterChange('sortBy', sortBy);
              handleFilterChange('sortOrder', sortOrder);
            }}
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A-Z</option>
          </Form.Select>
        </div>
      </div>

      <Row>
        {/* Desktop Filters Sidebar */}
        <Col lg={3} className="d-none d-lg-block">
          <div className="filters-sidebar">
            <FilterContent />
          </div>
        </Col>

        {/* Mobile Filters Offcanvas */}
        <Offcanvas show={showFilters} onHide={() => setShowFilters(false)} className="filter-offcanvas">
          <Offcanvas.Body>
            <FilterContent />
          </Offcanvas.Body>
        </Offcanvas>

        {/* Products Grid */}
        <Col lg={9}>
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-5">
              <FiSearch size={48} className="text-muted mb-3" />
              <h4>No products found</h4>
              <p className="text-muted">Try adjusting your filters or search query</p>
              <Button variant="outline-dark" onClick={resetFilters}>Clear All Filters</Button>
            </div>
          ) : (
            <>
              <p className="results-count">{products.length} products found</p>
              <Row className={viewMode === 'grid' ? 'g-4' : 'g-3'}>
                {products.map(product => (
                  <Col 
                    key={product.id} 
                    xs={viewMode === 'grid' ? 6 : 12} 
                    md={viewMode === 'grid' ? 4 : 12}
                  >
                    <ProductCard product={product} viewMode={viewMode} />
                  </Col>
                ))}
              </Row>

              {totalPages > 1 && (
                <div className="pagination-wrapper mt-4">
                  <Button 
                    variant="outline-dark" 
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage(p => p - 1)}
                  >
                    Previous
                  </Button>
                  <span className="page-info">Page {currentPage + 1} of {totalPages}</span>
                  <Button 
                    variant="outline-dark" 
                    disabled={currentPage >= totalPages - 1}
                    onClick={() => setCurrentPage(p => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

const ProductCard = ({ product, viewMode }) => {
  if (viewMode === 'list') {
    return (
      <Card className="product-card-list">
        <Row className="g-0">
          <Col md={3}>
            <Link to={`/products/${product.slug}`}>
              <Card.Img src={product.mainImage} className="product-img-list" />
            </Link>
          </Col>
          <Col md={9}>
            <Card.Body className="d-flex justify-content-between">
              <div>
                <span className="product-brand">{product.brand}</span>
                <Card.Title className="product-title">{product.name}</Card.Title>
                <p className="text-muted small">{product.category?.name} | {product.gender}</p>
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
              </div>
              <div className="d-flex flex-column gap-2">
                <Button variant="outline-dark" size="sm" className="action-btn-sm">
                  <FiHeart />
                </Button>
                <Button variant="dark" size="sm" className="action-btn-sm">
                  <FiShoppingBag />
                </Button>
              </div>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    );
  }

  return (
    <Card className="product-card">
      <Link to={`/products/${product.slug}`} className="product-link">
        <div className="product-img-wrapper">
          <Card.Img variant="top" src={product.mainImage} className="product-img" />
          {product.salePrice && (
            <Badge className="sale-badge">-{Math.round((1 - product.salePrice / product.price) * 100)}%</Badge>
          )}
          {product.isNewArrival && (
            <Badge className="new-badge">New</Badge>
          )}
          <div className="product-actions">
            <Button variant="light" className="action-btn" title="Quick Add">
              <FiShoppingBag size={16} />
            </Button>
            <Button variant="light" className="action-btn" title="Add to Wishlist">
              <FiHeart size={16} />
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

export default Products;
