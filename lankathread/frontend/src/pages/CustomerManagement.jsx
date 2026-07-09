import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Form, Modal, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiUserPlus, FiEye, FiShield, FiShieldOff, FiUsers, FiUserCheck, FiUserX, FiEdit2 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { customerAPI } from '../services/api';
import { toast } from 'react-toastify';

const CustomerManagement = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState({ totalCustomers: 0, activeCustomers: 0, blockedCustomers: 0 });
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, active, blocked
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ fullName: '', email: '', phone: '', password: '', address: '' });
  const [addLoading, setAddLoading] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/login'); return; }
    if (!isAdmin()) { navigate('/'); return; }
    fetchCustomers();
    fetchStats();
  }, [user, authLoading]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const isActive = statusFilter === 'all' ? undefined : statusFilter === 'active';
      const response = await customerAPI.getAll(searchKeyword || undefined, isActive);
      if (response.data.success) {
        setCustomers(response.data.data.customers);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await customerAPI.getStats();
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCustomers();
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    // Re-fetch will happen via useEffect or manual call
    setTimeout(() => fetchCustomersWithFilter(searchKeyword, value), 0);
  };

  const fetchCustomersWithFilter = async (keyword, filter) => {
    setLoading(true);
    try {
      const isActive = filter === 'all' ? undefined : filter === 'active';
      const response = await customerAPI.getAll(keyword || undefined, isActive);
      if (response.data.success) {
        setCustomers(response.data.data.customers);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (customerId) => {
    try {
      const response = await customerAPI.toggleBlock(customerId);
      if (response.data.success) {
        toast.success(response.data.message);
        fetchCustomers();
        fetchStats();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Failed to update customer status');
    }
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    if (!newCustomer.fullName || !newCustomer.email || !newCustomer.password) {
      toast.error('Please fill in all required fields');
      return;
    }
    setAddLoading(true);
    try {
      const response = await customerAPI.create(newCustomer);
      if (response.data.success) {
        toast.success('Customer created successfully');
        setShowAddModal(false);
        setNewCustomer({ fullName: '', email: '', phone: '', password: '', address: '' });
        fetchCustomers();
        fetchStats();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Failed to create customer');
    } finally {
      setAddLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Customer Management</h2>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          <FiUserPlus className="me-2" />Add Customer
        </Button>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center me-3" style={{ width: 48, height: 48 }}>
                <FiUsers className="text-primary" size={22} />
              </div>
              <div>
                <div className="text-muted small">Total Customers</div>
                <div className="fs-4 fw-bold">{stats.totalCustomers}</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="rounded-circle bg-success bg-opacity-10 d-flex align-items-center justify-content-center me-3" style={{ width: 48, height: 48 }}>
                <FiUserCheck className="text-success" size={22} />
              </div>
              <div>
                <div className="text-muted small">Active Customers</div>
                <div className="fs-4 fw-bold">{stats.activeCustomers}</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex align-items-center">
              <div className="rounded-circle bg-danger bg-opacity-10 d-flex align-items-center justify-content-center me-3" style={{ width: 48, height: 48 }}>
                <FiUserX className="text-danger" size={22} />
              </div>
              <div>
                <div className="text-muted small">Blocked Customers</div>
                <div className="fs-4 fw-bold">{stats.blockedCustomers}</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Search & Filter */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Row className="g-3 align-items-center">
            <Col md={6}>
              <Form onSubmit={handleSearch}>
                <InputGroup>
                  <InputGroup.Text className="bg-white border-end-0"><FiSearch /></InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search by name, email, or phone..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="border-start-0"
                  />
                  <Button variant="outline-primary" type="submit">Search</Button>
                </InputGroup>
              </Form>
            </Col>
            <Col md={3}>
              <Form.Select value={statusFilter} onChange={(e) => handleStatusFilterChange(e.target.value)}>
                <option value="all">All Customers</option>
                <option value="active">Active Only</option>
                <option value="blocked">Blocked Only</option>
              </Form.Select>
            </Col>
            <Col md={3} className="text-end">
              <span className="text-muted">{customers.length} customer{customers.length !== 1 ? 's' : ''} found</span>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Customer Table */}
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead className="bg-light">
                <tr>
                  <th className="ps-3">Customer</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Joined</th>
                  <th>Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="text-center py-5 text-muted">Loading customers...</td></tr>
                ) : customers.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-5 text-muted">No customers found</td></tr>
                ) : (
                  customers.map((customer) => (
                    <tr key={customer.id}>
                      <td className="ps-3">
                        <div className="d-flex align-items-center">
                          <div
                            className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center me-2 flex-shrink-0"
                            style={{ width: 36, height: 36, fontSize: 14, fontWeight: 600 }}
                          >
                            {customer.profileImage
                              ? <img src={customer.profileImage} alt="" className="rounded-circle" style={{ width: 36, height: 36, objectFit: 'cover' }} />
                              : (customer.fullName || '?').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="fw-semibold">{customer.fullName || 'No Name'}</div>
                            {customer.googleId && <Badge bg="info" className="ms-1" style={{ fontSize: 10 }}>Google</Badge>}
                          </div>
                        </div>
                      </td>
                      <td>{customer.email}</td>
                      <td>{customer.phone || '-'}</td>
                      <td>{formatDate(customer.createdAt)}</td>
                      <td>
                        {customer.isActive !== false
                          ? <Badge bg="success" className="px-2 py-1">Active</Badge>
                          : <Badge bg="danger" className="px-2 py-1">Blocked</Badge>}
                      </td>
                      <td>
                        <div className="d-flex justify-content-center gap-1">
                          <Button
                            as={Link}
                            to={`/admin/customers/${customer.id}`}
                            variant="outline-primary"
                            size="sm"
                            title="View Details"
                          >
                            <FiEye size={14} />
                          </Button>
                          <Button
                            variant={customer.isActive !== false ? 'outline-danger' : 'outline-success'}
                            size="sm"
                            onClick={() => handleToggleBlock(customer.id)}
                            title={customer.isActive !== false ? 'Block Customer' : 'Unblock Customer'}
                          >
                            {customer.isActive !== false ? <FiShieldOff size={14} /> : <FiShield size={14} />}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Add Customer Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title><FiUserPlus className="me-2" />Add New Customer</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddCustomer}>
          <Modal.Body>
            <Row className="g-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Full Name *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter full name"
                    value={newCustomer.fullName}
                    onChange={(e) => setNewCustomer({ ...newCustomer, fullName: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Email *</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email address"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Phone</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter phone number"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Password *</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Set initial password"
                    value={newCustomer.password}
                    onChange={(e) => setNewCustomer({ ...newCustomer, password: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Enter address"
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={addLoading}>
              {addLoading ? 'Creating...' : 'Create Customer'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default CustomerManagement;
