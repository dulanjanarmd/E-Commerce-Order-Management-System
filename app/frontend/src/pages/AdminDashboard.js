import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Form, Modal, Tab, Tabs } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiUsers, FiDollarSign, FiPackage, FiTrendingUp, FiEdit2, FiTrash2, FiPlus, FiEye, FiFilter } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { orderAPI, productAPI } from '../services/api';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalOrders: 156,
    pendingOrders: 12,
    confirmedOrders: 8,
    shippedOrders: 23,
    deliveredOrders: 108,
    cancelledOrders: 5,
    totalRevenue: 2850000,
    totalProducts: 342,
    totalCustomers: 528
  });
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [statsRes, ordersRes, productsRes] = await Promise.all([
        orderAPI.getStats(),
        orderAPI.getAll(),
        productAPI.getAll()
      ]);
      if (statsRes.data.success) setStats(statsRes.data.data);
      if (ordersRes.data.success) setOrders(ordersRes.data.data);
      if (productsRes.data.success) setProducts(productsRes.data.data);
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

  const mockOrders = [
    { id: 1, orderNumber: 'LT1704067200000', user: { fullName: 'Saman Perera' }, status: 'DELIVERED', paymentMethod: 'CASH_ON_DELIVERY', finalAmount: 8230, createdAt: '2024-12-28T10:00:00', shippingCity: 'Colombo' },
    { id: 2, orderNumber: 'LT1704153600000', user: { fullName: 'Nisha Fernando' }, status: 'SHIPPED', paymentMethod: 'CASH_ON_DELIVERY', finalAmount: 5990, createdAt: '2024-12-30T14:30:00', shippingCity: 'Kandy' },
    { id: 3, orderNumber: 'LT1704240000000', user: { fullName: 'Kamal Silva' }, status: 'PENDING', paymentMethod: 'CASH_ON_DELIVERY', finalAmount: 12500, createdAt: '2025-01-02T09:15:00', shippingCity: 'Galle' },
    { id: 4, orderNumber: 'LT1704326400000', user: { fullName: 'Priya Rajapakse' }, status: 'CONFIRMED', paymentMethod: 'CREDIT_CARD', finalAmount: 4590, createdAt: '2025-01-03T16:45:00', shippingCity: 'Negombo' },
    { id: 5, orderNumber: 'LT1704412800000', user: { fullName: 'Dinesh Kumara' }, status: 'PENDING', paymentMethod: 'CASH_ON_DELIVERY', finalAmount: 7880, createdAt: '2025-01-04T11:20:00', shippingCity: 'Jaffna' },
    { id: 6, orderNumber: 'LT1704499200000', user: { fullName: 'Amara Jayasinghe' }, status: 'SHIPPED', paymentMethod: 'CASH_ON_DELIVERY', finalAmount: 12500, createdAt: '2025-01-05T08:00:00', shippingCity: 'Colombo' },
  ];

  const mockProducts = [
    { id: 1, name: 'Floral Summer Dress', price: 4590, salePrice: 3290, stockQuantity: 15, brand: 'LankaThread', category: { name: 'Dresses' }, isActive: true },
    { id: 2, name: 'Classic Linen Shirt', price: 3890, stockQuantity: 20, brand: 'LankaThread', category: { name: 'Shirts' }, isActive: true },
    { id: 3, name: 'Kids Cotton T-Shirt', price: 1890, stockQuantity: 30, brand: 'LankaThread', category: { name: 'T-Shirts' }, isActive: true },
    { id: 4, name: 'Teen Denim Jacket', price: 5990, salePrice: 4590, stockQuantity: 8, brand: 'LankaThread', category: { name: 'Jackets' }, isActive: true },
    { id: 5, name: 'Traditional Saree', price: 12500, stockQuantity: 5, brand: 'Heritage', category: { name: 'Sarees' }, isActive: true },
    { id: 6, name: 'Casual Polo Shirt', price: 2890, stockQuantity: 25, brand: 'LankaThread', category: { name: 'Polo Shirts' }, isActive: true },
  ];

  const displayOrders = orders.length > 0 ? orders : mockOrders;
  const displayProducts = products.length > 0 ? products : mockProducts;

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
                <Button className="btn-primary-custom" onClick={() => { setEditingProduct(null); setShowProductModal(true); }}>
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
                          <th>Price</th>
                          <th>Stock</th>
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
                              <Badge bg={product.isActive ? 'success' : 'secondary'}>
                                {product.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </td>
                            <td>
                              <Button variant="link" className="p-0 me-2" onClick={() => { setEditingProduct(product); setShowProductModal(true); }}>
                                <FiEdit2 size={16} />
                              </Button>
                              <Button variant="link" className="p-0 text-danger">
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
    </Container>
  );
};

export default AdminDashboard;
