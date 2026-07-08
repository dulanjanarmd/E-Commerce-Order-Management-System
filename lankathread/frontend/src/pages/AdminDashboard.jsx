import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Form, Modal, Tab, Tabs } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiUsers, FiDollarSign, FiPackage, FiTrendingUp, FiEdit2, FiTrash2, FiPlus, FiEye, FiFilter, FiCheck, FiArchive, FiFolder, FiTag } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import api, { orderAPI, productAPI, categoryAPI, promotionAPI } from '../services/api';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0
  });
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: 0,
    salePrice: null,
    stockQuantity: 0,
    mainImage: '',
    category: null,
    isActive: true,
    description: '',
    barcode: '',
    storeLocation: ''
  });
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [promotionForm, setPromotionForm] = useState({
    productId: null,
    discountPercentage: null,
    discountAmount: null,
    salePrice: null,
    startDate: '',
    endDate: '',
    description: '',
    isActive: true
  });
  const [promotions, setPromotions] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!isAdmin()) {
      navigate('/');
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [statsRes, ordersRes, productsRes, promotionsRes] = await Promise.all([
        orderAPI.getStats(),
        orderAPI.getAll(),
        productAPI.getAll(),
        promotionAPI.getAll()
      ]);
      if (statsRes.data.success) setStats(statsRes.data.data);
      if (ordersRes.data.success) setOrders(ordersRes.data.data);
      if (productsRes.data.success) setProducts(productsRes.data.data);
      if (promotionsRes.data) setPromotions(promotionsRes.data);
      // fetch categories
      try {
        const catRes = await categoryAPI.getAll();
        if (catRes.data.success) setCategories(catRes.data.data || []);
      } catch (e) {
        console.warn('Failed to fetch categories', e);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      fetchData();
      toast.success('Order status updated');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const openProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name || '',
        price: product.price || 0,
        salePrice: product.salePrice || null,
        stockQuantity: product.stockQuantity || 0,
        mainImage: product.mainImage || '',
        category: product.category?.id || null,
        isActive: product.isActive ?? true,
        description: product.description || '',
        barcode: product.barcode || '',
        storeLocation: product.storeLocation || ''
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: '',
        price: 0,
        salePrice: null,
        stockQuantity: 0,
        mainImage: '',
        category: null,
        isActive: true,
        description: '',
        barcode: '',
        storeLocation: ''
      });
    }
    setShowProductModal(true);
  };

  const closeProductModal = () => {
    setShowProductModal(false);
  };

  const handleProductFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files && e.target.files[0];
    // Try server-side signed Cloudinary upload first
    const serverForm = new FormData();
    serverForm.append('file', file);
    api.post('/uploads/cloudinary', serverForm)
      .then(res => {
        if (res.status === 200 && res.data && res.data.success) {
          setProductForm(prev => ({ ...prev, mainImage: res.data.data }));
          toast.success('Image uploaded via server');
          return;
        }
        // if server returns service unavailable or no URL, fall through
        throw new Error('Server-side upload not available');
      })
      .catch(() => {
        // If server-side upload fails or not configured, try client Cloudinary unsigned
        if (cloudName && uploadPreset) {
          const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
          const form = new FormData();
          form.append('file', file);
          form.append('upload_preset', uploadPreset);
          fetch(url, { method: 'POST', body: form })
            .then(res => res.json())
            .then(data => {
              if (data.secure_url) {
                setProductForm(prev => ({ ...prev, mainImage: data.secure_url }));
                toast.success('Image uploaded to Cloudinary');
              } else {
                console.error('Cloudinary upload failed', data);
                toast.error('Upload failed');
              }
            })
            .catch(err => {
              console.error(err);
              toast.error('Upload failed');
            });
        } else {
          // final fallback: upload to local server storage
          const form = new FormData();
          form.append('file', file);
          api.post('/uploads', form)
            .then(res => {
              if (res.data && res.data.success) {
                const url = res.data.data;
                setProductForm(prev => ({ ...prev, mainImage: url }));
                toast.success('Image uploaded');
              } else {
                toast.error('Upload failed');
              }
            })
            .catch(err => {
              console.error(err);
              toast.error('Upload failed');
            });
        }
      });
  };

  const handleSaveProduct = async () => {
    try {
      const payload = {
        name: productForm.name,
        price: Number(productForm.price),
        salePrice: productForm.salePrice ? Number(productForm.salePrice) : null,
        stockQuantity: Number(productForm.stockQuantity),
        mainImage: productForm.mainImage,
        description: productForm.description,
        isActive: productForm.isActive,
        category: productForm.category ? { id: Number(productForm.category) } : null,
        barcode: productForm.barcode,
        storeLocation: productForm.storeLocation
      };

      if (editingProduct && editingProduct.id) {
        await productAPI.update(editingProduct.id, payload);
        toast.success('Product updated');
      } else {
        await productAPI.create(payload);
        toast.success('Product created');
      }
      closeProductModal();
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save product');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await productAPI.delete(productId);
      toast.success('Product deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleArchiveProduct = async (productId) => {
    if (!window.confirm('Archive this product? It will be hidden from the store.')) return;
    try {
      await api.put(`/products/${productId}/archive`);
      toast.success('Product archived');
      fetchData();
    } catch (error) {
      toast.error('Failed to archive product');
    }
  };

  const handleUnarchiveProduct = async (productId) => {
    try {
      await api.put(`/products/${productId}/unarchive`);
      toast.success('Product unarchived');
      fetchData();
    } catch (error) {
      toast.error('Failed to unarchive product');
    }
  };

  const openPromotionModal = (product = null) => {
    if (product) {
      setEditingPromotion(null);
      setPromotionForm({
        productId: product.id,
        discountPercentage: null,
        discountAmount: null,
        salePrice: null,
        startDate: '',
        endDate: '',
        description: '',
        isActive: true
      });
    } else if (editingPromotion) {
      setPromotionForm({
        productId: editingPromotion.product?.id,
        discountPercentage: editingPromotion.discountPercentage,
        discountAmount: editingPromotion.discountAmount,
        salePrice: editingPromotion.salePrice,
        startDate: editingPromotion.startDate ? editingPromotion.startDate.split('T')[0] : '',
        endDate: editingPromotion.endDate ? editingPromotion.endDate.split('T')[0] : '',
        description: editingPromotion.description || '',
        isActive: editingPromotion.isActive ?? true
      });
    }
    setShowPromotionModal(true);
  };

  const closePromotionModal = () => {
    setShowPromotionModal(false);
    setEditingPromotion(null);
  };

  const handlePromotionFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPromotionForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSavePromotion = async () => {
    try {
      const payload = {
        ...promotionForm,
        product: promotionForm.productId ? { id: Number(promotionForm.productId) } : null,
        discountPercentage: promotionForm.discountPercentage ? Number(promotionForm.discountPercentage) : null,
        discountAmount: promotionForm.discountAmount ? Number(promotionForm.discountAmount) : null,
        salePrice: promotionForm.salePrice ? Number(promotionForm.salePrice) : null,
        startDate: promotionForm.startDate ? promotionForm.startDate + 'T00:00:00' : null,
        endDate: promotionForm.endDate ? promotionForm.endDate + 'T23:59:59' : null
      };

      if (editingPromotion && editingPromotion.id) {
        await promotionAPI.update(editingPromotion.id, payload);
        toast.success('Promotion updated');
      } else {
        await promotionAPI.create(payload);
        toast.success('Promotion created');
      }
      closePromotionModal();
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save promotion');
    }
  };

  const handleDeletePromotion = async (promotionId) => {
    if (!window.confirm('Delete this promotion?')) return;
    try {
      await promotionAPI.delete(promotionId);
      toast.success('Promotion deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete promotion');
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      'PENDING': 'warning',
      'CONFIRMED': 'info',
      'SHIPPED': 'primary',
      'DELIVERED': 'success',
      'CANCELLED': 'danger'
    };
    return <Badge bg={colors[status] || 'secondary'}>{status}</Badge>;
  };

  const displayOrders = orders;
  const displayProducts = products;

  if (!user) {
    return (
      <Container className="py-5 text-center">
        <h3>Access Denied</h3>
        <p>Please login as admin to access this page</p>
        <Button as={Link} to="/login" className="btn-primary-custom">
          Sign In
        </Button>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4 admin-dashboard">
      <Row>
        {/* Sidebar */}
        <Col lg={2} className="admin-sidebar d-none d-lg-block">
          <div className="sidebar-menu">
            <h5 className="sidebar-brand mb-4">
              <span className="brand-lanka">Lanka</span>
              <span className="brand-thread">Thread</span>
            </h5>
            <nav className="nav flex-column">
              <button className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
                <FiTrendingUp className="me-2" /> Dashboard
              </button>
              <button className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
                <FiPackage className="me-2" /> Orders
              </button>
              <button className={`nav-link ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
                <FiShoppingBag className="me-2" /> Products
              </button>
              <button className={`nav-link ${activeTab === 'categories' ? 'active' : ''}`} onClick={() => window.location.href = '/admin/categories'}>
                <FiFolder className="me-2" /> Categories
              </button>
              <button className={`nav-link ${activeTab === 'promotions' ? 'active' : ''}`} onClick={() => setActiveTab('promotions')}>
                <FiTag className="me-2" /> Promotions
              </button>
              <button className={`nav-link ${activeTab === 'customers' ? 'active' : ''}`} onClick={() => setActiveTab('customers')}>
                <FiUsers className="me-2" /> Customers
              </button>
            </nav>
          </div>
        </Col>

        {/* Main Content */}
        <Col lg={10}>
          {/* Mobile Tabs */}
          <div className="d-lg-none mb-3">
            <Tabs activeKey={activeTab} onSelect={setActiveTab} className="admin-tabs">
              <Tab eventKey="dashboard" title="Dashboard" />
              <Tab eventKey="orders" title="Orders" />
              <Tab eventKey="products" title="Products" />
              <Tab eventKey="promotions" title="Promotions" />
            </Tabs>
          </div>

          {activeTab === 'dashboard' && (
            <div>
              <h4 className="mb-4">Dashboard Overview</h4>

              {/* Stats Cards */}
              <Row className="g-4 mb-4">
                <Col sm={6} xl={3}>
                  <Card className="stat-card">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <p className="stat-label mb-1">Total Orders</p>
                          <h3 className="stat-value mb-0">{stats.totalOrders}</h3>
                        </div>
                        <div className="stat-icon orders-icon">
                          <FiPackage size={24} />
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col sm={6} xl={3}>
                  <Card className="stat-card">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <p className="stat-label mb-1">Revenue (LKR)</p>
                          <h3 className="stat-value mb-0">{(stats.totalRevenue / 1000).toFixed(0)}K</h3>
                        </div>
                        <div className="stat-icon revenue-icon">
                          <FiDollarSign size={24} />
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col sm={6} xl={3}>
                  <Card className="stat-card">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <p className="stat-label mb-1">Products</p>
                          <h3 className="stat-value mb-0">{stats.totalProducts}</h3>
                        </div>
                        <div className="stat-icon products-icon">
                          <FiShoppingBag size={24} />
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col sm={6} xl={3}>
                  <Card className="stat-card">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <p className="stat-label mb-1">Customers</p>
                          <h3 className="stat-value mb-0">{stats.totalCustomers}</h3>
                        </div>
                        <div className="stat-icon customers-icon">
                          <FiUsers size={24} />
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Order Status Cards */}
              <Row className="g-4 mb-4">
                {[
                  { label: 'Pending', value: stats.pendingOrders, color: 'warning', icon: <FiPackage /> },
                  { label: 'Confirmed', value: stats.confirmedOrders, color: 'info', icon: <FiTrendingUp /> },
                  { label: 'Shipped', value: stats.shippedOrders, color: 'primary', icon: <FiTrendingUp /> },
                  { label: 'Delivered', value: stats.deliveredOrders, color: 'success', icon: <FiCheck /> },
                  { label: 'Cancelled', value: stats.cancelledOrders, color: 'danger', icon: <FiTrash2 /> }
                ].map((item, idx) => (
                  <Col xs={6} md={4} lg={2} key={idx}>
                    <Card className={`status-card status-${item.color}`}>
                      <Card.Body className="text-center">
                        <div className="status-icon mb-2">{item.icon}</div>
                        <h5 className="mb-1">{item.value}</h5>
                        <small className="text-muted">{item.label}</small>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              {/* Recent Orders */}
              <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Recent Orders</h5>
                  <Button variant="link" onClick={() => setActiveTab('orders')}>View All</Button>
                </Card.Header>
                <Card.Body className="p-0">
                  <div className="table-responsive">
                    <Table className="admin-table mb-0">
                      <thead>
                        <tr>
                          <th>Order #</th>
                          <th>Customer</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayOrders.slice(0, 5).map(order => (
                          <tr key={order.id}>
                            <td><span className="order-number-sm">{order.orderNumber}</span></td>
                            <td>{order.user?.fullName || 'Guest'}</td>
                            <td>LKR {order.finalAmount?.toLocaleString()}</td>
                            <td>{getStatusBadge(order.status)}</td>
                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h4 className="mb-4">Order Management</h4>
              <Card>
                <Card.Body className="p-0">
                  <div className="table-responsive">
                    <Table className="admin-table mb-0">
                      <thead>
                        <tr>
                          <th>Order #</th>
                          <th>Customer</th>
                          <th>City</th>
                          <th>Amount</th>
                          <th>Payment</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayOrders.map(order => (
                          <tr key={order.id}>
                            <td><span className="order-number-sm">{order.orderNumber}</span></td>
                            <td>{order.user?.fullName || 'Guest'}</td>
                            <td>{order.shippingCity}</td>
                            <td>LKR {order.finalAmount?.toLocaleString()}</td>
                            <td>{order.paymentMethod === 'CASH_ON_DELIVERY' ? 'COD' : 'Card'}</td>
                            <td>{getStatusBadge(order.status)}</td>
                            <td>
                              <Form.Select
                                size="sm"
                                className="status-select"
                                value={order.status}
                                onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                              >
                                <option value="PENDING">Pending</option>
                                <option value="CONFIRMED">Confirmed</option>
                                <option value="SHIPPED">Shipped</option>
                                <option value="DELIVERED">Delivered</option>
                                <option value="CANCELLED">Cancelled</option>
                              </Form.Select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            </div>
          )}

          {activeTab === 'products' && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0">Product Management</h4>
                <Button className="btn-primary-custom" onClick={() => openProductModal(null)}>
                  <FiPlus className="me-2" /> Add Product
                </Button>
              </div>
              <Card>
                <Card.Body className="p-0">
                  <div className="table-responsive">
                    <Table className="admin-table mb-0">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Category</th>
                          <th>Price (LKR)</th>
                          <th>Stock</th>
                          <th>Barcode</th>
                          <th>Store Location</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayProducts.map(product => (
                          <tr key={product.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <img src={product.mainImage || 'https://via.placeholder.com/40'} alt="" className="product-thumb me-2" />
                                <span>{product.name}</span>
                              </div>
                            </td>
                            <td>{product.category?.name}</td>
                            <td>
                              {product.salePrice ? (
                                <>
                                  <span className="text-success">LKR {product.salePrice.toLocaleString()}</span>
                                  <small className="text-muted text-decoration-line-through ms-1">LKR {product.price.toLocaleString()}</small>
                                </>
                              ) : (
                                `LKR ${product.price.toLocaleString()}`
                              )}
                            </td>
                            <td>
                              <span className={product.stockQuantity <= 5 ? 'text-danger' : ''}>
                                {product.stockQuantity}
                              </span>
                            </td>
                            <td>
                              <small className="text-muted">{product.barcode || '-'}</small>
                            </td>
                            <td>
                              <small className="text-muted">{product.storeLocation || '-'}</small>
                            </td>
                            <td>
                              {product.isArchived ? (
                                <Badge bg="warning"><FiArchive className="me-1" />Archived</Badge>
                              ) : (
                                <Badge bg={product.isActive ? 'success' : 'secondary'}>
                                  {product.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                              )}
                            </td>
                            <td>
                              <Button variant="link" className="p-0 me-1" onClick={() => openProductModal(product)} title="Edit">
                                <FiEdit2 size={16} />
                              </Button>
                              <Button variant="link" className="p-0 me-1" onClick={() => navigate(`/products/${product.slug}`)} title="View">
                                <FiEye size={16} />
                              </Button>
                              {product.isArchived ? (
                                <Button variant="link" className="p-0 me-1 text-success" onClick={() => handleUnarchiveProduct(product.id)} title="Unarchive">
                                  <FiArchive size={16} />
                                </Button>
                              ) : (
                                <Button variant="link" className="p-0 me-1 text-warning" onClick={() => handleArchiveProduct(product.id)} title="Archive">
                                  <FiArchive size={16} />
                                </Button>
                              )}
                              <Button variant="link" className="p-0 text-danger" onClick={() => handleDeleteProduct(product.id)} title="Delete">
                                <FiTrash2 size={16} />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            </div>
          )}

          {activeTab === 'promotions' && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0">Promotion Management</h4>
                <Button className="btn-primary-custom" onClick={() => openPromotionModal(null)}>
                  <FiPlus className="me-2" /> Add Promotion
                </Button>
              </div>
              <Card>
                <Card.Body className="p-0">
                  <div className="table-responsive">
                    <Table className="admin-table mb-0">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Discount Type</th>
                          <th>Discount Value</th>
                          <th>Sale Price</th>
                          <th>Start Date</th>
                          <th>End Date</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {promotions.map(promotion => (
                          <tr key={promotion.id}>
                            <td>{promotion.product?.name || 'N/A'}</td>
                            <td>
                              {promotion.discountPercentage ? 'Percentage' : promotion.discountAmount ? 'Fixed Amount' : promotion.salePrice ? 'Sale Price' : '-'}
                            </td>
                            <td>
                              {promotion.discountPercentage && `${promotion.discountPercentage}%`}
                              {promotion.discountAmount && `LKR ${promotion.discountAmount}`}
                              {!promotion.discountPercentage && !promotion.discountAmount && '-'}
                            </td>
                            <td>
                              {promotion.salePrice ? `LKR ${promotion.salePrice.toLocaleString()}` : '-'}
                            </td>
                            <td>{promotion.startDate ? new Date(promotion.startDate).toLocaleDateString() : '-'}</td>
                            <td>{promotion.endDate ? new Date(promotion.endDate).toLocaleDateString() : '-'}</td>
                            <td>
                              <Badge bg={promotion.isActive ? 'success' : 'secondary'}>
                                {promotion.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </td>
                            <td>
                              <Button variant="link" className="p-0 me-2" onClick={() => { setEditingPromotion(promotion); openPromotionModal(); }}>
                                <FiEdit2 size={16} />
                              </Button>
                              <Button variant="link" className="p-0 text-danger" onClick={() => handleDeletePromotion(promotion.id)}>
                                <FiTrash2 size={16} />
                              </Button>
                            </td>
                          </tr>
                        ))}
                        {promotions.length === 0 && (
                          <tr>
                            <td colSpan="8" className="text-center py-4">No promotions found</td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            </div>
          )}

          {activeTab === 'customers' && (
            <div>
              <h4 className="mb-4">Customer Management</h4>
              <Card>
                <Card.Body className="text-center py-5">
                  <FiUsers size={48} className="text-muted mb-3" />
                  <h5>Customer management coming soon</h5>
                  <p className="text-muted">This feature will be available in the next update</p>
                </Card.Body>
              </Card>
            </div>
          )}
        </Col>
      </Row>
      {/* Product Modal */}
      <Modal show={showProductModal} onHide={closeProductModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingProduct ? 'Edit Product' : 'Add Product'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="g-3">
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control name="name" value={productForm.name} onChange={handleProductFormChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control as="textarea" rows={4} name="description" value={productForm.description} onChange={handleProductFormChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select name="category" value={productForm.category || ''} onChange={handleProductFormChange}>
                    <option value="">Select category</option>
                    {categories.filter(cat => !cat.parentId).map(parent => (
                      <optgroup key={parent.id} label={parent.name}>
                        <option value={parent.id}>{parent.name} (Main)</option>
                        {categories.filter(cat => cat.parentId === parent.id).map(sub => (
                          <option key={sub.id} value={sub.id}>↳ {sub.name}</option>
                        ))}
                      </optgroup>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Price (LKR)</Form.Label>
                  <Form.Control type="number" name="price" value={productForm.price} onChange={handleProductFormChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Sale Price (optional)</Form.Label>
                  <Form.Control type="number" name="salePrice" value={productForm.salePrice || ''} onChange={handleProductFormChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Stock Quantity</Form.Label>
                  <Form.Control type="number" name="stockQuantity" value={productForm.stockQuantity} onChange={handleProductFormChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Barcode</Form.Label>
                  <Form.Control name="barcode" value={productForm.barcode} onChange={handleProductFormChange} placeholder="e.g., LT001001" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Store Location</Form.Label>
                  <Form.Control name="storeLocation" value={productForm.storeLocation} onChange={handleProductFormChange} placeholder="e.g., Aisle-1-Shelf-A" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Image URL or Upload</Form.Label>
                  <Form.Control name="mainImage" value={productForm.mainImage} onChange={handleProductFormChange} placeholder="https://... or upload below" />
                  {productForm.mainImage && (
                    <img src={productForm.mainImage} alt="preview" className="img-fluid mt-2" style={{ maxHeight: 120 }} />
                  )}
                  <Form.Control type="file" className="mt-2" onChange={handleFileSelect} />
                </Form.Group>
                <Form.Group className="mb-3 form-check">
                  <Form.Check type="checkbox" label="Active" name="isActive" checked={productForm.isActive} onChange={handleProductFormChange} />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeProductModal}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveProduct}>{editingProduct ? 'Save Changes' : 'Create Product'}</Button>
        </Modal.Footer>
      </Modal>

      {/* Promotion Modal */}
      <Modal show={showPromotionModal} onHide={closePromotionModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingPromotion ? 'Edit Promotion' : 'Add Promotion'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="g-3">
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Product</Form.Label>
                  <Form.Select name="productId" value={promotionForm.productId || ''} onChange={handlePromotionFormChange} disabled={!!editingPromotion}>
                    <option value="">Select product</option>
                    {products.map(product => (
                      <option key={product.id} value={product.id}>{product.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Discount Percentage (%)</Form.Label>
                  <Form.Control type="number" name="discountPercentage" value={promotionForm.discountPercentage || ''} onChange={handlePromotionFormChange} placeholder="e.g., 20" />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Discount Amount (LKR)</Form.Label>
                  <Form.Control type="number" name="discountAmount" value={promotionForm.discountAmount || ''} onChange={handlePromotionFormChange} placeholder="e.g., 500" />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Sale Price (LKR)</Form.Label>
                  <Form.Control type="number" name="salePrice" value={promotionForm.salePrice || ''} onChange={handlePromotionFormChange} placeholder="e.g., 2990" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control type="date" name="startDate" value={promotionForm.startDate} onChange={handlePromotionFormChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control type="date" name="endDate" value={promotionForm.endDate} onChange={handlePromotionFormChange} />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control as="textarea" rows={3} name="description" value={promotionForm.description} onChange={handlePromotionFormChange} placeholder="Promotion description..." />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3 form-check">
                  <Form.Check type="checkbox" label="Active" name="isActive" checked={promotionForm.isActive} onChange={handlePromotionFormChange} />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closePromotionModal}>Cancel</Button>
          <Button variant="primary" onClick={handleSavePromotion}>{editingPromotion ? 'Save Changes' : 'Create Promotion'}</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;
