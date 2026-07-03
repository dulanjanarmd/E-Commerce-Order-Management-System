// LankaThread - Mock Data

const DB = {
  products: [
    { id: 1, name: 'Floral Summer Dress', slug: 'floral-summer-dress', price: 4590, salePrice: 3290, mainImage: 'images/hero-fashion.jpg', brand: 'LankaThread', gender: 'WOMEN', category: 'Dresses', sizes: ['S','M','L','XL'], colors: ['Pink','Blue','White'], material: '100% Cotton', care: 'Machine wash cold', stock: 15, sizeStock: {S:5,M:8,L:2,XL:0}, isNew: true, isFeatured: true, desc: 'A beautiful floral summer dress perfect for the Sri Lankan climate. Made from lightweight, breathable cotton fabric with a flattering A-line silhouette.' },
    { id: 2, name: 'Classic Linen Shirt', slug: 'classic-linen-shirt', price: 3890, mainImage: 'images/mens-shirt.jpg', brand: 'LankaThread', gender: 'MEN', category: 'Shirts', sizes: ['M','L','XL','XXL'], colors: ['White','Blue','Beige'], material: '100% Linen', care: 'Machine wash cold', stock: 20, sizeStock: {M:10,L:7,XL:3,XXL:0}, isNew: false, isFeatured: true, desc: 'Premium quality linen shirt perfect for tropical weather. Breathable and comfortable for all-day wear.' },
    { id: 3, name: 'Kids Tropical T-Shirt', slug: 'kids-tropical-tshirt', price: 1890, mainImage: 'images/kids-tshirt.jpg', brand: 'LankaThread', gender: 'KIDS', category: 'T-Shirts', sizes: ['XS','S','M'], colors: ['Yellow','Green','Red'], material: '100% Cotton', care: 'Machine wash cold', stock: 30, sizeStock: {XS:12,S:10,M:8}, isNew: true, isFeatured: false, desc: 'Fun and colorful tropical print t-shirt for kids. Soft cotton fabric gentle on sensitive skin.' },
    { id: 4, name: 'Teen Denim Jacket', slug: 'teen-denim-jacket', price: 5990, salePrice: 4590, mainImage: 'images/teen-jacket.jpg', brand: 'LankaThread', gender: 'TEENS', category: 'Jackets', sizes: ['S','M','L'], colors: ['Blue'], material: 'Denim', care: 'Machine wash cold', stock: 8, sizeStock: {S:3,M:4,L:1}, isNew: false, isFeatured: true, desc: 'Stylish denim jacket with modern patches and distressed details. Perfect for layering.' },
    { id: 5, name: 'Traditional Kandyan Saree', slug: 'traditional-kandyan-saree', price: 12500, mainImage: 'images/saree.jpg', brand: 'Heritage', gender: 'WOMEN', category: 'Sarees', sizes: ['Free Size'], colors: ['Red','Gold'], material: 'Silk Blend', care: 'Dry clean only', stock: 5, sizeStock: {'Free Size':5}, isNew: true, isFeatured: true, desc: 'Exquisite handwoven Kandyan saree in rich colors with traditional motifs. Perfect for weddings and special occasions.' },
    { id: 6, name: 'Emerald Embroidered Kurti', slug: 'emerald-embroidered-kurti', price: 4590, mainImage: 'images/kurti.jpg', brand: 'Heritage', gender: 'WOMEN', category: 'Kurtis', sizes: ['S','M','L','XL'], colors: ['Green','Purple'], material: 'Cotton Silk', care: 'Machine wash cold', stock: 12, sizeStock: {S:4,M:5,L:2,XL:1}, isNew: true, isFeatured: false, desc: 'Elegant emerald green kurti with delicate gold embroidery. Perfect for festive occasions.' },
    { id: 7, name: 'Casual Polo Shirt', slug: 'casual-polo-shirt', price: 2890, mainImage: 'images/mens-shirt.jpg', brand: 'LankaThread', gender: 'MEN', category: 'T-Shirts', sizes: ['S','M','L','XL'], colors: ['Black','White','Navy'], material: 'Cotton Pique', care: 'Machine wash cold', stock: 25, sizeStock: {S:8,M:10,L:5,XL:2}, isNew: false, isFeatured: false, desc: 'Classic polo shirt in versatile colors. Comfortable fit for everyday wear.' },
    { id: 8, name: 'Party Wear Gown', slug: 'party-wear-gown', price: 8500, salePrice: 7200, mainImage: 'images/hero-fashion.jpg', brand: 'LankaThread', gender: 'WOMEN', category: 'Dresses', sizes: ['S','M','L'], colors: ['Black','Red'], material: 'Chiffon', care: 'Dry clean only', stock: 6, sizeStock: {S:2,M:3,L:1}, isNew: true, isFeatured: true, desc: 'Stunning evening gown for special occasions. Elegant design with flowing silhouette.' },
    { id: 9, name: 'Winter Hoodie', slug: 'winter-hoodie', price: 4200, salePrice: 3500, mainImage: 'images/teen-jacket.jpg', brand: 'LankaThread', gender: 'TEENS', category: 'Hoodies', sizes: ['S','M','L','XL'], colors: ['Black','Grey','Blue'], material: 'Cotton Fleece', care: 'Machine wash cold', stock: 14, sizeStock: {S:4,M:6,L:3,XL:1}, isNew: false, isFeatured: true, desc: 'Cozy fleece-lined hoodie for cooler days. Available in trendy colors.' },
    { id: 10, name: 'Cotton Salwar Kameez', slug: 'cotton-salwar-kameez', price: 3800, mainImage: 'images/kurti.jpg', brand: 'Heritage', gender: 'WOMEN', category: 'Kurtis', sizes: ['S','M','L','XL'], colors: ['Pink','Blue','Green'], material: '100% Cotton', care: 'Machine wash cold', stock: 10, sizeStock: {S:3,M:4,L:2,XL:1}, isNew: true, isFeatured: false, desc: 'Comfortable and elegant cotton salwar kameez set. Perfect for daily wear.' },
    { id: 11, name: 'Beach Shorts', slug: 'beach-shorts', price: 2290, mainImage: 'images/kids-tshirt.jpg', brand: 'LankaThread', gender: 'MEN', category: 'Shorts', sizes: ['S','M','L'], colors: ['Blue','Green'], material: 'Polyester Blend', care: 'Machine wash cold', stock: 18, sizeStock: {S:6,M:8,L:4}, isNew: false, isFeatured: false, desc: 'Lightweight and quick-dry beach shorts perfect for Sri Lankan beaches.' },
    { id: 12, name: 'School Uniform Set', slug: 'school-uniform-set', price: 3500, mainImage: 'images/kids-tshirt.jpg', brand: 'LankaThread', gender: 'KIDS', category: 'School Wear', sizes: ['XS','S','M','L'], colors: ['White','Navy'], material: 'Polyester Cotton', care: 'Machine wash cold', stock: 40, sizeStock: {XS:15,S:12,M:10,L:3}, isNew: false, isFeatured: false, desc: 'Complete school uniform set including shirt, shorts/skirt, and tie.' }
  ],

  categories: [
    { id: 1, name: 'Women', slug: 'women', image: 'images/hero-fashion.jpg' },
    { id: 2, name: 'Men', slug: 'men', image: 'images/mens-shirt.jpg' },
    { id: 3, name: 'Kids', slug: 'kids', image: 'images/kids-tshirt.jpg' },
    { id: 4, name: 'Teens', slug: 'teens', image: 'images/teen-jacket.jpg' }
  ],

  orders: [
    { id: 1, orderNumber: 'LT1704067200000', status: 'DELIVERED', payment: 'COD', total: 8230, date: '2024-12-28', items: [{name:'Floral Summer Dress',qty:1,price:3290,img:'images/hero-fashion.jpg'},{name:'Classic Linen Shirt',qty:1,price:3890,img:'images/mens-shirt.jpg'}] },
    { id: 2, orderNumber: 'LT1704153600000', status: 'SHIPPED', payment: 'COD', total: 5990, date: '2024-12-30', items: [{name:'Teen Denim Jacket',qty:1,price:4590,img:'images/teen-jacket.jpg'}] },
    { id: 3, orderNumber: 'LT1704240000000', status: 'PENDING', payment: 'COD', total: 12500, date: '2025-01-02', items: [{name:'Traditional Kandyan Saree',qty:1,price:12500,img:'images/saree.jpg'}] }
  ]
};

// Cart management
const Cart = {
  items: JSON.parse(localStorage.getItem('cart') || '[]'),
  
  save() {
    localStorage.setItem('cart', JSON.stringify(this.items));
    this.updateBadge();
  },
  
  add(product, size, color, qty = 1) {
    const existing = this.items.find(i => i.id === product.id && i.size === size && i.color === color);
    if (existing) {
      existing.qty += qty;
    } else {
      this.items.push({ id: product.id, name: product.name, price: product.salePrice || product.price, image: product.mainImage, size, color, qty, slug: product.slug });
    }
    this.save();
    showToast('Added to cart!', 'success');
  },
  
  remove(id, size, color) {
    this.items = this.items.filter(i => !(i.id === id && i.size === size && i.color === color));
    this.save();
  },
  
  updateQty(id, size, color, qty) {
    const item = this.items.find(i => i.id === id && i.size === size && i.color === color);
    if (item) item.qty = qty;
    this.save();
  },
  
  clear() {
    this.items = [];
    this.save();
  },
  
  count() {
    return this.items.reduce((s, i) => s + i.qty, 0);
  },
  
  total() {
    return this.items.reduce((s, i) => s + i.price * i.qty, 0);
  },
  
  updateBadge() {
    const badges = [document.getElementById('cartBadge'), document.getElementById('mobileCartBadge')];
    const count = this.count();
    badges.forEach(b => {
      if (b) { b.textContent = count; b.style.display = count > 0 ? 'inline' : 'none'; }
    });
  }
};

// Wishlist management
const Wishlist = {
  items: JSON.parse(localStorage.getItem('wishlist') || '[]'),
  
  toggle(productId) {
    const idx = this.items.indexOf(productId);
    if (idx > -1) { this.items.splice(idx, 1); showToast('Removed from wishlist', 'info'); }
    else { this.items.push(productId); showToast('Added to wishlist!', 'success'); }
    localStorage.setItem('wishlist', JSON.stringify(this.items));
    return idx === -1;
  },
  
  has(productId) {
    return this.items.includes(productId);
  }
};

// Toast notifications
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const colors = { success: 'bg-success', info: 'bg-primary', error: 'bg-danger' };
  const toast = document.createElement('div');
  toast.className = `toast align-items-center text-white ${colors[type] || colors.info} border-0 show`;
  toast.innerHTML = `<div class="d-flex"><div class="toast-body">${message}</div><button type="button" class="btn-close btn-close-white me-2 m-auto" onclick="this.parentElement.parentElement.remove()"></button></div>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}
