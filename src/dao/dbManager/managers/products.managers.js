import  productsModel  from '../models/product.model.js'

export default class Products {
    constructor(){
    }

    getProducts = async ({ limit, page, sort, query }) =>{
        const products = await productsModel.find().lean();
        return products;
    }

    getProductByiD = async (id) => {
        const productFind = await productsModel.find({_id : id});
        return productFind;
    }

    updateProduct = async (id, product) => {
        const productUpdate = await productsModel.updateOne({_id : id}, product);
        return productUpdate;
    }

    addProduct = async (product) => {
        const newProduct = await productsModel.create(product);
        return newProduct;
    }

    deleteProduct = async (id) =>{
        const productDeleted = await productsModel.deleteOne({_id : id});
        return productDeleted;
    }
}
