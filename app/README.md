# LankaThread - Sri Lankan Fashion E-Commerce Platform

LankaThread is a modern, full-stack e-commerce platform dedicated to showcasing and selling Sri Lankan fashion. It provides a seamless shopping experience for customers and a powerful admin dashboard for managing products, orders, and users.

## Features

- **User Authentication:** Secure user registration and login with JWT-based authentication.
- **Product Catalog:** Browse products by category, with detailed product pages including image galleries and stock information.
- **Shopping Cart:** Add products to a shopping cart and manage cart items.
- **Wishlist:** Save favorite products to a wishlist for future purchase.
- **Checkout:** Smooth and secure checkout process.
- **Order Management:** View order history and track order status.
- **Admin Dashboard:** A powerful dashboard for administrators to manage products, categories, orders, and users.

## Technologies Used

### Backend

- **Java 17:** The core programming language for the backend.
- **Spring Boot 3:** Framework for creating stand-alone, production-grade Spring-based applications.
- **Spring Security:** For robust authentication and authorization.
- **JWT (JSON Web Tokens):** For securing the API.
- **Spring Data JPA:** To interact with the database.
- **MySQL:** The relational database for storing application data.
- **Maven:** For dependency management and building the project.

### Frontend

- **React 18:** A JavaScript library for building user interfaces.
- **React Router:** For declarative routing in the React application.
- **Bootstrap & React-Bootstrap:** For responsive and modern UI components.
- **Axios:** A promise-based HTTP client for making API requests.
- **React Toastify:** For providing user-friendly notifications.

## Getting Started

### Prerequisites

- Java 17 or later
- Node.js 14 or later
- MySQL

### Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/lankathread.git
    cd lankathread
    ```

2.  **Backend Setup:**
    - Navigate to the `app/backend` directory.
    - Create a MySQL database named `lankathread`.
    - Update the `application.properties` file in `src/main/resources` with your MySQL username and password.
    - Build and run the Spring Boot application:
      ```bash
      mvn spring-boot:run
      ```
    - The backend will be running on `http://localhost:8080`.

3.  **Frontend Setup:**
    - Navigate to the `app/frontend` directory.
    - Install the dependencies:
      ```bash
      npm install
      ```
    - Start the React development server:
      ```bash
      npm start
      ```
    - The frontend will be running on `http://localhost:3000`.

## Project Structure

```
lankathread/
├── app/
│   ├── backend/
│   │   ├── src/main/java/com/lankathread/
│   │   │   ├── controller/  # API endpoints
│   │   │   ├── dto/         # Data Transfer Objects
│   │   │   ├── model/       # JPA entities
│   │   │   ├── repository/  # Spring Data JPA repositories
│   │   │   ├── security/    # JWT and Spring Security configuration
│   │   │   └── service/     # Business logic
│   │   ├── pom.xml          # Backend dependencies
│   └── frontend/
│       ├── src/
│       │   ├── components/  # React components
│       │   ├── context/     # React context providers
│       │   ├── pages/       # Page components
│       │   ├── services/    # API service calls
│       │   └── App.js       # Main React component
│       ├── package.json     # Frontend dependencies
├── README.md
```

## API Endpoints

The backend provides a RESTful API for the frontend.

### Authentication (`/api/auth`)

- `POST /register`: Register a new user.
- `POST /login`: Authenticate a user and get a JWT token.
- `POST /google`: Authenticate a user with Google.
- `GET /me`: Get the currently logged-in user's details.

### Products (`/api/products`)

- `GET /`: Get all active products.
- `GET /featured`: Get featured products.
- `GET /new-arrivals`: Get new arrival products.
- `GET /category/{categoryId}`: Get products by category.
- `GET /{id}`: Get a product by its ID.
- `GET /slug/{slug}`: Get a product by its slug.
- `POST /filter`: Filter products based on criteria.
- `GET /search`: Search for products.
- `GET /brands`: Get a list of all brands.
- `POST /`: Create a new product (Admin).
- `PUT /{id}`: Update a product (Admin).
- `DELETE /{id}`: Delete a product (Admin).

### Categories (`/api/categories`)

- `GET /`: Get all categories.
- `GET /parent`: Get all parent categories.
- `GET /{parentId}/subcategories`: Get subcategories of a parent category.
- `POST /`: Create a new category (Admin).
- `PUT /{id}`: Update a category (Admin).
- `DELETE /{id}`: Delete a category (Admin).

### Cart (`/api/cart`)

- `GET /user/{userId}`: Get all items in a user's cart.
- `POST /user/{userId}/add`: Add an item to the cart.
- `PUT /user/{userId}/item/{cartItemId}`: Update the quantity of an item in the cart.
- `DELETE /user/{userId}/item/{cartItemId}`: Remove an item from the cart.
- `DELETE /user/{userId}/clear`: Clear all items from the cart.
- `GET /user/{userId}/count`: Get the number of items in the cart.

### Orders (`/api/orders`)

- `POST /user/{userId}`: Create a new order.
- `GET /user/{userId}`: Get all orders for a user.
- `GET /number/{orderNumber}`: Get an order by its order number.
- `GET /admin/all`: Get all orders (Admin).
- `PUT /admin/{orderId}/status`: Update the status of an order (Admin).
- `GET /admin/stats`: Get order statistics (Admin).

### Wishlist (`/api/wishlist`)

- `GET /user/{userId}`: Get a user's wishlist.
- `POST /user/{userId}/add/{productId}`: Add a product to the wishlist.
- `DELETE /user/{userId}/remove/{productId}`: Remove a product from the wishlist.
- `GET /user/{userId}/check/{productId}`: Check if a product is in the wishlist.

### Admin (`/api/admin`)

- `GET /dashboard`: Get dashboard statistics.

## Configuration

### Backend

The backend configuration is located in `app/backend/src/main/resources/application.properties`. You will need to configure the following:

- **Database:**
  - `spring.datasource.url`: The URL of your MySQL database.
  - `spring.datasource.username`: The username for your MySQL database.
  - `spring.datasource.password`: The password for your MySQL database.
- **JWT:**
  - `app.jwtSecret`: A secret key for signing JWT tokens.
  - `app.jwtExpirationInMs`: The expiration time for JWT tokens in milliseconds.

### Frontend

The frontend proxies API requests to the backend. The proxy is configured in `app/frontend/package.json`:

```json
"proxy": "http://localhost:8080"
```

If your backend is running on a different port, you will need to update this value.

## Deployment

### Backend

To build the backend for production, run the following command in the `app/backend` directory:

```bash
mvn clean package
```

This will create a JAR file in the `target` directory. You can then run the application with:

```bash
java -jar target/lankathread-backend-1.0.0.jar
```

### Frontend

To build the frontend for production, run the following command in the `app/frontend` directory:

```bash
npm run build
```

This will create a `build` directory with the optimized and minified static assets. You can then serve these files with a static file server.

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

## License

This project is licensed under the MIT License.
