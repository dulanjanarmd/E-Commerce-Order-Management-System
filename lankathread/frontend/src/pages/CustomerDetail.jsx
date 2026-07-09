import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Form, Modal, Table } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiEdit2, FiShield, FiShieldOff, FiMail, FiPhone, FiMapPin, FiCalendar, FiShoppingBag, FiDollarSign, FiPackage } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { customerAPI } from '../services/api';
import { toast } from 'react-toastify';

const CustomerDetail = () => {
  const { id } = useParams();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '', email: '', phone: '', address: '', notes: ''
  });
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/login'); return; }
    if (!isAdmin()) { navigate('/'); return; }
    fetchCustomerDetail();
  }, [id, user, authLoading]);

  const fetchCustomerDetail = async () => {
    setLoading(true);
    try {
      const response = await customerAPI.getById(id);
      if (response.data.success) {
        const data = response.data.data;
        setCustomer(data);
        setOrders(data.orders || []);
        setEditForm({
          fullName: data.fullName || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          notes: data.notes || ''
        });
      } else {
        toast.error(response.data.message);
        navigate('/admin/customers');
      }
    } catch (error) {
      toast.error('Failed to load customer details');
      navigate('/admin/customers');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCustomer = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      const response = await customerAPI.update(id, editForm);
      if (response.data.success) {
        toast.success('Customer updated successfully');
        setShowEditModal(false);
        fetchCustomerDetail();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Failed to update customer');
    } finally {
      setEditLoading(false);
    }
  };

  const handleToggleBlock = async () => {
    try {
      const response = await customerAPI.toggleBlock(id);
      if (response.data.success) {
        toast.success(response.data.message);
        fetchCustomerDetail();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Failed to update customer status');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const variants = {
      PENDING: 'warning',
      CONFIRMED: 'info',
      SHIPPED: 'primary',
      DELIVERED: 'success',
      CANCELLED: 'danger'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const getPaymentBadge = (status) => {
    const variants = {
      PENDING: 'warning',
      PAID: 'success',
      FAILED: 'danger',
      REFUNDED: 'secondary'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
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

  if (!customer) {
    return (
      <Container className="py-5 text-center">
        <h4>Customer not found</h4>
        <Button as={Link} to="/admin/customers" variant="primary" className="mt-3">
          Back to Customers
        </Button>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <Button as={Link} to="/admin/customers" variant="outline-secondary" size="sm" className="me-3">
            <FiArrowLeft className="me-1" /> Back
          </Button>
          <h3 className="fw-bold mb-0">Customer Details</h3>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-primary" onClick={() => setShowEditModal(true)}>
            <FiEdit2 className="me-2" />Edit
          </Button>
          <Button
            variant={customer.isActive !== false ? 'outline-danger' : 'outline-success'}
            onClick={handleToggleBlock}
          >
            {customer.isActive !== false ? <><FiShieldOff className="me-2" />Block</> : <><FiShield className="me-2" />Unblock</>}
          </Button>
        </div>
      </div>

      <Row>
        {/* Customer Info Card */}
        <Col lg={4} className="mb-4">
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center pt-4">
              <div
                className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ width: 80, height: 80, fontSize: 28, fontWeight: 700 }}
              >
                {customer.profileImage
                  ? <img src={customer.profileImage} alt="" className="rounded-circle" style={{ width: 80, height: 80, objectFit: 'cover' }} />
                  : (customer.fullName || '?').charAt(0).toUpperCase()}
              </div>
              <h5 className="fw-bold mb-1">{customer.fullName || 'No Name'}</h5>
              {customer.isActive !== false
                ? <Badge bg="success" className="mb-3">Active</Badge>
                : <Badge bg="danger" className="mb-3">Blocked</Badge>}

              <hr />

              <div className="text-start">
                <div className="d-flex align-items-center mb-3 text-muted">
                  <FiMail className="me-2 flex-shrink-0" />
                  <span className="small">{customer.email}</span>
                </div>
                <div className="d-flex align-items-center mb-3 text-muted">
                  <FiPhone className="me-2 flex-shrink-0" />
                  <span className="small">{customer.phone || 'Not provided'}</span>
                </div>
                <div className="d-flex align-items-center mb-3 text-muted">
                  <FiMapPin className="me-2 flex-shrink-0" />
                  <span className="small">{customer.address || 'Not provided'}</span>
                </div>
                <div className="d-flex align-items-center mb-3 text-muted">
                  <FiCalendar className="me-2 flex-shrink-0" />
                  <span className="small">Joined {formatDate(customer.createdAt)}</span>
                </div>
              </div>

              {customer.notes && (
                <>
                  <hr />
                  <div className="text-start">
                    <h6 className="fw-semibold mb-2">Admin Notes</h6>
                    <p className="text-muted small mb-0">{customer.notes}</p>
                  </div>
                </>
              )}
            </Card.Body>
          </Card>

          {/* Stats Card */}
          <Card className="border-0 shadow-sm mt-3">
            <Card.Body>
              <h6 className="fw-semibold mb-3">Customer Stats</h6>
              <Row className="text-center">
                <Col xs={6}>
                  <div className="p-2">
                    <FiShoppingBag className="text-primary mb-1" size={20} />
                    <div className="fs-5 fw-bold">{customer.totalOrders || 0}</div>
                    <div className="text-muted small">Orders</div>
                  </div>
                </Col>
                <Col xs={6}>
                  <div className="p-2">
                    <FiDollarSign className="text-success mb-1" size={20} />
                    <div className="fs-5 fw-bold">LKR {(customer.totalSpent || 0).toLocaleString()}</div>
                    <div className="text-muted small">Total Spent</div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* Order History */}
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center py-3">
              <h5 className="fw-bold mb-0"><FiPackage className="me-2" />Order History</h5>
              <Badge bg="secondary">{orders.length} order{orders.length !== 1 ? 's' : ''}</Badge>
            </Card.Header>
            <Card.Body className="p-0">
              {orders.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <FiShoppingBag size={40} className="mb-3 opacity-25" />
                  <p className="mb-0">No orders yet</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover className="mb-0 align-middle">
                    <thead className="bg-light">
                      <tr>
                        <th className="ps-3">Order #</th>
                        <th>Date</th>
                        <th>Items</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Payment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td className="ps-3 fw-semibold">{order.orderNumber}</td>
                          <td>{formatDateTime(order.createdAt)}</td>
                          <td>{order.itemCount} item{order.itemCount !== 1 ? 's' : ''}</td>
                          <td className="fw-semibold">LKR {(order.finalAmount || 0).toLocaleString()}</td>
                          <td>{getStatusBadge(order.status)}</td>
                          <td>{getPaymentBadge(order.paymentStatus)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title><FiEdit2 className="me-2" />Edit Customer</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdateCustomer}>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={editForm.fullName}
                    onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Phone</Form.Label>
                  <Form.Control
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Address</Form.Label>
                  <Form.Control
                    type="text"
                    value={editForm.address}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Admin Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Internal notes about this customer..."
                    value={editForm.notes}
                    onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  />
                  <Form.Text className="text-muted">These notes are only visible to admins.</Form.Text>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={editLoading}>
              {editLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default CustomerDetail;
