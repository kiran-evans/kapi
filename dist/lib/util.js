"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNewCartItemToDb = exports.addToCart = exports.authenticateRequest = void 0;
const firebase_1 = require("../firebase");
const CartItem_1 = require("../models/CartItem");
const authenticateRequest = async (reqIdToken) => {
    const idToken = await firebase_1.fb.auth().verifyIdToken(reqIdToken);
    return idToken.uid;
};
exports.authenticateRequest = authenticateRequest;
const addToCart = async (existingCartItemIds, cartItemToBeAdded) => {
    const cartItems = Array();
    for (const cartItemId of existingCartItemIds) {
        const cartItem = await CartItem_1.CartItem.findByPk(cartItemId);
        if (!cartItem)
            throw `No CartItem found with id=${cartItemId}`;
        cartItems.push(cartItem);
    }
    let found = false;
    for (const existingCartItem of cartItems) {
        if (cartItemToBeAdded.product_id === existingCartItem.product_id
            && cartItemToBeAdded.colour === existingCartItem.colour
            && cartItemToBeAdded.size === existingCartItem.size) {
            existingCartItem.quantity += cartItemToBeAdded.quantity;
            found = true;
            await CartItem_1.CartItem.update({
                quantity: existingCartItem.quantity
            }, {
                where: {
                    id: existingCartItem.id
                }
            });
            break;
        }
    }
    if (!found) {
        const newCartItem = await CartItem_1.CartItem.create({ ...cartItemToBeAdded });
        cartItems.push(newCartItem);
    }
    const cartItemIds = Array();
    cartItems.forEach(cartItem => {
        cartItemIds.push(cartItem.id);
    });
    return cartItemIds;
};
exports.addToCart = addToCart;
const addNewCartItemToDb = async (cartItem) => {
    const newCartItem = await CartItem_1.CartItem.create({
        product_id: cartItem.product_id,
        quantity: 1,
        colour: cartItem.colour,
        size: cartItem.size
    });
    return newCartItem;
};
exports.addNewCartItemToDb = addNewCartItemToDb;
