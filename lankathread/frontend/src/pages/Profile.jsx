import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Nav, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit2, FiSave, FiLock } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '42 Galle Road, Colombo 03',
    city: 'Colombo',
    district: 'Colombo',
    postalCode: '00300'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setEditing(false);
    toast.success('Profile updated successfully');
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    toast.success('Password updated successfully');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  if (!user) {
    return (
      <Container className="py-5 text-center">
        <h3>Please login to view your profile</h3>
        <Button as={Link} to="/login" className="btn-primary-custom mt-3">
          Sign In
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h1 className="page-title mb-4">My Profile</h1>
      
      <Row>
        <Col lg={4} className="mb-4">
          <Card className="profile-sidebar">
            <Card.Body className="text-center">
              <div className="profile-avatar">
                <FiUser size={48} />
              </div>
              <h5 className="mt-3 mb-1">{user.fullName}</h5>
              <p className="text-muted mb-0">{user.email}</p>
              <span className="badge bg-dark mt-2">{user.role}</span>
            </Card.Body>
          </Card>

          <Card className="mt-3">
            <Card.Body>
              <h6 className="mb-3">Quick Links</h6>
              <Nav className="flex-column profile-nav">
                <Nav.Link href="/orders"><FiEdit2 className="me-2" /> My Orders</Nav.Link>
                <Nav.Link href="/wishlist"><FiUser className="me-2" /> My Wishlist</Nav.Link>
                <Nav.Link href="/cart"><FiMapPin className="me-2" /> Shopping Cart</Nav.Link>
              </Nav>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          <Tab.Container defaultActiveKey="profile">
            <Nav variant="tabs" className="profile-tabs mb-4">
              <Nav.Item>
                <Nav.Link eventKey="profile">Personal Information</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="addresses">Addresses</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="security">Security</Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              <Tab.Pane eventKey="profile">
                <Card>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h5 className="mb-0">Personal Information</h5>
                      <Button 
                        variant="outline-dark" 
                        size="sm"
                        onClick={() => editing ? handleSave() : setEditing(true)}
                      >
                        {editing ? <><FiSave className="me-1" /> Save</> : <><FiEdit2 className="me-1" /> Edit</>}
                      </Button>
                    </div>

                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Full Name</Form.Label>
                          <Form.Control
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            disabled={!editing}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={true}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Phone Number</Form.Label>
                          <Form.Control
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={!editing}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Member Since</Form.Label>
                          <Form.Control type="text" value="2024" disabled />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Tab.Pane>

              <Tab.Pane eventKey="addresses">
                <Card>
                  <Card.Body>
                    <h5 className="mb-4">Default Shipping Address</h5>
                    <Row className="g-3">
                      <Col md={12}>
                        <Form.Group>
                          <Form.Label>Address</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={2}
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            disabled={!editing}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>City</Form.Label>
                          <Form.Control
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            disabled={!editing}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>District</Form.Label>
                          <Form.Control
                            type="text"
                            name="district"
                            value={formData.district}
                            onChange={handleChange}
                            disabled={!editing}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label>Postal Code</Form.Label>
                          <Form.Control
                            type="text"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleChange}
                            disabled={!editing}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Tab.Pane>

              <Tab.Pane eventKey="security">
                <Card>
                  <Card.Body>
                    <h5 className="mb-4"><FiLock className="me-2" />Change Password</h5>
                    <Form onSubmit={handlePasswordUpdate}>
                      <Row className="g-3">
                        <Col md={12}>
                          <Form.Group>
                            <Form.Label>Current Password</Form.Label>
                            <Form.Control
                              type="password"
                              name="currentPassword"
                              value={passwordData.currentPassword}
                              onChange={handlePasswordChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>New Password</Form.Label>
                            <Form.Control
                              type="password"
                              name="newPassword"
                              value={passwordData.newPassword}
                              onChange={handlePasswordChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>Confirm New Password</Form.Label>
                            <Form.Control
                              type="password"
                              name="confirmPassword"
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Button type="submit" className="btn-primary-custom mt-3">
                        Update Password
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
