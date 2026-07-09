import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, Accordion, Collapse } from 'react-bootstrap';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  FiArrowLeft, FiSave, FiImage, FiPlus, FiTrash2, FiChevronUp, FiChevronDown,
  FiStar, FiPackage, FiDollarSign, FiTag, FiSearch, FiEye, FiUpload, FiX, FiCheck
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { productAPI, categoryAPI } from '../services/api';
import { toast } from 'react-toastify';

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];
const AVAILABLE_COLORS = ['Black', 'White', 'Red', 'Blue', 'Green', 'Pink', 'Yellow', 'Purple', 'Brown', 'Grey', 'Beige', 'Navy', 'Gold', 'Silver', 'Maroon', 'Orange'];
const SEASONS = ['Spring', 'Summer', 'Autumn', 'Winter', 'Festive', 'All Season'];

const AddProduct = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const fileInputRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('basic');

  // Form state
  const [form, setForm] = useState({
    name: '', slug: '', brand: '', categoryId: '', shortDescription: '', description: '',
    price: '', salePrice: '', stockQuantity: '', lowStockThreshold: 5,
    sku: '', barcode: '', storeLocation: '', weight: '', dimensions: '',
    material: '', careInstructions: '', season: '', gender: '',
    metaTitle: '', metaDescription: '',
    isFeatured: false, isActive: true, isNewArrival: false,
    tags: [],
    attributes: []
  });

  // Images state
  const [images, setImages] = useState([]); // [{file, preview, isMain}]
  const [dragOver, setDragOver] = useState(false);

  // Variants state
  const [variants, setVariants] = useState([]);
  const [variantColors, setVariantColors] = useState([]);
  const [variantSizes, setVariantSizes] = useState([]);

  // Custom attribute temp
  const [newAttrKey, setNewAttrKey] = useState('');
  const [newAttrValue, setNewAttrValue] = useState('');
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user || !isAdmin()) { navigate('/login'); return; }
    fetchCategories();
    if (isEditing) loadProduct();
  }, [id]);

  const fetchCategories = async () => {
    try {
      const res = await categoryAPI.getAll();
      if (res.data.success) setCategories(res.data.data);
    } catch (e) { console.error(e); }
  };

  const loadProduct = async () => {
    try {
      const res = await productAPI.getById(id);
      if (res.data.success) {
        const p = res.data.data;
        setForm({
          name: p.name || '', slug: p.slug || '', brand: p.brand || '',
          categoryId: p.category?.id || '', shortDescription: p.shortDescription || '',
          description: p.description || '', price: p.price || '', salePrice: p.salePrice || '',
          stockQuantity: p.stockQuantity || '', lowStockThreshold: p.lowStockThreshold || 5,
          sku: p.sku || '', barcode: p.barcode || '', storeLocation: p.storeLocation || '',
          weight: p.weight || '', dimensions: p.dimensions || '',
          material: p.material || '', careInstructions: p.careInstructions || '',
          season: p.season || '', gender: p.gender || '',
          metaTitle: p.metaTitle || '', metaDescription: p.metaDescription || '',
          isFeatured: p.isFeatured || false, isActive: p.isActive ?? true,
          isNewArrival: p.isNewArrival || false,
          tags: p.tags || [], attributes: p.attributes || []
        });
        if (p.images) {
          setImages(p.images.map((url, i) => ({ file: null, preview: url, isMain: i === 0 })));
        }
        if (p.variants) {
          setVariants(p.variants);
          const colors = [...new Set(p.variants.map(v => v.color))];
          const sizes = [...new Set(p.variants.map(v => v.size))];
          setVariantColors(colors);
          setVariantSizes(sizes);
        }
      }
    } catch (e) { toast.error('Failed to load product'); }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (name === 'name' && !isEditing) {
      setForm(prev => ({
        ...prev, name: value,
        slug: value.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
      }));
    }
  };

  // ---- IMAGE HANDLING ----
  const handleImageUpload = (files) => {
    const newImages = Array.from(files).slice(0, 8 - images.length).map(file => ({
      file, preview: URL.createObjectURL(file), isMain: images.length === 0
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const handleFileInput = (e) => { if (e.target.files) handleImageUpload(e.target.files); };
  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files) handleImageUpload(e.dataTransfer.files); };
  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);

  const removeImage = (index) => {
    setImages(prev => {
      const updated = prev.filter((_, i) => i !== index);
      if (updated.length > 0 && !updated.some(img => img.isMain)) updated[0].isMain = true;
      return updated;
    });
  };

  const setMainImage = (index) => {
    setImages(prev => prev.map((img, i) => ({ ...img, isMain: i === index })));
  };

  const moveImage = (index, direction) => {
    setImages(prev => {
      const arr = [...prev];
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= arr.length) return arr;
      [arr[index], arr[newIndex]] = [arr[newIndex], arr[index]];
      return arr;
    });
  };

  // ---- VARIANTS ----
  const generateVariants = () => {
    if (variantColors.length === 0 || variantSizes.length === 0) {
      toast.error('Select at least one color and one size'); return;
    }
    const newVariants = [];
    variantColors.forEach(color => {
      variantSizes.forEach(size => {
        const exists = variants.find(v => v.color === color && v.size === size);
        newVariants.push(exists || { color, size, price: form.price ? Number(form.price) : null, stockQuantity: 0, sku: `${form.sku || 'SKU'}-${color.substring(0, 2).toUpperCase()}-${size}` });
      });
    });
    setVariants(newVariants);
    toast.success(`${newVariants.length} variants generated`);
  };

  const updateVariant = (index, field, value) => {
    setVariants(prev => prev.map((v, i) => i === index ? { ...v, [field]: value } : v));
  };

  const removeVariant = (index) => {
    setVariants(prev => prev.filter((_, i) => i !== index));
  };

  // ---- TAGS ----
  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  // ---- CUSTOM ATTRIBUTES ----
  const addAttribute = () => {
    if (newAttrKey.trim() && newAttrValue.trim()) {
      setForm(prev => ({ ...prev, attributes: [...prev.attributes, { key: newAttrKey, value: newAttrValue }] }));
      setNewAttrKey(''); setNewAttrValue('');
    }
  };

  const removeAttribute = (index) => {
    setForm(prev => ({ ...prev, attributes: prev.attributes.filter((_, i) => i !== index) }));
  };

  // ---- SAVE ----
  const handleSave = async () => {
    if (!form.name || !form.price || !form.categoryId) {
      toast.error('Please fill required fields: Name, Price, Category'); return;
    }
    setSaving(true);
    try {
      const productData = {
        name: form.name, slug: form.slug, brand: form.brand,
        category: { id: Number(form.categoryId) },
        shortDescription: form.shortDescription, description: form.description,
        price: Number(form.price),
        salePrice: form.salePrice ? Number(form.salePrice) : null,
        stockQuantity: Number(form.stockQuantity) || 0,
        lowStockThreshold: Number(form.lowStockThreshold) || 5,
        sku: form.sku, barcode: form.barcode, storeLocation: form.storeLocation,
        weight: form.weight ? Number(form.weight) : null,
        dimensions: form.dimensions,
        material: form.material, careInstructions: form.careInstructions,
        season: form.season, gender: form.gender || null,
        metaTitle: form.metaTitle, metaDescription: form.metaDescription,
        isFeatured: form.isFeatured, isActive: form.isActive, isNewArrival: form.isNewArrival,
        tags: form.tags, attributes: form.attributes,
        mainImage: images.find(img => img.isMain)?.preview || '',
        images: images.map(img => img.preview),
        variants: variants.map(v => ({ ...v, id: v.id || null }))
      };

      const imageFiles = images.filter(img => img.file).map(img => img.file);

      if (imageFiles.length > 0) {
        const formData = new FormData();
        formData.append('product', new Blob([JSON.stringify(productData)], { type: 'application/json' }));
        imageFiles.forEach(file => formData.append('images', file));
        if (isEditing) {
          await productAPI.updateWithImages(id, formData);
          toast.success('Product updated');
        } else {
          await productAPI.createWithImages(formData);
          toast.success('Product created');
        }
      } else {
        if (isEditing) {
          await productAPI.update(id, productData);
          toast.success('Product updated');
        } else {
          await productAPI.create(productData);
          toast.success('Product created');
        }
      }
      navigate('/admin');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const discount = form.price && form.salePrice ? Math.round((1 - form.salePrice / form.price) * 100) : 0;
  const mainCategories = categories.filter(c => !c.parentId);
  const subCategories = categories.filter(c => c.parentId === Number(form.categoryId));

  if (!user) return null;

  return (
    <Container fluid className="py-4 add-product-page">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <Button variant="link" className="p-0 me-3 text-dark" onClick={() => navigate('/admin')}>
            <FiArrowLeft size={20} />
          </Button>
          <div>
            <h4 className="mb-0">{isEditing ? 'Edit Product' : 'Add New Product'}</h4>
            <small className="text-muted">{isEditing ? 'Update product information' : 'Fill in the details to create a new product'}</small>
          </div>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" onClick={() => navigate('/admin')}>Cancel</Button>
          <Button className="btn-primary-custom" onClick={handleSave} disabled={saving}>
            {saving ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</> : <><FiSave className="me-2" />{isEditing ? 'Update Product' : 'Create Product'}</>}
          </Button>
        </div>
      </div>

      <Row className="g-4">
        {/* LEFT COLUMN - Main Form */}
        <Col lg={8}>
          {/* Basic Information */}
          <Card className="ap-card mb-4">
            <Card.Header className="ap-card-header"><FiPackage className="me-2" />Basic Information</Card.Header>
            <Card.Body>
              <Row className="g-3">
                <Col md={8}>
                  <Form.Group><Form.Label>Product Name *</Form.Label>
                    <Form.Control name="name" value={form.name} onChange={handleChange} placeholder="e.g., Floral Summer Dress" />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group><Form.Label>Slug (URL)</Form.Label>
                    <Form.Control name="slug" value={form.slug} onChange={handleChange} placeholder="auto-generated" />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group><Form.Label>Brand / Designer</Form.Label>
                    <Form.Control name="brand" value={form.brand} onChange={handleChange} placeholder="e.g., LankaThread" />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group><Form.Label>Main Category *</Form.Label>
                    <Form.Select name="categoryId" value={form.categoryId} onChange={handleChange}>
                      <option value="">Select category</option>
                      {mainCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group><Form.Label>Subcategory</Form.Label>
                    <Form.Select name="subCategory" value={form.subCategory || ''} onChange={handleChange}>
                      <option value="">Select subcategory</option>
                      {subCategories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group><Form.Label>Gender</Form.Label>
                    <Form.Select name="gender" value={form.gender} onChange={handleChange}>
                      <option value="">Select</option>
                      <option value="WOMEN">Women</option><option value="MEN">Men</option>
                      <option value="KIDS">Kids</option><option value="TEENS">Teens</option>
                      <option value="UNISEX">Unisex</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group><Form.Label>Season</Form.Label>
                    <Form.Select name="season" value={form.season} onChange={handleChange}>
                      <option value="">Select season</option>
                      {SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col xs={12}>
                  <Form.Group><Form.Label>Short Description</Form.Label>
                    <Form.Control name="shortDescription" value={form.shortDescription} onChange={handleChange} placeholder="Brief summary (max 500 chars)" maxLength={500} />
                  </Form.Group>
                </Col>
                <Col xs={12}>
                  <Form.Group><Form.Label>Full Description</Form.Label>
                    <Form.Control as="textarea" rows={5} name="description" value={form.description} onChange={handleChange} placeholder="Detailed product description..." />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Pricing & Inventory */}
          <Card className="ap-card mb-4">
            <Card.Header className="ap-card-header"><FiDollarSign className="me-2" />Pricing & Inventory</Card.Header>
            <Card.Body>
              <Row className="g-3">
                <Col md={3}><Form.Group><Form.Label>Price (LKR) *</Form.Label>
                  <Form.Control type="number" name="price" value={form.price} onChange={handleChange} placeholder="0.00" />
                </Form.Group></Col>
                <Col md={3}><Form.Group><Form.Label>Sale Price (LKR)</Form.Label>
                  <Form.Control type="number" name="salePrice" value={form.salePrice} onChange={handleChange} placeholder="0.00" />
                  {discount > 0 && <small className="text-success">{discount}% discount</small>}
                </Form.Group></Col>
                <Col md={3}><Form.Group><Form.Label>Stock Quantity</Form.Label>
                  <Form.Control type="number" name="stockQuantity" value={form.stockQuantity} onChange={handleChange} placeholder="0" />
                </Form.Group></Col>
                <Col md={3}><Form.Group><Form.Label>Low Stock Alert</Form.Label>
                  <Form.Control type="number" name="lowStockThreshold" value={form.lowStockThreshold} onChange={handleChange} />
                </Form.Group></Col>
                <Col md={4}><Form.Group><Form.Label>SKU</Form.Label>
                  <Form.Control name="sku" value={form.sku} onChange={handleChange} placeholder="Auto or manual" />
                </Form.Group></Col>
                <Col md={4}><Form.Group><Form.Label>Barcode</Form.Label>
                  <Form.Control name="barcode" value={form.barcode} onChange={handleChange} placeholder="e.g., LT001001" />
                </Form.Group></Col>
                <Col md={4}><Form.Group><Form.Label>Store Location</Form.Label>
                  <Form.Control name="storeLocation" value={form.storeLocation} onChange={handleChange} placeholder="e.g., Aisle-1-Shelf-A" />
                </Form.Group></Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Media */}
          <Card className="ap-card mb-4">
            <Card.Header className="ap-card-header"><FiImage className="me-2" />Media ({images.length}/8 images)</Card.Header>
            <Card.Body>
              <div
                className={`ap-dropzone ${dragOver ? 'drag-over' : ''}`}
                onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
              >
                <FiUpload size={32} className="mb-2" />
                <p className="mb-1">Drag & drop images here or click to browse</p>
                <small className="text-muted">PNG, JPG, WEBP up to 10MB each. Max 8 images.</small>
                <input ref={fileInputRef} type="file" multiple accept="image/*" className="d-none" onChange={handleFileInput} />
              </div>

              {images.length > 0 && (
                <Row className="g-3 mt-3">
                  {images.map((img, index) => (
                    <Col key={index} xs={6} md={3}>
                      <div className={`ap-image-item ${img.isMain ? 'is-main' : ''}`}>
                        <img src={img.preview} alt="" className="ap-image-preview" />
                        {img.isMain && <Badge className="ap-main-badge">Main</Badge>}
                        <div className="ap-image-actions">
                          {!img.isMain && <Button size="sm" variant="link" className="p-0" onClick={() => setMainImage(index)} title="Set as main"><FiStar size={14} /></Button>}
                          {index > 0 && <Button size="sm" variant="link" className="p-0" onClick={() => moveImage(index, 'up')}><FiChevronUp size={14} /></Button>}
                          {index < images.length - 1 && <Button size="sm" variant="link" className="p-0" onClick={() => moveImage(index, 'down')}><FiChevronDown size={14} /></Button>}
                          <Button size="sm" variant="link" className="p-0 text-danger" onClick={() => removeImage(index)}><FiTrash2 size={14} /></Button>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              )}
            </Card.Body>
          </Card>

          {/* Variants */}
          <Card className="ap-card mb-4">
            <Card.Header className="ap-card-header d-flex justify-content-between align-items-center">
              <span><FiPackage className="me-2" />Variants (Color + Size)</span>
              <Button size="sm" variant="outline-primary" onClick={generateVariants}><FiPlus size={14} className="me-1" />Generate</Button>
            </Card.Header>
            <Card.Body>
              <Row className="g-3 mb-3">
                <Col md={6}>
                  <Form.Label>Colors</Form.Label>
                  <div className="ap-chip-container">
                    {AVAILABLE_COLORS.map(color => (
                      <Badge key={color} variant={variantColors.includes(color) ? 'primary' : 'outline-secondary'} className="ap-chip" onClick={() => setVariantColors(prev => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color])}>{color}</Badge>
                    ))}
                  </div>
                </Col>
                <Col md={6}>
                  <Form.Label>Sizes</Form.Label>
                  <div className="ap-chip-container">
                    {AVAILABLE_SIZES.map(size => (
                      <Badge key={size} variant={variantSizes.includes(size) ? 'primary' : 'outline-secondary'} className="ap-chip" onClick={() => setVariantSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size])}>{size}</Badge>
                    ))}
                  </div>
                </Col>
              </Row>

              {variants.length > 0 && (
                <div className="table-responsive">
                  <table className="table table-sm ap-variant-table">
                    <thead><tr><th>Color</th><th>Size</th><th>Price</th><th>Stock</th><th>SKU</th><th></th></tr></thead>
                    <tbody>
                      {variants.map((v, i) => (
                        <tr key={i}>
                          <td>{v.color}</td><td>{v.size}</td>
                          <td><Form.Control size="sm" type="number" value={v.price || ''} onChange={e => updateVariant(i, 'price', e.target.value)} style={{ width: 100 }} /></td>
                          <td><Form.Control size="sm" type="number" value={v.stockQuantity || 0} onChange={e => updateVariant(i, 'stockQuantity', Number(e.target.value))} style={{ width: 80 }} /></td>
                          <td><Form.Control size="sm" value={v.sku || ''} onChange={e => updateVariant(i, 'sku', e.target.value)} style={{ width: 120 }} /></td>
                          <td><Button size="sm" variant="link" className="p-0 text-danger" onClick={() => removeVariant(i)}><FiX size={14} /></Button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* RIGHT COLUMN - Sidebar */}
        <Col lg={4}>
          {/* Status */}
          <Card className="ap-card mb-4">
            <Card.Header className="ap-card-header">Status</Card.Header>
            <Card.Body>
              <Form.Check type="switch" name="isActive" label="Active" checked={form.isActive} onChange={handleChange} className="mb-2" />
              <Form.Check type="switch" name="isFeatured" label="Featured Product" checked={form.isFeatured} onChange={handleChange} className="mb-2" />
              <Form.Check type="switch" name="isNewArrival" label="New Arrival" checked={form.isNewArrival} onChange={handleChange} />
            </Card.Body>
          </Card>

          {/* Product Details */}
          <Card className="ap-card mb-4">
            <Card.Header className="ap-card-header">Details</Card.Header>
            <Card.Body>
              <Form.Group className="mb-3"><Form.Label>Material</Form.Label>
                <Form.Control name="material" value={form.material} onChange={handleChange} placeholder="e.g., 100% Cotton" />
              </Form.Group>
              <Form.Group className="mb-3"><Form.Label>Care Instructions</Form.Label>
                <Form.Control as="textarea" rows={2} name="careInstructions" value={form.careInstructions} onChange={handleChange} placeholder="e.g., Machine wash cold" />
              </Form.Group>
              <Row className="g-2">
                <Col xs={6}><Form.Group><Form.Label>Weight (kg)</Form.Label>
                  <Form.Control type="number" name="weight" value={form.weight} onChange={handleChange} placeholder="0.5" step="0.01" />
                </Form.Group></Col>
                <Col xs={6}><Form.Group><Form.Label>Dimensions</Form.Label>
                  <Form.Control name="dimensions" value={form.dimensions} onChange={handleChange} placeholder="LxWxH cm" />
                </Form.Group></Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Tags */}
          <Card className="ap-card mb-4">
            <Card.Header className="ap-card-header"><FiTag className="me-2" />Tags</Card.Header>
            <Card.Body>
              <div className="d-flex gap-2 mb-2">
                <Form.Control size="sm" value={tagInput} onChange={e => setTagInput(e.target.value)} placeholder="Add tag..." onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} />
                <Button size="sm" variant="outline-primary" onClick={addTag}><FiPlus /></Button>
              </div>
              <div className="d-flex flex-wrap gap-1">
                {form.tags.map(tag => (
                  <Badge key={tag} bg="light" className="ap-tag-badge">
                    {tag} <Button variant="link" className="p-0 ms-1 text-danger" onClick={() => removeTag(tag)}><FiX size={10} /></Button>
                  </Badge>
                ))}
              </div>
            </Card.Body>
          </Card>

          {/* Custom Attributes */}
          <Card className="ap-card mb-4">
            <Card.Header className="ap-card-header">Custom Attributes</Card.Header>
            <Card.Body>
              {form.attributes.map((attr, i) => (
                <div key={i} className="d-flex gap-2 mb-2 align-items-center">
                  <strong className="small">{attr.key}:</strong>
                  <span className="small flex-grow-1">{attr.value}</span>
                  <Button size="sm" variant="link" className="p-0 text-danger" onClick={() => removeAttribute(i)}><FiX size={12} /></Button>
                </div>
              ))}
              <Row className="g-2">
                <Col xs={4}><Form.Control size="sm" value={newAttrKey} onChange={e => setNewAttrKey(e.target.value)} placeholder="Key" /></Col>
                <Col xs={5}><Form.Control size="sm" value={newAttrValue} onChange={e => setNewAttrValue(e.target.value)} placeholder="Value" /></Col>
                <Col xs={3}><Button size="sm" variant="outline-primary" className="w-100" onClick={addAttribute}><FiPlus /></Button></Col>
              </Row>
              <small className="text-muted d-block mt-2">e.g., Author: Jane Doe, ISBN: 123, Pages: 250</small>
            </Card.Body>
          </Card>

          {/* SEO */}
          <Card className="ap-card mb-4">
            <Card.Header className="ap-card-header"><FiSearch className="me-2" />SEO</Card.Header>
            <Card.Body>
              <Form.Group className="mb-3"><Form.Label>Meta Title</Form.Label>
                <Form.Control name="metaTitle" value={form.metaTitle} onChange={handleChange} placeholder="SEO title" />
              </Form.Group>
              <Form.Group className="mb-3"><Form.Label>Meta Description</Form.Label>
                <Form.Control as="textarea" rows={2} name="metaDescription" value={form.metaDescription} onChange={handleChange} placeholder="SEO description" maxLength={500} />
              </Form.Group>
              {form.slug && (
                <div className="ap-seo-preview">
                  <small className="text-muted">URL Preview:</small>
                  <div className="ap-url-preview">lankathread.com/products/{form.slug}</div>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Save Button (sticky) */}
          <div className="ap-sticky-save">
            <Button className="btn-primary-custom w-100" onClick={handleSave} disabled={saving} size="lg">
              {saving ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</> : <><FiSave className="me-2" />{isEditing ? 'Update Product' : 'Create Product'}</>}
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AddProduct;
