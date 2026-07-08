import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authAPI.forgotPassword({ email });
      if (response.data.success) {
        setSubmitted(true);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
                <h2 className="auth-title">Forgot Password?</h2>
                <p className="text-muted">
                  {submitted 
                    ? "Check your email for the reset link"
                    : "Enter your email to receive a password reset link"
                  }
                </p>
              </div>

              {submitted ? (
                <div className="text-center py-4">
                  <FiCheckCircle size={64} className="text-success mb-3" />
                  <h4 className="mb-3">Email Sent!</h4>
                  <p className="text-muted">
                    We've sent a password reset link to <strong>{email}</strong>. 
                    The link will expire in 1 hour.
                  </p>
                  <p className="text-muted small">
                    Didn't receive the email? Check your spam folder or{' '}
                    <Button 
                      variant="link" 
                      className="p-0" 
                      onClick={() => setSubmitted(false)}
                    >
                      try again
                    </Button>
                  </p>
                </div>
              ) : (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label><FiMail className="me-1" /> Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                    />
                    <Form.Text className="text-muted">
                      We'll send a password reset link to this email
                    </Form.Text>
                  </Form.Group>

                  <Button 
                    type="submit" 
                    className="btn-primary-custom w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                </Form>
              )}

              <div className="text-center mt-3">
                <p className="mb-0">
                  Remember your password?{' '}
                  <Link to="/login" className="auth-link">
                    Sign In
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

export default ForgotPassword;
