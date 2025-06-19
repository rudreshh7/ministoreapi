const express = require('express');
const { body } = require('express-validator');
const ProductController = require('../controllers/ProductController');
const { authenticateToken, requireRole } = require('../middlewares/auth');

const router = express.Router();

// Product validation
const productValidation = [
  body('name').notEmpty().withMessage('Product name is required'),
  body('description').notEmpty().withMessage('Product description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').notEmpty().withMessage('Category is required'),
  body('stock_quantity').isInt({ min: 0 }).withMessage('Stock quantity must be a non-negative integer')
];

// Public routes
router.get('/', ProductController.getProducts);
router.get('/categories', ProductController.getCategories);
router.get('/:id', ProductController.getProduct);

// Admin only routes
router.post('/', authenticateToken, requireRole(['admin']), productValidation, ProductController.createProduct);
router.put('/:id', authenticateToken, requireRole(['admin']), productValidation, ProductController.updateProduct);
router.delete('/:id', authenticateToken, requireRole(['admin']), ProductController.deleteProduct);

module.exports = router;