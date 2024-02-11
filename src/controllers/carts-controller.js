const fs = require('fs');
const path = require('path');
const carritosFile = './carrito.json';
const codes_translator = '../utils.js';
const finished = '../utils.js';

let resp = 9099;

class CartsManager {
    constructor(file_path = process.cwd(), file = carritosFile) {
        this.file_path = file_path;
        this.file = file;
        this.original_carts = {};
        this.current_id = 0;

        if (!fs.existsSync(path.join(this.file_path, this.file))) {
            try {
                fs.writeFileSync(path.join(this.file_path, this.file), JSON.stringify(this.original_carts, null, 2));
            } catch (e) {
                console.log(`Error: ${e}`);
            }
        }

        const read_carts = fs.readFileSync(path.join(this.file_path, this.file), 'utf-8');
        this.carts = JSON.parse(read_carts);
        this.current_id = Object.keys(this.carts)[Object.keys(this.carts).length - 1];
    }

    addCart() {
        let ids = [];
        Object.entries(this.carts).forEach((carrito) => {
            ids.push(carrito[0]);
        });

        let max = Math.max(...ids);

        if (max == '-Infinity') {
            max = 0;
        }

        let this_cart = {};

        let cid = max + 1;
        this.carts[cid] = this_cart;

        fs.writeFileSync(path.join(this.file_path, this.file), JSON.stringify(this.carts, null, 2), 'utf-8', finished);
        return resp;
    }

    addItemToCart(cid, pid, qty) {
        if (this.carts[cid] == undefined) {
            resp = 9101;
            return resp;
        }

        let done = false;

        Object.entries(this.carts[cid]['products']).forEach((prod) => {
            let qtyToAdd = 0;
            if (prod[1]['product'] == pid) {
                let current_qty = this.carts[cid]['products'][0]['quantity'];
                qtyToAdd = qty + current_qty;
                this.carts[cid]['products'][0]['quantity'] = qtyToAdd;
                done = true;
            }
        });

        if (!done) {
            let new_prod = { product: Number(pid), quantity: qty };
            this.carts[cid]['products'].push(new_prod);
        }

        fs.writeFileSync(path.join(this.file_path, this.file), JSON.stringify(this.carts, null, 2), 'utf-8', finished);
        return resp;
    }
}

exports.postCart = (req, res) => {
    const data = req.body;

    const all_carts = new CartsManager();
    const cart_list = all_carts.addCart();

    if (cart_list == 9099) {
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
};

exports.getCartProducts = (req, res) => {
    const all_carts = new CartsManager();
    const new_cid = req.params.cid;
    const selected_cart = all_carts.carts[new_cid];

    if (new_cid !== undefined && selected_cart !== undefined) {
        if (new_cid <= 0 || isNaN(new_cid)) {
            res.status(400).json({
                success: false,
                message: `The ID must be greater than zero and has to exist in the carts list.`,
                data: {},
            });
        } else {
            res.status(200).json({
                success: true,
                message: `Here are the products in the cart with the id ${new_cid}`,
                data: selected_cart['products'],
            });
        }
    } else {
        res.status(400).json({
            success: false,
            message: `The ID must be greater than zero and has to exist in the carts list.`,
            data: {},
        });
    }
};

exports.postProductToCart = (req, res) => {
    const data = req.body;
    const new_cid = req.params.cid;
    const new_pid = req.params.pid;

    if (new_pid != data.product) {
        resp = 9102;
    }

    if (resp != 9099) {
        res.status(400).json({
            success: false,
            message: codes_translator(resp),
            data: {},
        });
    }

    const add_prod = new CartsManager();
    const prod_to_add = add_prod.addItemToCart(new_cid, data.product, data.quantity);

    if (prod_to_add == 9099) {
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
};