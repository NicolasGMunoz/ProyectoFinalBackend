import  cartsModel  from '../models/cart.model.js'


export default class Carts{
    constructor(){}; 

    getCart = async () => {
        const carts = await cartsModel.find().lean();
        return carts;
    }

    getCartByID = async (id) =>{
        const cartByID = await cartsModel.find({_id : id});
        return cartByID;
    }

    addCart = async (cart) => {
        const newCart = await cartsModel.create(cart);
        return newCart;
    }

    updateCart = async (id, product) => {
        const cartUpdated = await cartsModel.updateOne({_id : id}, product);
        return cartUpdated;
    } 

    deleteCart = async (id) => {
        const cartDeleted = await cartsModel.deleteOne({_id : id});
        return cartDeleted;
    }

    updateCartWithProducts = async (cartId, productsUpdate) => {
        const updateCart = await cartsModel.findByIdAndUpdate(
            cartId,
            {$set: { products: productsUpdate}},
            {new: true, runValidators: true}
        );
        return updateCart;
    };
}