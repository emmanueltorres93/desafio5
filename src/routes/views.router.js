import express from 'express';
import { getProducts, postProductIo } from '../controllers/products-controller.js';

const router = express.Router();

const allProducts = getProducts();

router.get('/', (req, res) => {
    res.render('home', { products: allProducts });
});

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { products: allProducts });
});

export default router;