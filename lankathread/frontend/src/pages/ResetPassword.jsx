import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FiLock, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error('Invalid or missing reset token');
      navigate('/forgot-password');
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.resetPassword({ 
        token, 
        password: formData.password 
      });
      if (response.data.success) {
        setSuccess(true);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Failed to reset password. The link may be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return null;
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="auth-card">
            <Card.Body className="p-4 p-md-5">
              <div className="text-center mb-4">
                <Link to="/login" className="back-link mb-3 d-inline-block">
                  <FiArrowLeft className="me-1" /> Back to Login
                </Link>
                <h2 className="auth-title">Reset Password</h2>
                <p className="text-muted">
                  {success 
                    ? "Your password has been reset"
                    : "Enter your new password"
                  }
                </p>
              </div>

              {success ? (
                <div className="text-center py-4">
                  <FiCheckCircle size={64} className="text-success mb-3" />
                  <h4 className="mb-3">Password Reset Successful!</h4>
                  <p className="text-muted mb-4">
                    Your password has been successfully reset. You can now sign in with your new password.
                  </p>
                  <Button 
                    as={Link}
                    to="/login"
                    className="btn-primary-custom w-100"
                  >
                    Sign In
                  </Button>
                </div>
              ) : (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label><FiLock className="me-1" /> New Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter new password"
                      required
                      minLength={6}
                    />
                    <Form.Text className="text-muted">
                      Password must be at least 6 characters
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label><FiLock className="me-1" /> Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm new password"
                      required
                      minLength={6}
                    />
                  </Form.Group>

                  <Button 
                    type="submit" 
                    className="btn-primary-custom w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </Button>
                </Form>
              )}

              {!success && (
                <div className="text-center mt-3">
                  <p className="mb-0">
                    Remember your password?{' '}
                    <Link to="/login" className="auth-link">
                      Sign In
                    </Link>
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ResetPassword;
