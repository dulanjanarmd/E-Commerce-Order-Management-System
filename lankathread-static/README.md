# LankaThread - Sri Lankan Fashion E-Commerce Platform

## Live Demo
**Frontend (Deployed):** https://z4tckfj5a5ahy.kimi.page

## Project Structure
```
lankathread/
├── backend/          # Spring Boot + Maven + MySQL
│   ├── pom.xml
│   └── src/main/java/com/lankathread/
│       ├── controller/    # REST API Controllers
│       ├── service/       # Business Logic
│       ├── repository/    # JPA Repositories
│       ├── model/         # JPA Entities
│       ├── dto/           # Data Transfer Objects
│       ├── security/      # JWT & Security Config
│       └── resources/
│           ├── application.properties
│           └── data.sql   # Seed data
├── frontend-react/   # React.js + Bootstrap (Development)
│   ├── src/
│   │   ├── components/  # Navbar, Footer, WhatsAppButton
│   │   ├── pages/       # All page components
│   │   ├── context/     # AuthContext
│   │   ├── services/    # API layer
│   │   └── styles/      # Custom CSS
│   └── package.json
└── static-site/      # Deployed Static Site
    ├── index.html
    ├── css/styles.css
    ├── js/app.js
    └── js/data.js
```

## Tech Stack
- **Backend:** Java 17, Spring Boot 3.2.5, Maven, MySQL, JWT, Spring Security
- **Frontend:** React 18, JavaScript (no TypeScript), Bootstrap 5, React Router DOM, Axios
- **Static Site:** Vanilla JavaScript, Bootstrap 5 CDN

## Features
- Browse products by category (Women, Men, Kids, Teens)
- Search with auto-suggestions
- Advanced filtering (gender, size, price, color, brand)
- Product detail pages with size availability
- Shopping cart & Buy Now
- Cash on Delivery (COD) checkout
- WhatsApp chat support
- User authentication (Email/Password + Google OAuth)
- Order tracking
- Admin dashboard
- Mobile-first responsive design

## Local Development

### Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
# API runs on http://localhost:8080
```

### React Frontend
```bash
cd frontend
npm install
npm start
# App runs on http://localhost:3000
```

### Static Site
```bash
cd static-site
# Simply open index.html in browser
# Or serve with: python -m http.server 8080
```
