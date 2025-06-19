const { validationResult } = require('express-validator');
const Product = require('../models/Product');

class ProductController {
  static async createProduct(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const productData = {
        ...req.body,
        created_by: req.user.id
      };

      const product = await Product.create(productData);
      
      res.status(201).json({
        message: 'Product created successfully',
        product
      });
    } catch (error) {
      console.error('Create product error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async getProducts(req, res) {
    try {
      const { category, search } = req.query;
      const filters = {};
      
      if (category) filters.category = category;
      if (search) filters.search = search;

      const products = await Product.getAll(filters);
      
      res.json({ products });
    } catch (error) {
      console.error('Get products error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async getProduct(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      res.json({ product });
    } catch (error) {
      console.error('Get product error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async updateProduct(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const product = await Product.update(id, req.body);
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      res.json({
        message: 'Product updated successfully',
        product
      });
    } catch (error) {
      console.error('Update product error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.delete(id);
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Delete product error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  static async getCategories(req, res) {
    try {
      const categories = await Product.getCategories();
      res.json({ categories });
    } catch (error) {
      console.error('Get categories error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}

module.exports = ProductController;