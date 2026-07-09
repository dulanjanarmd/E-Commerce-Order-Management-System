-- LankaThread Database Seed Data
-- Run this after the application starts to populate initial data

-- Categories (is_pinned=1 means shown in top navbar)
INSERT INTO categories (name, slug, description, image_url, display_order, is_pinned, pin_order, active) VALUES
('Women', 'women', 'Elegant fashion for women including sarees, dresses, kurtis, and more', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400', 1, true, 1, true),
('Men', 'men', 'Stylish menswear including shirts, t-shirts, trousers, and accessories', 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=400', 2, true, 2, true),
('Kids', 'kids', 'Adorable clothing for kids aged 2-12 years', 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=400', 3, true, 3, true),
('Teens', 'teens', 'Trendy fashion for teenagers', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400', 4, true, 4, true),
('New Arrivals', 'new-arrivals', 'Latest additions to our collection', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400', 5, true, 5, true);

-- Subcategories for Women
INSERT INTO categories (name, slug, description, parent_id, display_order, active) VALUES
('Sarees', 'sarees', 'Traditional and modern sarees', 1, 1, true),
('Dresses', 'dresses', 'Casual and party dresses', 1, 2, true),
('Kurtis', 'kurtis', 'Elegant kurtis and tunics', 1, 3, true),
('Tops', 'tops', 'Stylish tops and blouses', 1, 4, true);

-- Subcategories for Men
INSERT INTO categories (name, slug, description, parent_id, display_order, active) VALUES
('Shirts', 'shirts', 'Formal and casual shirts', 2, 1, true),
('T-Shirts', 't-shirts', 'Casual t-shirts and polos', 2, 2, true),
('Trousers', 'trousers', 'Formal and casual trousers', 2, 3, true),
('Shorts', 'shorts', 'Casual shorts', 2, 4, true);

-- Subcategories for Kids
INSERT INTO categories (name, slug, description, parent_id, display_order, active) VALUES
('T-Shirts', 'kids-tshirts', 'Colorful t-shirts for kids', 3, 1, true),
('Dresses', 'kids-dresses', 'Cute dresses for girls', 3, 2, true),
('Shorts', 'kids-shorts', 'Comfortable shorts', 3, 3, true),
('School Wear', 'school-wear', 'School uniforms and accessories', 3, 4, true);

-- Sample Products
INSERT INTO products (name, slug, description, price, sale_price, category_id, sub_category, brand, gender, material, care_instructions, stock_quantity, is_new_arrival, is_featured, is_active, main_image, barcode, store_location, is_archived, created_at, updated_at) VALUES
('Floral Summer Dress', 'floral-summer-dress', 'A beautiful floral summer dress perfect for the Sri Lankan climate. Made from lightweight, breathable cotton fabric with a flattering A-line silhouette.', 4590, 3290, 2, 'Dresses', 'LankaThread', 'WOMEN', '100% Cotton', 'Machine wash cold, gentle cycle. Do not bleach.', 15, true, true, true, 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400', 'LT001001', 'Aisle-1-Shelf-A', false, NOW(), NOW()),
('Classic Linen Shirt', 'classic-linen-shirt', 'Premium quality linen shirt perfect for tropical weather. Breathable and comfortable for all-day wear.', 3890, NULL, 5, 'Shirts', 'LankaThread', 'MEN', '100% Linen', 'Machine wash cold. Iron on low heat.', 20, false, true, true, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400', 'LT001002', 'Aisle-2-Shelf-B', false, NOW(), NOW()),
('Kids Tropical T-Shirt', 'kids-tropical-tshirt', 'Fun and colorful tropical print t-shirt for kids. Soft cotton fabric that is gentle on sensitive skin.', 1890, NULL, 9, 'T-Shirts', 'LankaThread', 'KIDS', '100% Cotton', 'Machine wash cold. Tumble dry low.', 30, true, false, true, 'https://images.unsplash.com/photo-1519278407-7e5f4b54cc6a?w=400', 'LT001003', 'Aisle-3-Shelf-C', false, NOW(), NOW()),
('Teen Denim Jacket', 'teen-denim-jacket', 'Stylish denim jacket with modern patches and distressed details. Perfect for layering.', 5990, 4590, 4, 'Jackets', 'LankaThread', 'TEENS', 'Denim', 'Machine wash cold. Do not bleach.', 8, false, true, true, 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=400', 'LT001004', 'Aisle-4-Shelf-D', false, NOW(), NOW()),
('Traditional Kandyan Saree', 'traditional-kandyan-saree', 'Exquisite handwoven Kandyan saree in rich colors with traditional motifs. Perfect for weddings and special occasions.', 12500, NULL, 1, 'Sarees', 'Heritage', 'WOMEN', 'Silk Blend', 'Dry clean only.', 5, true, true, true, 'https://images.unsplash.com/photo-1583391733951-8f1cb5da7574?w=400', 'LT001005', 'Aisle-5-Shelf-E', false, NOW(), NOW()),
('Emerald Embroidered Kurti', 'emerald-embroidered-kurti', 'Elegant emerald green kurti with delicate gold embroidery. Perfect for festive occasions and casual wear.', 4590, NULL, 3, 'Kurtis', 'Heritage', 'WOMEN', 'Cotton Silk Blend', 'Machine wash cold, gentle cycle.', 12, true, false, true, 'https://images.unsplash.com/photo-1610030465003-7c65e3d6d681?w=400', 'LT001006', 'Aisle-1-Shelf-F', false, NOW(), NOW()),
('Casual Polo Shirt', 'casual-polo-shirt', 'Classic polo shirt in versatile colors. Comfortable fit for everyday wear.', 2890, NULL, 6, 'T-Shirts', 'LankaThread', 'MEN', 'Cotton Pique', 'Machine wash cold.', 25, false, false, true, 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400', 'LT001007', 'Aisle-2-Shelf-G', false, NOW(), NOW()),
('Beach Shorts', 'beach-shorts', 'Lightweight and quick-dry beach shorts perfect for Sri Lankan beaches.', 2290, NULL, 8, 'Shorts', 'LankaThread', 'MEN', 'Polyester Blend', 'Machine wash cold.', 18, false, false, true, 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400', 'LT001008', 'Aisle-2-Shelf-H', false, NOW(), NOW()),
('Party Wear Gown', 'party-wear-gown', 'Stunning evening gown for special occasions. Elegant design with flowing silhouette.', 8500, 7200, 2, 'Dresses', 'LankaThread', 'WOMEN', 'Chiffon', 'Dry clean only.', 6, true, true, true, 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400', 'LT001009', 'Aisle-1-Shelf-I', false, NOW(), NOW()),
('School Uniform Set', 'school-uniform-set', 'Complete school uniform set including shirt, shorts/skirt, and tie. Durable fabric for daily wear.', 3500, NULL, 11, 'School Wear', 'LankaThread', 'KIDS', 'Polyester Cotton', 'Machine wash cold.', 40, false, false, true, 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=400', 'LT001010', 'Aisle-3-Shelf-J', false, NOW(), NOW()),
('Winter Hoodie', 'winter-hoodie', 'Cozy fleece-lined hoodie for cooler days. Available in trendy colors.', 4200, 3500, 4, 'Hoodies', 'LankaThread', 'TEENS', 'Cotton Fleece', 'Machine wash cold.', 14, false, true, true, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400', 'LT001011', 'Aisle-4-Shelf-K', false, NOW(), NOW()),
('Cotton Salwar Kameez', 'cotton-salwar-kameez', 'Comfortable and elegant cotton salwar kameez set. Perfect for daily wear.', 3800, NULL, 3, 'Kurtis', 'Heritage', 'WOMEN', '100% Cotton', 'Machine wash cold.', 10, true, false, true, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400', 'LT001012', 'Aisle-1-Shelf-L', false, NOW(), NOW());

-- Product Sizes
INSERT INTO product_sizes (product_id, size) VALUES
(1, 'S'), (1, 'M'), (1, 'L'), (1, 'XL'),
(2, 'M'), (2, 'L'), (2, 'XL'), (2, 'XXL'),
(3, 'XS'), (3, 'S'), (3, 'M'),
(4, 'S'), (4, 'M'), (4, 'L'),
(5, 'Free Size'),
(6, 'S'), (6, 'M'), (6, 'L'), (6, 'XL'),
(7, 'S'), (7, 'M'), (7, 'L'), (7, 'XL'),
(8, 'S'), (8, 'M'), (8, 'L'),
(9, 'S'), (9, 'M'), (9, 'L'),
(10, 'XS'), (10, 'S'), (10, 'M'), (10, 'L'),
(11, 'S'), (11, 'M'), (11, 'L'), (11, 'XL'),
(12, 'S'), (12, 'M'), (12, 'L'), (12, 'XL');

-- Product Colors
INSERT INTO product_colors (product_id, color) VALUES
(1, 'Pink'), (1, 'Blue'), (1, 'White'),
(2, 'White'), (2, 'Blue'), (2, 'Beige'),
(3, 'Yellow'), (3, 'Green'), (3, 'Red'),
(4, 'Blue'),
(5, 'Red'), (5, 'Gold'),
(6, 'Green'), (6, 'Purple'),
(7, 'Black'), (7, 'White'), (7, 'Navy'),
(8, 'Blue'), (8, 'Green'),
(9, 'Black'), (9, 'Red'),
(10, 'White'), (10, 'Navy'),
(11, 'Black'), (11, 'Grey'), (11, 'Blue'),
(12, 'Pink'), (12, 'Blue'), (12, 'Green');

-- Size Stock
INSERT INTO product_size_stock (product_id, size, stock) VALUES
(1, 'S', 5), (1, 'M', 8), (1, 'L', 2), (1, 'XL', 0),
(2, 'M', 10), (2, 'L', 7), (2, 'XL', 3), (2, 'XXL', 0),
(3, 'XS', 12), (3, 'S', 10), (3, 'M', 8),
(4, 'S', 3), (4, 'M', 4), (4, 'L', 1),
(5, 'Free Size', 5),
(6, 'S', 4), (6, 'M', 5), (6, 'L', 2), (6, 'XL', 1),
(7, 'S', 8), (7, 'M', 10), (7, 'L', 5), (7, 'XL', 2),
(8, 'S', 6), (8, 'M', 8), (8, 'L', 4),
(9, 'S', 2), (9, 'M', 3), (9, 'L', 1),
(10, 'XS', 15), (10, 'S', 12), (10, 'M', 10), (10, 'L', 3),
(11, 'S', 4), (11, 'M', 6), (11, 'L', 3), (11, 'XL', 1),
(12, 'S', 3), (12, 'M', 4), (12, 'L', 2), (12, 'XL', 1);

-- Product Tags
INSERT INTO product_tags (product_id, tag) VALUES
(1, 'summer'), (1, 'floral'), (1, 'casual'), (1, 'cotton'),
(2, 'formal'), (2, 'linen'), (2, 'office-wear'),
(3, 'kids'), (3, 'casual'), (3, 'cotton'), (3, 'fun-print'),
(4, 'denim'), (4, 'jacket'), (4, 'trendy'),
(5, 'traditional'), (5, 'saree'), (5, 'wedding'), (5, 'silk'),
(6, 'kurti'), (6, 'embroidered'), (6, 'festive'),
(7, 'polo'), (7, 'casual'), (7, 'cotton'),
(8, 'beach'), (8, 'shorts'), (8, 'summer'),
(9, 'gown'), (9, 'party'), (9, 'evening-wear'),
(10, 'school'), (10, 'uniform'), (10, 'kids'),
(11, 'hoodie'), (11, 'winter'), (11, 'fleece'),
(12, 'salwar'), (12, 'traditional'), (12, 'cotton');

-- Product Attributes (custom key-value pairs)
INSERT INTO product_attributes (product_id, attr_key, attr_value) VALUES
(1, 'Neckline', 'V-Neck'), (1, 'Sleeve Length', 'Sleeveless'), (1, 'Pattern', 'Floral Print'),
(2, 'Collar', 'Spread Collar'), (2, 'Sleeve Type', 'Full Sleeve'), (2, 'Fit', 'Regular Fit'),
(3, 'Neckline', 'Round Neck'), (3, 'Sleeve Length', 'Half Sleeve'), (3, 'Pattern', 'Tropical Print'),
(4, 'Closure', 'Button Front'), (4, 'Wash', 'Medium Wash'), (4, 'Fit', 'Slim Fit'),
(5, 'Blouse Piece', 'Included'), (5, 'Length', '5.5 meters'), (5, 'Occasion', 'Wedding/Festive'),
(6, 'Neckline', 'Round Neck'), (6, 'Sleeve Length', 'Three-Quarter'), (6, 'Work Type', 'Gold Embroidery'),
(7, 'Collar', 'Polo Collar'), (7, 'Fit', 'Regular Fit'), (7, 'Pattern', 'Solid'),
(8, 'Waistband', 'Elastic'), (8, 'Length', 'Above Knee'), (8, 'Feature', 'Quick Dry'),
(9, 'Length', 'Floor Length'), (9, 'Closure', 'Zipper Back'), (9, 'Occasion', 'Evening/Party'),
(10, 'Includes', 'Shirt + Shorts + Tie'), (10, 'Age Group', '6-12 years'),
(11, 'Hood', 'Drawstring Hood'), (11, 'Pocket', 'Kangaroo Pocket'), (11, 'Fit', 'Regular Fit'),
(12, 'Includes', 'Kameez + Salwar + Dupatta'), (12, 'Occasion', 'Daily Wear');

-- Product Variants (Color + Size combinations)
INSERT INTO product_variants (product_id, color, size, price, stock_quantity, sku, is_active) VALUES
-- Floral Summer Dress variants
(1, 'Pink', 'S', 4590, 5, 'FSD-PNK-S', true),
(1, 'Pink', 'M', 4590, 8, 'FSD-PNK-M', true),
(1, 'Pink', 'L', 4590, 2, 'FSD-PNK-L', true),
(1, 'Blue', 'S', 4590, 3, 'FSD-BLU-S', true),
(1, 'Blue', 'M', 4590, 4, 'FSD-BLU-M', true),
(1, 'Blue', 'L', 4590, 1, 'FSD-BLU-L', true),
-- Classic Linen Shirt variants
(2, 'White', 'M', 3890, 10, 'CLS-WHT-M', true),
(2, 'White', 'L', 3890, 7, 'CLS-WHT-L', true),
(2, 'White', 'XL', 3890, 3, 'CLS-WHT-XL', true),
(2, 'Blue', 'M', 3890, 5, 'CLS-BLU-M', true),
(2, 'Blue', 'L', 3890, 4, 'CLS-BLU-L', true),
-- Casual Polo Shirt variants
(7, 'Black', 'S', 2890, 8, 'CPS-BLK-S', true),
(7, 'Black', 'M', 2890, 10, 'CPS-BLK-M', true),
(7, 'Black', 'L', 2890, 5, 'CPS-BLK-L', true),
(7, 'White', 'S', 2890, 6, 'CPS-WHT-S', true),
(7, 'White', 'M', 2890, 8, 'CPS-WHT-M', true),
(7, 'Navy', 'M', 2890, 7, 'CPS-NVY-M', true),
(7, 'Navy', 'L', 2890, 4, 'CPS-NVY-L', true),
-- Winter Hoodie variants
(11, 'Black', 'S', 4200, 4, 'WHD-BLK-S', true),
(11, 'Black', 'M', 4200, 6, 'WHD-BLK-M', true),
(11, 'Black', 'L', 4200, 3, 'WHD-BLK-L', true),
(11, 'Grey', 'M', 4200, 5, 'WHD-GRY-M', true),
(11, 'Grey', 'L', 4200, 2, 'WHD-GRY-L', true),
(11, 'Blue', 'M', 4200, 4, 'WHD-BLU-M', true);

-- Sample Customers (password for all: password123)
INSERT INTO users (email, password, full_name, phone, role, is_active, address, created_at, updated_at) VALUES
('admin@lankathread.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Admin User', '+94771234567', 'ADMIN', true, '123 Main Street, Colombo', NOW(), NOW()),
('kamal.silva@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Kamal Silva', '+94772345678', 'CUSTOMER', true, '45 Galle Road, Colombo 03', NOW(), NOW()),
('nimali.fernando@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Nimali Fernando', '+94773456789', 'CUSTOMER', true, '12 Temple Road, Kandy', NOW(), NOW()),
('ruwan.jayawardena@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Ruwan Jayawardena', '+94774567890', 'CUSTOMER', true, '78 Beach Road, Galle', NOW(), NOW()),
('samani.perera@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Samani Perera', '+94775678901', 'CUSTOMER', false, '23 Park Street, Matara', NOW(), NOW()),
('dinesh.rathnayake@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Dinesh Rathnayake', '+94776789012', 'CUSTOMER', true, '56 Lake View, Nuwara Eliya', NOW(), NOW()),
('tharushi.wickramasinghe@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Tharushi Wickramasinghe', '+94777890123', 'CUSTOMER', true, '89 Temple Street, Anuradhapura', NOW(), NOW()),
('asanka.bandara@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Asanka Bandara', '+94778901234', 'CUSTOMER', false, '34 Main Street, Jaffna', NOW(), NOW()),
('malini.dissanayake@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Malini Dissanyake', '+94779012345', 'CUSTOMER', true, '67 Flower Road, Negombo', NOW(), NOW());
