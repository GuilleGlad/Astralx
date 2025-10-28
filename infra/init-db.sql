-- Initial database schema for Astralx MVP
-- Sprint 0: Basic infrastructure setup

-- Users table (both clients and workshops)
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('client', 'workshop') NOT NULL,
  status ENUM('pending_verification', 'active', 'suspended') DEFAULT 'pending_verification',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample data for development
INSERT INTO users (id, email, password_hash, role, status) VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'client@example.com', '$2b$10$dummyhashfordevonly', 'client', 'active'),
  ('550e8400-e29b-41d4-a716-446655440001', 'workshop@example.com', '$2b$10$dummyhashfordevonly', 'workshop', 'active');
