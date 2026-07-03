# LankaThread - Sri Lankan Fashion E-Commerce Platform

A full-stack e-commerce web application built for LankaThread, a Sri Lankan online fashion store. The platform provides a clean, modern, mobile-first shopping experience with comprehensive admin tools.

## Features

### Customer Features
- **Browse by Category** - Women, Men, Kids, Teens with subcategories
- **Advanced Search** - Auto-suggestions for products, categories, and brands
- **Product Filtering** - Filter by gender, size, price, color, brand, availability, and new arrivals
- **Detailed Product Pages** - Multiple images, size availability, material info, care instructions
- **Shopping Cart** - Add items, update quantities, remove items
- **Buy Now** - Direct checkout without cart steps
- **Wishlist** - Save favorite items for later
- **Multiple Payment Options** - Cash on Delivery (COD), Credit/Debit Card, Mobile Wallet
- **WhatsApp Support** - Direct chat integration for customer queries
- **User Authentication** - Email/Password and Google OAuth login
- **Order Tracking** - View order status and history
- **Mobile-First Design** - Fully responsive across all devices

### Admin Features
- **Dashboard** - Visual statistics and KPIs
- **Order Management** - View all orders, update order status
- **Product Management** - Add, edit, deactivate products
- **Customer Overview** - View customer data

## Tech Stack

### Backend
- **Java 17** with Spring Boot 3.2.5
- **Maven** for build management
- **Spring Data JPA** for ORM
- **Spring Security** with JWT authentication
- **MySQL** database
- **OAuth2** for Google authentication

### Frontend
- **React 18** with JavaScript (no TypeScript)
- **React Bootstrap** for UI components
- **Bootstrap 5** for styling
- **React Router DOM** for routing
- **Axios** for API calls
- **React Icons** for iconography

## Project Structure

```
lankathread/
├── backend/                          # Spring Boot Application
│   ├── pom.xml                       # Maven configuration
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/lankathread/
│   │   │   │   ├── LankaThreadApplication.java
│   │   │   │   ├── controller/       # REST API Controllers
│   │   │   │   │   ├── AuthController.java
│   │   │   │   │   ├── ProductController.java
│   │   │   │   │   ├── CategoryController.java
│   │   │   │   │   ├── CartController.java
│   │   │   │   │   ├── WishlistController.java
│   │   │   │   │   ├── OrderController.java
│   │   │   │   │   └── AdminController.java
│   │   │   │   ├── service/          # Business Logic
│   │   │   │   ├── repository/       # JPA Repositories
│   │   │   │   ├── model/            # JPA Entities
│   │   │   │   ├── dto/              # Data Transfer Objects
│   │   │   │   ├── security/         # JWT & Security Config
│   │   │   │   └── config/           # Application Config
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── data.sql          # Seed data
│   │   └── test/
│   └── target/                       # Build output
│
├── frontend/                         # React Application
│   ├── package.json
│   ├── public/
│   ├── src/
│   │   ├── App.js                    # Main App Component
│   │   ├── index.js                  # Entry Point
│   │   ├── context/
│   │   │   └── AuthContext.js        # Authentication Context
│   │   ├── services/
│   │   │   └── api.js                # API Service Layer
│   │   ├── components/
│   │   │   ├── Navbar.js             # Navigation Bar
│   │   │   ├── Footer.js             # Footer
│   │   │   └── WhatsAppButton.js     # WhatsApp Chat
│   │   ├── pages/
│   │   │   ├── Home.js               # Homepage
│   │   │   ├── Products.js           # Product Listing
│   │   │   ├── ProductDetail.js      # Product Details
│   │   │   ├── Cart.js               # Shopping Cart
│   │   │   ├── Checkout.js           # Checkout Flow
│   │   │   ├── Login.js              # Login Page
│   │   │   ├── Register.js           # Registration Page
│   │   │   ├── Profile.js            # User Profile
│   │   │   ├── Orders.js             # Order History
│   │   │   ├── Wishlist.js           # Wishlist Page
│   │   │   └── AdminDashboard.js     # Admin Panel
│   │   ├── styles/
│   │   │   └── custom.css            # Custom Styles
│   │   └── assets/                   # Generated Images
│   └── build/                        # Production Build

```

## Prerequisites

- Java 17 or higher
- Maven 3.8+
- MySQL 8.0+
- Node.js 18+
- npm 9+

## Quick Start

### 1. Database Setup

```sql
CREATE DATABASE lankathread CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'lankathread'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON lankathread.* TO 'lankathread'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Backend Setup

```bash
cd backend

# Update database credentials in src/main/resources/application.properties
# spring.datasource.url=jdbc:mysql://localhost:3306/lankathread
# spring.datasource.username=lankathread
# spring.datasource.password=password

# Build and run
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

The frontend will start on `http://localhost:3000`

### 4. Access the Application

- **Customer Site**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **Admin Panel**: http://localhost:3000/admin

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth login
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/featured` - Get featured products
- `GET /api/products/new-arrivals` - Get new arrivals
- `GET /api/products/category/{id}` - Get products by category
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/slug/{slug}` - Get product by slug
- `POST /api/products/filter` - Filter products
- `GET /api/products/search?query=` - Search products
- `GET /api/products/brands` - Get all brands

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/parent` - Get parent categories
- `GET /api/categories/{id}/subcategories` - Get subcategories

### Cart
- `GET /api/cart/user/{userId}` - Get cart items
- `POST /api/cart/user/{userId}/add` - Add to cart
- `PUT /api/cart/user/{userId}/item/{itemId}` - Update quantity
- `DELETE /api/cart/user/{userId}/item/{itemId}` - Remove item
- `DELETE /api/cart/user/{userId}/clear` - Clear cart

### Wishlist
- `GET /api/wishlist/user/{userId}` - Get wishlist items
- `POST /api/wishlist/user/{userId}/add/{productId}` - Add to wishlist
- `DELETE /api/wishlist/user/{userId}/remove/{productId}` - Remove from wishlist

### Orders
- `POST /api/orders/user/{userId}` - Create order
- `GET /api/orders/user/{userId}` - Get user orders
- `GET /api/orders/admin/all` - Get all orders (admin)
- `PUT /api/orders/admin/{orderId}/status` - Update order status

## Sri Lankan Specific Features

- **Cash on Delivery** - Primary payment method widely used in Sri Lanka
- **WhatsApp Support** - Direct chat via WhatsApp Business
- **Prices in LKR** - All prices displayed in Sri Lankan Rupees
- **Island-wide Delivery** - Coverage for all provinces
- **Local Address Format** - City and district selection
- **Sinhala/Tamil Ready** - UTF-8 support for local languages

## Design Principles

1. **Clean & Uncluttered** - Unlike competitor sites, no excessive ads
2. **Mobile-First** - Optimized for smartphone shopping
3. **Fast Loading** - Target 2-3 seconds on mobile networks
4. **Accessible** - High contrast, legible text for all age groups
5. **Luxury Aesthetic** - Gold accents, elegant typography, premium feel

## Environment Variables

### Backend (.env or application.properties)
```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/lankathread
spring.datasource.username=root
spring.datasource.password=root

# JWT
jwt.secret=your-secret-key
jwt.expiration=86400000

# Google OAuth
spring.security.oauth2.client.registration.google.client-id=your-client-id
spring.security.oauth2.client.registration.google.client-secret=your-client-secret
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:8080/api
```

## Building for Production

### Backend
```bash
cd backend
mvn clean package
# JAR file will be in target/lankathread-backend-1.0.0.jar
java -jar target/lankathread-backend-1.0.0.jar
```

### Frontend
```bash
cd frontend
npm run build
# Static files will be in build/ directory
```

## License

This project is proprietary software for LankaThread Fashion Company.

## Support

For support, contact: support@lankathread.lk
WhatsApp: +94 77 123 4567
