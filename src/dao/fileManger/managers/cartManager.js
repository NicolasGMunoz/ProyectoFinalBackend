import fs from 'fs';
import ProductManager from './productManager.js'
import { __dirname } from '../../../util.js'
import path from 'node:path';
import { v4 as uuidv4 } from "uuid";
const productsPath = path.join(__dirname, './files/products.json');
const productManager = new ProductManager(productsPath);


class CartManager {
    constructor(path) {
        this.path = path;
    }

    //method of return json carts
    getCart = async () => {
		if (fs.existsSync(this.path)) {
			const data = await fs.promises.readFile(this.path, "utf-8");
			const carts = JSON.parse(data);
			return carts;
		} else {
			return [];
		}
    }

    //method of create cart and push to JSON
    addCart = async () => {
        try {
            const carts = await this.getCart();
            let cart = {}

            if (carts.length === 0) {
                cart.id = 1;
            } else {
                cart.id = carts[carts.length - 1].id + 1;
            }

            cart.products = [];
            carts.push(cart);
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
            return cart;

        } catch (error) {
            console.log(error);
        }
    }

    //method of return carts of JSON by id
    getCartById = async (idCart) => {
        try {
            const carts = await this.getCart();
            const indexCart = carts.find(cart => cart.id === Number(idCart));

            if (!indexCart) {
                return false;
            }
            return indexCart;
        } catch (error) {
            console.log(error);
        }
    }

    //method of update carts in JSON
    updateCart = async (idCart, idProduct) => {
        try {
            const existProduct = await productManager.getProductById(idProduct)
            const carts = await this.getCart();
            const cartIndex = carts.findIndex(cart => cart.id === idCart);
            if (!existProduct){
                return false
            }
            if (cartIndex != -1) {
                const productIndex = carts[cartIndex].products.findIndex(product => product.id === idProduct);

                if (productIndex != -1) {
                    carts[cartIndex].products[productIndex].quantity++;
                } else {
                    carts[cartIndex].products.push({ id: idProduct, quantity: 1 });
                }

                await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
                return true;
            } else {
                return false;
            }

        } catch (error) {
            console.log(error);
        }
    }
}
export default CartManager;