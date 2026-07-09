import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Form, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FiFolder, FiEdit2, FiTrash2, FiPlus, FiChevronRight, FiStar } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { categoryAPI } from '../services/api';
import { toast } from 'react-toastify';

const CategoryManagement = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    parentId: null,
    displayOrder: 0,
    active: true
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!isAdmin()) {
      navigate('/');
      return;
    }
    fetchCategories();
  }, [user]);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      if (response.data.success) {
        const allCategories = response.data.data;
        setCategories(allCategories);
        setParentCategories(allCategories.filter(cat => !cat.parentId));
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const openModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setCategoryForm({
        name: category.name || '',
        slug: category.slug || '',
        description: category.description || '',
        imageUrl: category.imageUrl || '',
        parentId: category.parentId || null,
        displayOrder: category.displayOrder || 0,
        active: category.active ?? true
      });
    } else {
      setEditingCategory(null);
      setCategoryForm({
        name: '',
        slug: '',
        description: '',
        imageUrl: '',
        parentId: null,
        displayOrder: 0,
        active: true
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCategoryForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...categoryForm,
        parentId: categoryForm.parentId ? Number(categoryForm.parentId) : null,
        displayOrder: Number(categoryForm.displayOrder)
      };

      if (editingCategory && editingCategory.id) {
        // Update existing category
        await categoryAPI.update(editingCategory.id, payload);
        toast.success('Category updated');
      } else {
        // Create new category
        await categoryAPI.create(payload);
        toast.success('Category created');
      }
      closeModal();
      fetchCategories();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save category');
    }
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm('Delete this category? This will also affect products in this category.')) return;
    try {
      await categoryAPI.delete(categoryId);
      toast.success('Category deleted');
      fetchCategories();
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  const handleTogglePin = async (categoryId) => {
    try {
      const res = await categoryAPI.togglePin(categoryId);
      if (res.data.success) {
        toast.success(res.data.message || 'Category pin toggled');
        fetchCategories();
      }
    } catch (error) {
      console.error('Error toggling pin:', error);
      toast.error('Failed to toggle pin');
    }
  };

  const getParentCategoryName = (parentId) => {
    const parent = parentCategories.find(cat => cat.id === parentId);
    return parent ? parent.name : '-';
  };

  const getSubcategories = (parentId) => {
    return categories.filter(cat => cat.parentId === parentId);
  };

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
        <Col lg={10} className="offset-lg-2">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4>Category Management</h4>
            <Button className="btn-primary-custom" onClick={() => openModal(null)}>
              <FiPlus className="me-2" /> Add Category
            </Button>
          </div>

          <Card>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table className="admin-table mb-0">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Parent Category</th>
                      <th>Display Order</th>
                      <th>Status</th>
                      <th>Pinned</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map(category => (
                      <tr key={category.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            {category.imageUrl && (
                              <img src={category.imageUrl} alt="" className="category-thumb me-2" />
                            )}
                            <div>
                              <strong>{category.name}</strong>
                              <div className="text-muted small">{category.slug}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <Badge bg={category.parentId ? 'info' : 'primary'}>
                            {category.parentId ? 'Subcategory' : 'Main Category'}
                          </Badge>
                        </td>
                        <td>{getParentCategoryName(category.parentId)}</td>
                        <td>{category.displayOrder}</td>
                        <td>
                          <Badge bg={category.active ? 'success' : 'secondary'}>
                            {category.active ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td>
                          {!category.parentId && (
                            <Button
                              variant="link"
                              className={`p-0 ${category.isPinned ? 'text-warning' : 'text-muted'}`}
                              onClick={() => handleTogglePin(category.id)}
                              title={category.isPinned ? 'Unpin from navbar' : 'Pin to navbar (max 5)'}
                            >
                              <FiStar size={18} fill={category.isPinned ? 'currentColor' : 'none'} />
                            </Button>
                          )}
                          {category.isPinned && <Badge bg="warning" className="ms-1">Pinned</Badge>}
                        </td>
                        <td>
                          <Button variant="link" className="p-0 me-2" onClick={() => openModal(category)}>
                            <FiEdit2 size={16} />
                          </Button>
                          <Button variant="link" className="p-0 text-danger" onClick={() => handleDelete(category.id)}>
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

          {/* Category Tree View */}
          <Card className="mt-4">
            <Card.Header>
              <h5 className="mb-0">Category Hierarchy</h5>
            </Card.Header>
            <Card.Body>
              {parentCategories.map(parent => (
                <div key={parent.id} className="category-tree-item mb-3">
                  <div className="d-flex align-items-center p-2 bg-light rounded">
                    <FiFolder className="me-2 text-primary" />
                    <strong>{parent.name}</strong>
                    <Badge bg="success" className="ms-2">Main</Badge>
                    {parent.isPinned && <Badge bg="warning" className="ms-2">Pinned</Badge>}
                    <Button
                      variant="link"
                      className={`p-0 ms-2 ${parent.isPinned ? 'text-warning' : 'text-muted'}`}
                      onClick={() => handleTogglePin(parent.id)}
                      title={parent.isPinned ? 'Unpin from navbar' : 'Pin to navbar (max 5)'}
                    >
                      <FiStar size={16} fill={parent.isPinned ? 'currentColor' : 'none'} />
                    </Button>
                  </div>
                  {getSubcategories(parent.id).length > 0 && (
                    <div className="ms-4 mt-2">
                      {getSubcategories(parent.id).map(sub => (
                        <div key={sub.id} className="d-flex align-items-center p-2 border-bottom">
                          <FiChevronRight className="me-2 text-muted" />
                          <FiFolder className="me-2 text-info" />
                          {sub.name}
                          <Badge bg="info" className="ms-2">Sub</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Category Modal */}
      <Modal show={showModal} onHide={closeModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingCategory ? 'Edit Category' : 'Add Category'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category Name</Form.Label>
                  <Form.Control name="name" value={categoryForm.name} onChange={handleFormChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Slug</Form.Label>
                  <Form.Control name="slug" value={categoryForm.slug} onChange={handleFormChange} placeholder="auto-generated if empty" />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control as="textarea" rows={3} name="description" value={categoryForm.description} onChange={handleFormChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Parent Category</Form.Label>
                  <Form.Select name="parentId" value={categoryForm.parentId || ''} onChange={handleFormChange}>
                    <option value="">None (Main Category)</option>
                    {parentCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Display Order</Form.Label>
                  <Form.Control type="number" name="displayOrder" value={categoryForm.displayOrder} onChange={handleFormChange} />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Image URL</Form.Label>
                  <Form.Control name="imageUrl" value={categoryForm.imageUrl} onChange={handleFormChange} placeholder="https://..." />
                </Form.Group>
              </Col>
              <Col md={12}>
                {categoryForm.imageUrl && (
                  <img src={categoryForm.imageUrl} alt="preview" className="img-fluid mb-3" style={{ maxHeight: 150 }} />
                )}
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3 form-check">
                  <Form.Check type="checkbox" label="Active" name="active" checked={categoryForm.active} onChange={handleFormChange} />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>{editingCategory ? 'Save Changes' : 'Create Category'}</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CategoryManagement;
