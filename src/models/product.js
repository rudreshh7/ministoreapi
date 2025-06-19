const pool = require('../config/database');

class Product {
  static async create(productData) {
    const { name, description, price, category, image_url, stock_quantity, created_by } = productData;
    
    const result = await pool.query(
      'INSERT INTO products (name, description, price, category, image_url, stock_quantity, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name, description, price, category, image_url, stock_quantity, created_by]
    );
    
    return result.rows[0];
  }

  static async getAll(filters = {}) {
    let query = 'SELECT p.*, u.username as created_by_name FROM products p LEFT JOIN users u ON p.created_by = u.id';
    let params = [];
    let conditions = [];

    if (filters.category) {
      conditions.push(`p.category = $${params.length + 1}`);
      params.push(filters.category);
    }

    if (filters.search) {
      conditions.push(`(p.name ILIKE $${params.length + 1} OR p.description ILIKE $${params.length + 1})`);
      params.push(`%${filters.search}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY p.created_at DESC';

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async update(id, productData) {
    const { name, description, price, category, image_url, stock_quantity } = productData;
    
    const result = await pool.query(
      'UPDATE products SET name = $1, description = $2, price = $3, category = $4, image_url = $5, stock_quantity = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *',
      [name, description, price, category, image_url, stock_quantity, id]
    );
    
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }

  static async getCategories() {
    const result = await pool.query('SELECT DISTINCT category FROM products ORDER BY category');
    return result.rows.map(row => row.category);
  }
}

module.exports = Product;