// LankaThread - Main Application

const app = document.getElementById('app');
let currentUser = JSON.parse(localStorage.getItem('user') || 'null');

// Router
const router = {
  currentPage: 'home',
  params: {},
  
  navigate(page, params = {}) {
    this.currentPage = page;
    this.params = params;
    window.scrollTo(0, 0);
    
    const navbar = document.querySelector('.navbar-collapse');
    if (navbar.classList.contains('show')) {
      navbar.classList.remove('show');
    }
    
    this.render();
  },
  
  render() {
    this.updateAuthUI();
    Cart.updateBadge();
    
    switch(this.currentPage) {
      case 'home': renderHome(); break;
      case 'products': renderProducts(); break;
      case 'product': renderProductDetail(); break;
      case 'cart': renderCart(); break;
      case 'checkout': renderCheckout(); break;
      case 'login': renderLogin(); break;
      case 'register': renderRegister(); break;
      case 'profile': renderProfile(); break;
      case 'orders': renderOrders(); break;
      case 'wishlist': renderWishlist(); break;
      case 'admin': renderAdmin(); break;
      default: renderHome();
    }
  },
  
  updateAuthUI() {
    const loginBtn = document.getElementById('loginBtn');
    const userDropdown = document.getElementById('userDropdown');
    if (currentUser) {
      loginBtn.classList.add('d-none');
      userDropdown.classList.remove('d-none');
    } else {
      loginBtn.classList.remove('d-none');
      userDropdown.classList.add('d-none');
    }
  }
};

// ===== HOME PAGE =====
function renderHome() {
  const featured = DB.products.filter(p => p.isFeatured).slice(0, 4);
  const arrivals = DB.products.filter(p => p.isNew).slice(0, 4);
  
  app.innerHTML = `
    <!-- Hero -->
    <section class="hero-section">
      <div class="hero-overlay"></div>
      <div class="container hero-content">
        <div class="row align-items-center min-vh-80">
          <div class="col-lg-6 hero-text">
            <span class="hero-subtitle">New Collection 2024</span>
            <h1 class="hero-title">Discover Your<span class="text-gold"> Style</span></h1>
            <p class="hero-description">Premium fashion for the entire family. From traditional elegance to modern trends, find your perfect look at LankaThread. Island-wide delivery with Cash on Delivery.</p>
            <div class="hero-buttons">
              <a href="#" class="btn btn-primary-custom" onclick="router.navigate('products')">Shop Now <i class="bi bi-arrow-right"></i></a>
              <a href="#" class="btn btn-outline-custom" onclick="router.navigate('products', {newArrivals:true})">New Arrivals</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories -->
    <section class="categories-section py-5">
      <div class="container">
        <div class="text-center mb-5">
          <h2 class="section-title">Shop by Category</h2>
          <p class="section-subtitle">Find exactly what you are looking for</p>
        </div>
        <div class="row g-4">
          ${DB.categories.map(cat => `
            <div class="col-6 col-md-3">
              <a href="#" class="category-card-link" onclick="router.navigate('products', {gender:'${cat.name.toUpperCase()}'})">
                <div class="category-card">
                  <div class="category-img-wrapper">
                    <img src="${cat.image}" alt="${cat.name}" class="category-img">
                    <div class="category-overlay"></div>
                  </div>
                  <div class="category-info">
                    <h4 class="category-name">${cat.name}</h4>
                  </div>
                </div>
              </a>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Featured -->
    <section class="products-section py-5">
      <div class="container">
        <div class="section-header d-flex justify-content-between align-items-center mb-4">
          <div><h2 class="section-title">Featured Products</h2><p class="section-subtitle">Handpicked styles just for you</p></div>
          <a href="#" class="view-all-link" onclick="router.navigate('products')">View All <i class="bi bi-arrow-right"></i></a>
        </div>
        <div class="row g-4">
          ${featured.map(p => productCard(p)).join('')}
        </div>
      </div>
    </section>

    <!-- Banner -->
    <section class="banner-section">
      <div class="container text-center">
        <span class="banner-subtitle">Summer Sale</span>
        <h2 class="banner-title">Up to 50% Off</h2>
        <p class="banner-text">On selected summer styles. Limited time offer!</p>
        <a href="#" class="btn btn-primary-custom" onclick="router.navigate('products')">Shop the Sale</a>
      </div>
    </section>

    <!-- New Arrivals -->
    <section class="products-section py-5">
      <div class="container">
        <div class="section-header d-flex justify-content-between align-items-center mb-4">
          <div><h2 class="section-title">New Arrivals</h2><p class="section-subtitle">The latest additions to our collection</p></div>
          <a href="#" class="view-all-link" onclick="router.navigate('products', {newArrivals:true})">View All <i class="bi bi-arrow-right"></i></a>
        </div>
        <div class="row g-4">
          ${arrivals.map(p => productCard(p)).join('')}
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="features-section py-5">
      <div class="container">
        <div class="row g-4">
          ${[
            {icon:'bi-bag',title:'Island-wide Delivery',desc:'Free delivery for orders over LKR 5,000'},
            {icon:'bi-truck',title:'Fast Shipping',desc:'2-5 business days delivery'},
            {icon:'bi-headset',title:'24/7 Support',desc:'WhatsApp support available'},
            {icon:'bi-shield-check',title:'Secure Payments',desc:'COD & card payments accepted'}
          ].map(f => `
            <div class="col-6 col-md-3">
              <div class="feature-card text-center">
                <div class="feature-icon"><i class="bi ${f.icon}"></i></div>
                <h5 class="feature-title">${f.title}</h5>
                <p class="feature-desc">${f.desc}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

// ===== PRODUCTS PAGE =====
function renderProducts() {
  let filtered = [...DB.products];
  const { gender, search, newArrivals, category } = router.params;
  
  if (gender) filtered = filtered.filter(p => p.gender === gender);
  if (search) filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  if (newArrivals) filtered = filtered.filter(p => p.isNew);
  
  const pageTitle = gender ? `${gender.charAt(0)+gender.slice(1).toLowerCase()}'s Collection` : 
                     search ? `Search: "${search}"` : newArrivals ? 'New Arrivals' : 'All Products';
  
  app.innerHTML = `
    <div class="container py-4">
      <h1 class="page-title mb-4">${pageTitle}</h1>
      <div class="row">
        <div class="col-lg-3 mb-4">
          <div class="filters-panel">
            <h6 class="filter-title">Filter By</h6>
            <div class="mb-3">
              <label class="form-label small">Gender</label>
              <select class="form-select form-select-sm" onchange="filterProducts('gender', this.value)">
                <option value="">All</option>
                <option value="WOMEN" ${gender==='WOMEN'?'selected':''}>Women</option>
                <option value="MEN" ${gender==='MEN'?'selected':''}>Men</option>
                <option value="KIDS" ${gender==='KIDS'?'selected':''}>Kids</option>
                <option value="TEENS" ${gender==='TEENS'?'selected':''}>Teens</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label small">Price Range (LKR)</label>
              <div class="d-flex gap-2">
                <input type="number" class="form-control form-control-sm" placeholder="Min" id="minPrice">
                <input type="number" class="form-control form-control-sm" placeholder="Max" id="maxPrice">
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label small">Size</label>
              <div class="filter-chips">
                ${['XS','S','M','L','XL','XXL'].map(s => `<button class="btn btn-outline-dark btn-sm filter-chip" onclick="toggleChip(this)">${s}</button>`).join('')}
              </div>
            </div>
            <div class="mb-3">
              <div class="form-check"><input class="form-check-input" type="checkbox" id="inStockFilter"><label class="form-check-label small" for="inStockFilter">In Stock Only</label></div>
              <div class="form-check"><input class="form-check-input" type="checkbox" id="newFilter" ${newArrivals?'checked':''}><label class="form-check-label small" for="newFilter">New Arrivals</label></div>
            </div>
            <button class="btn btn-primary-custom w-100 btn-sm" onclick="applyFilters()">Apply Filters</button>
          </div>
        </div>
        <div class="col-lg-9">
          <p class="results-count">${filtered.length} products found</p>
          <div class="row g-4">
            ${filtered.length ? filtered.map(p => productCard(p)).join('') : '<div class="col-12 text-center py-5"><h4>No products found</h4></div>'}
          </div>
        </div>
      </div>
    </div>
  `;
}

// ===== PRODUCT DETAIL PAGE =====
function renderProductDetail() {
  const slug = router.params.slug;
  const product = DB.products.find(p => p.slug === slug);
  if (!product) { router.navigate('products'); return; }
  
  const inWishlist = Wishlist.has(product.id);
  
  app.innerHTML = `
    <div class="container py-4 product-detail-page">
      <nav class="breadcrumb-custom mb-4">
        <a href="#" onclick="router.navigate('home')">Home</a> <span>/</span>
        <a href="#" onclick="router.navigate('products')">Products</a> <span>/</span>
        <a href="#" onclick="router.navigate('products', {gender:'${product.gender}'})">${product.gender}</a> <span>/</span>
        <span class="active">${product.name}</span>
      </nav>
      <div class="row">
        <div class="col-lg-6 mb-4">
          <div class="product-gallery">
            <div class="main-image-wrapper position-relative">
              <img src="${product.mainImage}" alt="${product.name}" class="main-image">
              ${product.salePrice ? `<span class="badge bg-danger position-absolute top-0 start-0 m-3 px-3 py-2">-${Math.round((1-product.salePrice/product.price)*100)}% OFF</span>` : ''}
              ${product.isNew ? `<span class="badge bg-success position-absolute top-0 end-0 m-3 px-3 py-2">NEW</span>` : ''}
            </div>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="product-info">
            <span class="product-brand">${product.brand}</span>
            <h1 class="product-name">${product.name}</h1>
            <div class="product-price-lg mb-3">
              ${product.salePrice 
                ? `<span class="sale-price-lg">LKR ${product.salePrice.toLocaleString()}</span><span class="original-price-lg">LKR ${product.price.toLocaleString()}</span><span class="badge bg-success ms-2">Save LKR ${(product.price-product.salePrice).toLocaleString()}</span>`
                : `<span class="current-price-lg">LKR ${product.price.toLocaleString()}</span>`
              }
            </div>
            <p class="text-muted">${product.desc}</p>
            
            <div class="mb-3">
              <label class="form-label fw-medium">Size</label>
              <div class="size-options">
                ${product.sizes.map(s => {
                  const stock = product.sizeStock[s] || 0;
                  return `<button class="size-btn ${stock===0?'disabled':''}" ${stock===0?'disabled':''} onclick="selectSize(this,'${s}')" data-size="${s}">${s}${stock<=3&&stock>0?`<span class="stock-badge low">${stock}</span>`:''}${stock===0?'<span class="stock-badge">Out</span>':''}</button>`;
                }).join('')}
              </div>
            </div>
            
            <div class="mb-3">
              <label class="form-label fw-medium">Color</label>
              <div class="color-options">
                ${product.colors.map(c => `<button class="color-btn" onclick="selectColor(this,'${c}')" data-color="${c}"><span class="color-dot" style="background:${c.toLowerCase()}"></span>${c}</button>`).join('')}
              </div>
            </div>
            
            <div class="mb-4">
              <label class="form-label fw-medium">Quantity</label>
              <div class="quantity-selector">
                <button class="qty-btn" onclick="updateQty(-1)">-</button>
                <span class="qty-value" id="qtyValue">1</span>
                <button class="qty-btn" onclick="updateQty(1)">+</button>
              </div>
            </div>
            
            <div class="product-actions-lg mb-4">
              <button class="btn btn-add-cart" onclick="addToCart(${product.id})"><i class="bi bi-cart3 me-2"></i>Add to Cart</button>
              <button class="btn btn-buy-now" onclick="buyNow(${product.id})">Buy Now</button>
              <button class="btn btn-outline-dark" onclick="toggleWishlistBtn(${product.id}, this)"><i class="bi ${inWishlist?'heart-fill text-danger':'heart'}"></i></button>
            </div>
            
            <div class="trust-badges">
              <div class="trust-item"><i class="bi bi-truck"></i><span>Island-wide Delivery</span></div>
              <div class="trust-item"><i class="bi bi-shield-check"></i><span>Secure Payment</span></div>
              <div class="trust-item"><i class="bi bi-arrow-counterclockwise"></i><span>7-Day Returns</span></div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="row mt-5">
        <div class="col-12">
          <ul class="nav nav-tabs product-tabs" role="tablist">
            <li class="nav-item"><button class="nav-link active" data-bs-toggle="tab" data-bs-target="#details">Product Details</button></li>
            <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#size">Size Guide</button></li>
            <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#shipping">Shipping & Returns</button></li>
          </ul>
          <div class="tab-content pt-4">
            <div class="tab-pane fade show active" id="details">
              <p>${product.desc}</p>
              <table class="table table-borderless product-specs">
                <tr><td class="text-muted" style="width:30%">Brand</td><td>${product.brand}</td></tr>
                <tr><td class="text-muted">Category</td><td>${product.category}</td></tr>
                <tr><td class="text-muted">Gender</td><td>${product.gender}</td></tr>
                <tr><td class="text-muted">Material</td><td>${product.material}</td></tr>
                <tr><td class="text-muted">Care</td><td>${product.care}</td></tr>
              </table>
            </div>
            <div class="tab-pane fade" id="size">
              <h5>Size Chart (inches)</h5>
              <table class="table size-chart-table">
                <thead><tr><th>Size</th><th>Bust/Chest</th><th>Waist</th><th>Hip</th></tr></thead>
                <tbody>
                  <tr><td>XS</td><td>32-34</td><td>26-28</td><td>34-36</td></tr>
                  <tr><td>S</td><td>34-36</td><td>28-30</td><td>36-38</td></tr>
                  <tr><td>M</td><td>36-38</td><td>30-32</td><td>38-40</td></tr>
                  <tr><td>L</td><td>38-40</td><td>32-34</td><td>40-42</td></tr>
                  <tr><td>XL</td><td>40-42</td><td>34-36</td><td>42-44</td></tr>
                </tbody>
              </table>
            </div>
            <div class="tab-pane fade" id="shipping">
              <h5>Shipping Information</h5>
              <ul class="list-unstyled">
                <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>Free delivery for orders over LKR 5,000</li>
                <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>Colombo & Western Province: 1-2 business days</li>
                <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>Other provinces: 3-5 business days</li>
                <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>Cash on Delivery available island-wide</li>
              </ul>
              <h5 class="mt-4">Return Policy</h5>
              <ul class="list-unstyled">
                <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>7-day return policy for unused items</li>
                <li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>Items must be in original packaging</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ===== CART PAGE =====
function renderCart() {
  const items = Cart.items;
  const subtotal = Cart.total();
  const shipping = subtotal > 5000 ? 0 : 350;
  const total = subtotal + shipping;
  
  app.innerHTML = `
    <div class="container py-4">
      <h1 class="page-title mb-4">Shopping Cart</h1>
      ${items.length === 0 ? `
        <div class="text-center py-5">
          <i class="bi bi-bag fs-1 text-muted"></i>
          <h3 class="mt-3">Your cart is empty</h3>
          <p class="text-muted">Looks like you haven't added any items yet</p>
          <a href="#" class="btn btn-primary-custom" onclick="router.navigate('products')">Start Shopping <i class="bi bi-arrow-right"></i></a>
        </div>
      ` : `
        <div class="row">
          <div class="col-lg-8">
            <div class="cart-items">
              ${items.map(item => `
                <div class="cart-item">
                  <div class="row align-items-center">
                    <div class="col-3 col-md-2"><img src="${item.image}" alt="" class="cart-item-img"></div>
                    <div class="col-9 col-md-4">
                      <a href="#" class="cart-item-name" onclick="router.navigate('product', {slug:'${item.slug}'})">${item.name}</a>
                      <p class="text-muted small mb-0">${item.size ? `Size: ${item.size}` : ''} ${item.color ? `| Color: ${item.color}` : ''}</p>
                    </div>
                    <div class="col-6 col-md-3 mt-2 mt-md-0">
                      <div class="quantity-control">
                        <button class="qty-btn-sm" onclick="updateCartQty(${item.id}, '${item.size}', '${item.color}', ${item.qty-1})"><i class="bi bi-dash"></i></button>
                        <span class="qty-display">${item.qty}</span>
                        <button class="qty-btn-sm" onclick="updateCartQty(${item.id}, '${item.size}', '${item.color}', ${item.qty+1})"><i class="bi bi-plus"></i></button>
                      </div>
                    </div>
                    <div class="col-4 col-md-2 text-end mt-2 mt-md-0"><span class="cart-item-price">LKR ${(item.price * item.qty).toLocaleString()}</span></div>
                    <div class="col-2 col-md-1 text-end"><button class="btn btn-link text-danger p-0" onclick="removeCartItem(${item.id}, '${item.size}', '${item.color}')"><i class="bi bi-trash"></i></button></div>
                  </div>
                </div>
              `).join('')}
            </div>
            <div class="d-flex justify-content-between mt-3">
              <a href="#" class="btn btn-outline-dark btn-sm" onclick="router.navigate('products')">Continue Shopping</a>
              <button class="btn btn-link text-danger btn-sm" onclick="Cart.clear(); router.render(); showToast('Cart cleared', 'info');"><i class="bi bi-trash"></i> Clear Cart</button>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="cart-summary">
              <h4 class="summary-title">Order Summary</h4>
              <div class="summary-row"><span>Subtotal (${items.length} items)</span><span>LKR ${subtotal.toLocaleString()}</span></div>
              <div class="summary-row"><span>Shipping</span><span>${shipping===0?'FREE':`LKR ${shipping.toLocaleString()}`}</span></div>
              ${shipping===0?'<div class="free-shipping-msg"><i class="bi bi-heart-fill me-1"></i>You got free shipping!</div>':''}
              <div class="summary-divider"></div>
              <div class="summary-row total"><span>Total</span><span>LKR ${total.toLocaleString()}</span></div>
              <button class="btn btn-checkout w-100 mt-3" onclick="router.navigate('checkout')">Proceed to Checkout</button>
            </div>
          </div>
        </div>
      `}
    </div>
  `;
}

// ===== CHECKOUT PAGE =====
function renderCheckout() {
  const items = Cart.items;
  if (items.length === 0) { router.navigate('cart'); return; }
  const subtotal = Cart.total();
  const shipping = subtotal > 5000 ? 0 : 350;
  const total = subtotal + shipping;
  
  app.innerHTML = `
    <div class="container py-4">
      <h1 class="page-title mb-4">Checkout</h1>
      <div class="checkout-steps mb-4">
        <div class="step active"><div class="step-number">1</div><span>Shipping</span></div>
        <div class="step-line"></div>
        <div class="step"><div class="step-number">2</div><span>Payment</span></div>
        <div class="step-line"></div>
        <div class="step"><div class="step-number">3</div><span>Confirm</span></div>
      </div>
      <div class="row">
        <div class="col-lg-8">
          <div class="checkout-section">
            <h4 class="section-title"><i class="bi bi-geo-alt me-2"></i>Shipping Information</h4>
            <div class="row g-3">
              <div class="col-md-6"><label class="form-label">Full Name *</label><input type="text" class="form-control" id="shipName" value="${currentUser?.fullName||''}"></div>
              <div class="col-md-6"><label class="form-label">Phone *</label><input type="tel" class="form-control" id="shipPhone" placeholder="07X XXX XXXX"></div>
              <div class="col-12"><label class="form-label">Address *</label><textarea class="form-control" rows="2" id="shipAddress" placeholder="Street address"></textarea></div>
              <div class="col-md-6"><label class="form-label">City *</label>
                <select class="form-select" id="shipCity"><option value="">Select</option><option>Colombo</option><option>Kandy</option><option>Galle</option><option>Jaffna</option><option>Negombo</option></select>
              </div>
              <div class="col-md-6"><label class="form-label">District</label>
                <select class="form-select" id="shipDistrict"><option value="">Select</option><option>Colombo</option><option>Kandy</option><option>Galle</option></select>
              </div>
              <div class="col-12"><label class="form-label">Notes (Optional)</label><textarea class="form-control" rows="2" id="shipNotes" placeholder="Delivery instructions..."></textarea></div>
            </div>
            
            <h4 class="section-title mt-4"><i class="bi bi-credit-card me-2"></i>Payment Method</h4>
            <div class="payment-options">
              <div class="payment-option selected" onclick="selectPayment(this,'cod')">
                <div class="payment-radio"><div class="radio-circle"><div class="radio-dot"></div></div></div>
                <div class="payment-info"><h6>Cash on Delivery (COD)</h6><p class="text-muted mb-0">Pay when your order is delivered</p></div>
                <i class="bi bi-truck fs-4 text-muted"></i>
              </div>
              <div class="payment-option" onclick="selectPayment(this,'card')">
                <div class="payment-radio"><div class="radio-circle"></div></div>
                <div class="payment-info"><h6>Credit / Debit Card</h6><p class="text-muted mb-0">Visa, Mastercard accepted</p></div>
                <i class="bi bi-credit-card fs-4 text-muted"></i>
              </div>
            </div>
            
            <button class="btn btn-primary-custom mt-4" onclick="placeOrder()">Place Order</button>
          </div>
        </div>
        <div class="col-lg-4">
          <div class="checkout-summary">
            <h5 class="summary-title">Order Summary</h5>
            ${items.map(item => `
              <div class="summary-item">
                <div class="d-flex align-items-center"><img src="${item.image}" alt="" class="summary-item-img"><div><p class="mb-0 small">${item.name}</p><small class="text-muted">x${item.qty}</small></div></div>
                <span>LKR ${(item.price*item.qty).toLocaleString()}</span>
              </div>
            `).join('')}
            <div class="summary-divider"></div>
            <div class="summary-row"><span>Subtotal</span><span>LKR ${subtotal.toLocaleString()}</span></div>
            <div class="summary-row"><span>Shipping</span><span>${shipping===0?'FREE':`LKR ${shipping.toLocaleString()}`}</span></div>
            <div class="summary-divider"></div>
            <div class="summary-row total"><span>Total</span><span>LKR ${total.toLocaleString()}</span></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ===== LOGIN PAGE =====
function renderLogin() {
  app.innerHTML = `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="card auth-card border-0 shadow">
            <div class="card-body p-4 p-md-5">
              <div class="text-center mb-4">
                <h2 class="auth-title">Welcome Back</h2>
                <p class="text-muted">Sign in to your LankaThread account</p>
              </div>
              <button class="btn btn-outline-dark w-100 mb-4" onclick="googleLogin()">
                <i class="bi bi-google me-2"></i>Continue with Google
              </button>
              <div class="divider"><span>or sign in with email</span></div>
              <form onsubmit="handleLogin(event)">
                <div class="mb-3"><label class="form-label"><i class="bi bi-envelope me-1"></i>Email</label><input type="email" class="form-control" id="loginEmail" required placeholder="your@email.com"></div>
                <div class="mb-4"><label class="form-label"><i class="bi bi-lock me-1"></i>Password</label><input type="password" class="form-control" id="loginPassword" required placeholder="Password"></div>
                <button type="submit" class="btn btn-primary-custom w-100">Sign In</button>
              </form>
              <p class="text-center mt-3 mb-0">Don't have an account? <a href="#" class="auth-link" onclick="router.navigate('register')">Create Account</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ===== REGISTER PAGE =====
function renderRegister() {
  app.innerHTML = `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="card auth-card border-0 shadow">
            <div class="card-body p-4 p-md-5">
              <div class="text-center mb-4">
                <h2 class="auth-title">Create Account</h2>
                <p class="text-muted">Join LankaThread for exclusive deals</p>
              </div>
              <form onsubmit="handleRegister(event)">
                <div class="mb-3"><label class="form-label"><i class="bi bi-person me-1"></i>Full Name</label><input type="text" class="form-control" id="regName" required></div>
                <div class="mb-3"><label class="form-label"><i class="bi bi-envelope me-1"></i>Email</label><input type="email" class="form-control" id="regEmail" required></div>
                <div class="mb-3"><label class="form-label"><i class="bi bi-telephone me-1"></i>Phone</label><input type="tel" class="form-control" id="regPhone" placeholder="07X XXX XXXX"></div>
                <div class="mb-3"><label class="form-label"><i class="bi bi-lock me-1"></i>Password</label><input type="password" class="form-control" id="regPassword" required minlength="6"></div>
                <div class="mb-4"><label class="form-label"><i class="bi bi-lock me-1"></i>Confirm Password</label><input type="password" class="form-control" id="regConfirm" required></div>
                <button type="submit" class="btn btn-primary-custom w-100">Create Account</button>
              </form>
              <p class="text-center mt-3 mb-0">Already have an account? <a href="#" class="auth-link" onclick="router.navigate('login')">Sign In</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ===== PROFILE PAGE =====
function renderProfile() {
  if (!currentUser) { router.navigate('login'); return; }
  app.innerHTML = `
    <div class="container py-4">
      <h1 class="page-title mb-4">My Profile</h1>
      <div class="row">
        <div class="col-lg-4 mb-4">
          <div class="card border-0 shadow-sm text-center p-4">
            <div class="profile-avatar mx-auto"><i class="bi bi-person fs-1"></i></div>
            <h5 class="mt-3 mb-1">${currentUser.fullName}</h5>
            <p class="text-muted mb-0">${currentUser.email}</p>
            <span class="badge bg-dark mt-2">${currentUser.role || 'CUSTOMER'}</span>
          </div>
          <div class="card border-0 shadow-sm mt-3">
            <div class="card-body">
              <h6 class="mb-3">Quick Links</h6>
              <nav class="nav flex-column">
                <a class="nav-link text-muted" href="#" onclick="router.navigate('orders')"><i class="bi bi-box me-2"></i>My Orders</a>
                <a class="nav-link text-muted" href="#" onclick="router.navigate('wishlist')"><i class="bi bi-heart me-2"></i>My Wishlist</a>
                <a class="nav-link text-muted" href="#" onclick="router.navigate('cart')"><i class="bi bi-cart me-2"></i>Shopping Cart</a>
              </nav>
            </div>
          </div>
        </div>
        <div class="col-lg-8">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <h5 class="mb-4">Personal Information</h5>
              <div class="row g-3">
                <div class="col-md-6"><label class="form-label">Full Name</label><input type="text" class="form-control" value="${currentUser.fullName}" readonly></div>
                <div class="col-md-6"><label class="form-label">Email</label><input type="email" class="form-control" value="${currentUser.email}" readonly></div>
                <div class="col-md-6"><label class="form-label">Phone</label><input type="tel" class="form-control" value="${currentUser.phone||''}"></div>
                <div class="col-md-6"><label class="form-label">Member Since</label><input type="text" class="form-control" value="2024" readonly></div>
              </div>
              <h5 class="mt-4 mb-3">Default Address</h5>
              <div class="row g-3">
                <div class="col-12"><label class="form-label">Address</label><textarea class="form-control" rows="2">42 Galle Road, Colombo 03</textarea></div>
                <div class="col-md-4"><label class="form-label">City</label><input type="text" class="form-control" value="Colombo"></div>
                <div class="col-md-4"><label class="form-label">District</label><input type="text" class="form-control" value="Colombo"></div>
                <div class="col-md-4"><label class="form-label">Postal Code</label><input type="text" class="form-control" value="00300"></div>
              </div>
              <button class="btn btn-primary-custom mt-3" onclick="showToast('Profile updated!', 'success')">Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ===== ORDERS PAGE =====
function renderOrders() {
  app.innerHTML = `
    <div class="container py-4">
      <h1 class="page-title mb-4">My Orders</h1>
      <div class="orders-list">
        ${DB.orders.map(order => `
          <div class="card order-card mb-3 border-0 shadow-sm">
            <div class="card-header bg-light">
              <div class="d-flex flex-wrap justify-content-between align-items-center">
                <div><span class="order-number">${order.orderNumber}</span><span class="text-muted ms-3">${new Date(order.date).toLocaleDateString()}</span></div>
                <span class="badge ${getStatusBadge(order.status)}">${order.status}</span>
              </div>
            </div>
            <div class="card-body">
              ${order.items.map(item => `
                <div class="d-flex align-items-center gap-3 mb-2">
                  <img src="${item.img}" alt="" style="width:60px;height:60px;object-fit:cover;border-radius:4px;">
                  <div class="flex-grow-1"><h6 class="mb-0">${item.name}</h6><small class="text-muted">Qty: ${item.qty}</small></div>
                  <span>LKR ${(item.price*item.qty).toLocaleString()}</span>
                </div>
              `).join('')}
              <div class="border-top pt-3 mt-3 d-flex justify-content-between">
                <small class="text-muted">Payment: ${order.payment} | Status: ${order.status}</small>
                <strong>Total: LKR ${order.total.toLocaleString()}</strong>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ===== WISHLIST PAGE =====
function renderWishlist() {
  const items = DB.products.filter(p => Wishlist.has(p.id));
  app.innerHTML = `
    <div class="container py-4">
      <h1 class="page-title mb-4"><i class="bi bi-heart me-2"></i>My Wishlist</h1>
      ${items.length === 0 ? `
        <div class="text-center py-5"><i class="bi bi-heart fs-1 text-muted"></i><h3 class="mt-3">Your wishlist is empty</h3><p class="text-muted">Save your favorite items to buy them later</p><a href="#" class="btn btn-primary-custom" onclick="router.navigate('products')">Browse Products</a></div>
      ` : `
        <div class="row g-4">
          ${items.map(p => `
            <div class="col-6 col-md-4 col-lg-3">
              <div class="card product-card border-0 shadow-sm">
                <a href="#" onclick="router.navigate('product', {slug:'${p.slug}'})">
                  <div class="product-img-wrapper"><img src="${p.mainImage}" class="product-img" alt="${p.name}"></div>
                </a>
                <div class="card-body">
                  <span class="product-brand">${p.brand}</span>
                  <h6 class="product-title"><a href="#" onclick="router.navigate('product', {slug:'${p.slug}'})">${p.name}</a></h6>
                  <div class="product-price">
                    ${p.salePrice ? `<span class="sale-price">LKR ${p.salePrice.toLocaleString()}</span><span class="original-price">LKR ${p.price.toLocaleString()}</span>` : `<span class="current-price">LKR ${p.price.toLocaleString()}</span>`}
                  </div>
                  <button class="btn btn-add-cart w-100 btn-sm mt-2" onclick="addToCart(${p.id})"><i class="bi bi-cart3 me-1"></i>Move to Cart</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;
}

// ===== ADMIN PAGE =====
function renderAdmin() {
  if (!currentUser || currentUser.role !== 'ADMIN') { router.navigate('home'); return; }
  const stats = { total: 156, pending: 12, confirmed: 8, shipped: 23, delivered: 108, cancelled: 5, revenue: 2850000 };
  
  app.innerHTML = `
    <div class="container-fluid py-4">
      <h4 class="mb-4">Admin Dashboard</h4>
      <div class="row g-4 mb-4">
        ${[
          {label:'Total Orders',value:stats.total,icon:'bi-box',color:'#e3f2fd',iconColor:'#1976d2'},
          {label:'Revenue (LKR)',value:(stats.revenue/1000).toFixed(0)+'K',icon:'bi-currency-dollar',color:'#e8f5e9',iconColor:'#388e3c'},
          {label:'Pending',value:stats.pending,icon:'bi-clock',color:'#fff8e1',iconColor:'#f57f17'},
          {label:'Delivered',value:stats.delivered,icon:'bi-check-circle',color:'#e8f5e9',iconColor:'#2e7d32'}
        ].map(s => `
          <div class="col-sm-6 col-xl-3">
            <div class="card border-0 shadow-sm">
              <div class="card-body d-flex justify-content-between align-items-center">
                <div><p class="text-muted small mb-1">${s.label}</p><h3 class="mb-0 fw-bold">${s.value}</h3></div>
                <div class="rounded-3 d-flex align-items-center justify-content-center" style="width:48px;height:48px;background:${s.color}"><i class="bi ${s.icon} fs-4" style="color:${s.iconColor}"></i></div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="card border-0 shadow-sm">
        <div class="card-header bg-white d-flex justify-content-between align-items-center"><h5 class="mb-0">Recent Orders</h5></div>
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead><tr><th>Order #</th><th>Customer</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              ${DB.orders.map(o => `<tr><td><code>${o.orderNumber}</code></td><td>Customer</td><td>LKR ${o.total.toLocaleString()}</td><td><span class="badge ${getStatusBadge(o.status)}">${o.status}</span></td><td>${new Date(o.date).toLocaleDateString()}</td></tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

// ===== HELPER FUNCTIONS =====

function productCard(p) {
  return `
    <div class="col-6 col-md-4 col-lg-3">
      <div class="card product-card border-0 shadow-sm">
        <a href="#" onclick="router.navigate('product', {slug:'${p.slug}'})">
          <div class="product-img-wrapper">
            <img src="${p.mainImage}" class="product-img" alt="${p.name}">
            ${p.salePrice ? `<span class="badge bg-danger sale-badge">-${Math.round((1-p.salePrice/p.price)*100)}%</span>` : ''}
            ${p.isNew ? `<span class="badge bg-success new-badge">New</span>` : ''}
          </div>
        </a>
        <div class="card-body">
          <span class="product-brand">${p.brand}</span>
          <h6 class="product-title"><a href="#" onclick="router.navigate('product', {slug:'${p.slug}'})">${p.name}</a></h6>
          <div class="product-price">
            ${p.salePrice 
              ? `<span class="sale-price">LKR ${p.salePrice.toLocaleString()}</span><span class="original-price">LKR ${p.price.toLocaleString()}</span>`
              : `<span class="current-price">LKR ${p.price.toLocaleString()}</span>`
            }
          </div>
        </div>
      </div>
    </div>
  `;
}

function getStatusBadge(status) {
  const map = { 'PENDING':'bg-warning text-dark', 'CONFIRMED':'bg-info', 'SHIPPED':'bg-primary', 'DELIVERED':'bg-success', 'CANCELLED':'bg-danger' };
  return map[status] || 'bg-secondary';
}

// Product detail helpers
let selectedSize = '', selectedColor = '', selectedQty = 1;

function selectSize(btn, size) {
  document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  selectedSize = size;
}

function selectColor(btn, color) {
  document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  selectedColor = color;
}

function updateQty(delta) {
  selectedQty = Math.max(1, Math.min(10, selectedQty + delta));
  const el = document.getElementById('qtyValue');
  if (el) el.textContent = selectedQty;
}

function addToCart(productId) {
  const product = DB.products.find(p => p.id === productId);
  if (!product) return;
  if (product.sizes.length && !selectedSize) { showToast('Please select a size', 'error'); return; }
  Cart.add(product, selectedSize || product.sizes[0], selectedColor || product.colors[0], selectedQty);
  selectedQty = 1;
}

function buyNow(productId) {
  addToCart(productId);
  router.navigate('checkout');
}

function toggleWishlistBtn(productId, btn) {
  const added = Wishlist.toggle(productId);
  btn.innerHTML = `<i class="bi ${added?'heart-fill text-danger':'heart'}"></i>`;
}

function toggleChip(btn) {
  btn.classList.toggle('btn-dark');
  btn.classList.toggle('btn-outline-dark');
}

function selectPayment(el, method) {
  document.querySelectorAll('.payment-option').forEach(p => { p.classList.remove('selected'); p.querySelector('.radio-circle').innerHTML = ''; });
  el.classList.add('selected');
  el.querySelector('.radio-circle').innerHTML = '<div class="radio-dot"></div>';
}

function updateCartQty(id, size, color, qty) {
  if (qty < 1) { Cart.remove(id, size, color); }
  else { Cart.updateQty(id, size, color, qty); }
  router.render();
}

function removeCartItem(id, size, color) {
  Cart.remove(id, size, color);
  router.render();
}

function placeOrder() {
  const name = document.getElementById('shipName')?.value;
  const phone = document.getElementById('shipPhone')?.value;
  const address = document.getElementById('shipAddress')?.value;
  const city = document.getElementById('shipCity')?.value;
  if (!name || !phone || !address || !city) { showToast('Please fill all required fields', 'error'); return; }
  
  const orderNum = 'LT' + Date.now();
  showToast('Order placed successfully!', 'success');
  Cart.clear();
  
  app.innerHTML = `
    <div class="container py-5 text-center">
      <div class="success-icon mx-auto mb-4"><i class="bi bi-check-lg fs-1 text-white"></i></div>
      <h2>Order Placed Successfully!</h2>
      <p class="text-muted">Thank you for shopping with LankaThread</p>
      <div class="d-inline-block bg-light p-4 rounded"><p class="mb-1"><strong>Order Number:</strong> <span class="text-warning fw-bold">${orderNum}</span></p><p class="mb-0"><strong>Payment:</strong> Cash on Delivery</p></div>
      <div class="mt-3"><a href="#" class="btn btn-primary-custom me-2" onclick="router.navigate('orders')">View Orders</a><a href="#" class="btn btn-outline-dark" onclick="router.navigate('home')">Continue Shopping</a></div>
    </div>
  `;
}

// Auth handlers
function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  currentUser = { id: 1, fullName: email.split('@')[0], email, role: email.includes('admin') ? 'ADMIN' : 'CUSTOMER' };
  localStorage.setItem('user', JSON.stringify(currentUser));
  showToast('Login successful!', 'success');
  router.navigate('home');
}

function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const pass = document.getElementById('regPassword').value;
  const confirm = document.getElementById('regConfirm').value;
  if (pass !== confirm) { showToast('Passwords do not match', 'error'); return; }
  currentUser = { id: 1, fullName: name, email, role: 'CUSTOMER' };
  localStorage.setItem('user', JSON.stringify(currentUser));
  showToast('Account created!', 'success');
  router.navigate('home');
}

function googleLogin() {
  showToast('Google login will be available soon', 'info');
}

function logout() {
  currentUser = null;
  localStorage.removeItem('user');
  showToast('Logged out', 'info');
  router.navigate('home');
}

function handleSearch(e) {
  e.preventDefault();
  const query = document.getElementById('searchInput').value;
  if (query.trim()) router.navigate('products', { search: query });
}

function filterProducts(key, value) {
  router.params[key] = value;
  router.render();
}

function applyFilters() {
  showToast('Filters applied', 'success');
  router.render();
}

// Initialize
window.addEventListener('DOMContentLoaded', () => {
  Cart.updateBadge();
  router.render();
});
