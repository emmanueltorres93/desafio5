// const fs = require('fs');
import * as fs from 'fs';
// const path = require('path');
import * as path from 'path';
const productosFile = './productos.json';
const codes_translator = '../utils.js';
const finished = '../utils.js';

let resp = 9099;

class ProductsManager {
    constructor(file_path = process.cwd(), file = productosFile) {
        this.file_path = file_path;
        this.file = file;
        this.original_products = {};
        this.current_id = 0;

        if (!fs.existsSync(path.join(this.file_path, this.file))) {
            try {
                fs.writeFileSync(path.join(this.file_path, this.file), JSON.stringify(this.original_products, null, 2));
            } catch (e) {
                console.log(`Error: ${e}`);
            }
        }

        const read_products = fs.readFileSync(path.join(this.file_path, this.file), 'utf-8');
        this.products = JSON.parse(read_products);
        this.current_id = Object.keys(this.products)[Object.keys(this.products).length - 1];
    }

    getProducts() {
        if (this.current_id >= 1) {
            return this.products;
        } else {
            return undefined;
        }
    }

    addProduct(title, description, code, price, status = true, stock, category, thumbnails = []) {
        if (stock <= 0 || typeof stock != 'number') {
            resp = 9001;
            return resp;
        }

        let ids = [];
        let codes = [];
        Object.entries(this.products).forEach((producto) => {
            ids.push(producto[0]);
            codes.push(producto[1]['code']);
        });

        let max = Math.max(...ids);

        if (max == '-Infinity') {
            max = 0;
        }

        if (codes.includes(code)) {
            resp = 9002;
            return resp;
        }

        let this_item = {};

        this_item.id = max + 1;
        this_item.title = title;
        this_item.description = description;
        this_item.code = code;
        this_item.price = price;
        this_item.status = status;
        this_item.stock = stock;
        this_item.category = category;
        this_item.thumbnails = thumbnails;

        this.products[this_item.id] = this_item;

        fs.writeFileSync(path.join(this.file_path, this.file), JSON.stringify(this.products, null, 2), 'utf-8', finished);
        return resp;
    }

    editProduct(id, title, description, code, price, status = true, stock, category, thumbnails = []) {
        if (stock < 0 || typeof stock != 'number') {
            resp = 9001;
            return resp;
        }

        let this_item = this.products[id];

        this_item.id = id;
        this_item.title = title;
        this_item.description = description;
        this_item.code = code;
        this_item.price = price;
        this_item.status = status;
        this_item.stock = stock;
        this_item.category = category;
        this_item.thumbnails = thumbnails;

        this.products[id] = this_item;

        fs.writeFileSync(path.join(this.file_path, this.file), JSON.stringify(this.products, null, 2), 'utf-8', finished);
        return resp;
    }

    deleteProduct(id) {
        if (this.products[id]) {
            delete this.products[id];

            fs.writeFileSync(path.join(this.file_path, this.file), JSON.stringify(this.products, null, 2), 'utf-8', finished);
            return resp;
        }
        return resp;
    }
}

export function getProducts() {
    const all_products = new ProductsManager();
    const prod_list = all_products.getProducts();
    const max_products = Object.keys(all_products).length - 1;

    if (prod_list === undefined) {
        return JSON.stringify('There are no products');
    } else {
        return prod_list;
    }
}

export function getProduct(req, res) {
    const all_products = new ProductsManager();
    const new_pid = req.params.pid;
    const selected_product = all_products['products'][new_pid];

    if (new_pid !== undefined && selected_product !== undefined) {
        if (new_pid <= 0 || isNaN(new_pid)) {
            res.status(400).json({
                success: false,
                message: `The ID must be greater than zero and has to exist in the products list.`,
                data: {},
            });
        } else {
            res.status(200).json({
                success: true,
                message: `Here is the product with the id ${new_pid}`,
                data: selected_product,
            });
        }
    } else {
        res.status(400).json({
            success: false,
            message: `The ID must be greater than zero and has to exist in the products list.`,
            data: {},
        });
    }
}

export function postProductIo(title, description, code, price, status = true, stock, category, thumbnails = []) {
    const all_products = new ProductsManager();
    const prod_list = all_products.addProduct(title, description, code, price, status, stock, category, thumbnails);
}

export function postProduct(req, res) {
    const data = req.body;

    if (!data.title) {
        resp = 9005;
    } else if (typeof data.title !== 'string') {
        resp = 9004;
    }

    if (!data.description) {
        resp = 9005;
    } else if (typeof data.description !== 'string') {
        resp = 9004;
    }

    if (!data.code) {
        resp = 9005;
    } else if (typeof data.code !== 'string') {
        resp = 9004;
    }

    if (!data.price) {
        resp = 9005;
    } else if (typeof data.price !== 'number') {
        resp = 9004;
    }

    if (!data.stock) {
        resp = 9005;
    } else if (typeof data.stock !== 'number') {
        resp = 9004;
    }

    if (!data.category) {
        resp = 9005;
    } else if (typeof data.category !== 'string') {
        resp = 9004;
    }

    if (resp != 9099) {
        res.status(400).json({
            success: false,
            message: codes_translator(resp),
            data: {},
        });
    }

    const all_products = new ProductsManager();
    const prod_list = all_products.addProduct(
        data.title,
        data.description,
        data.code,
        data.price,
        data.status,
        data.stock,
        data.category,
        data.thumbnails
    );

    if (prod_list == 9099) {
        res.status(200).json({
            success: true,
            message: codes_translator(resp),
            data: {},
        });
    } else {
        res.status(400).json({
            success: false,
            message: codes_translator(resp),
            data: {},
        });
    }
}

export function putProduct(req, res) {
    const new_pid = req.params.pid;
    const data = req.body;

    if (!data.title) {
        resp = 9005;
    } else if (typeof data.title !== 'string') {
        resp = 9004;
    }

    if (!data.description) {
        resp = 9005;
    } else if (typeof data.description !== 'string') {
        resp = 9004;
    }

    if (!data.code) {
        resp = 9005;
    } else if (typeof data.code !== 'string') {
        resp = 9004;
    }

    if (!data.price) {
        resp = 9005;
    } else if (typeof data.price !== 'number') {
        resp = 9004;
    }

    if (!data.stock) {
        resp = 9005;
    } else if (typeof data.stock !== 'number') {
        resp = 9004;
    }

    if (!data.category) {
        resp = 9005;
    } else if (typeof data.category !== 'string') {
        resp = 9004;
    }

    if (resp != 9099) {
        res.status(400).json({
            success: false,
            message: codes_translator(resp),
            data: {},
        });
    }

    const all_products = new ProductsManager();
    const prod_list = all_products.editProduct(
        new_pid,
        data.title,
        data.description,
        data.code,
        data.price,
        data.status,
        data.stock,
        data.category,
        data.thumbnails
    );

    if (prod_list == 9099) {
        res.status(200).json({
            success: true,
            message: codes_translator(resp),
            data: {},
        });
    } else {
        res.status(400).json({
            success: false,
            message: codes_translator(resp),
            data: {},
        });
    }
}

export function deleteProduct(req, res) {
    const new_pid = req.params.pid;

    const all_products = new ProductsManager();
    const del_prod = all_products.deleteProduct(new_pid);

    if (del_prod == 9099) {
        res.status(200).json({
            success: true,
            message: codes_translator(resp),
            data: {},
        });
    } else {
        res.status(400).json({
            success: false,
            message: codes_translator(resp),
            data: {},
        });
    }
}