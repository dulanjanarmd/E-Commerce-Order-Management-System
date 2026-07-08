import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiLock, FiLogIn, FiUserPlus } from 'react-icons/fi';
import { FaGoogle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authAPI.login(formData);
      if (response.data.success) {
        const { token, ...userData } = response.data.data;
        login(token, userData);
        toast.success('Login successful!');
        navigate(from);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // In production, this would redirect to Google OAuth
    toast.info('Google login will be available soon');
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="auth-card">
            <Card.Body className="p-4 p-md-5">
              <div className="text-center mb-4">
                <h2 className="auth-title">Welcome Back</h2>
                <p className="text-muted">Sign in to your LankaThread account</p>
              </div>

              <Button 
                variant="outline-dark" 
                className="google-btn w-100 mb-4"
                onClick={handleGoogleLogin}
              >
                <FaGoogle className="me-2" />
                Continue with Google
              </Button>

              <div className="divider">
                <span>or sign in with email</span>
              </div>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label><FiMail className="me-1" /> Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label><FiLock className="me-1" /> Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                  />
                  <div className="text-end mt-2">
                    <Link to="/forgot-password" className="forgot-password-link">
                      Forgot Password?
                    </Link>
                  </div>
                </Form.Group>

                <Button 
                  type="submit" 
                  className="btn-primary-custom w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : <><FiLogIn className="me-2" /> Sign In</>}
                </Button>
              </Form>

              <div className="text-center mt-3">
                <p className="mb-0">
                  Don't have an account?{' '}
                  <Link to="/register" className="auth-link">
                    <FiUserPlus className="me-1" /> Create Account
                  </Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
