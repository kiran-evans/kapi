import { fb } from "../firebase";
import { CartItem } from "../models/CartItem";

// Authenticate that the request has come from the logged in user
// Returns the idToken's uid if valid. Firebase Admin SDK will throw an error if invalid
export const authenticateRequest = async (reqIdToken: string): Promise<string> => {
    // Verify encoded id token passed from client (checks user has been signed in on the client side)
    const idToken = await fb.auth().verifyIdToken(reqIdToken);
    return idToken.uid;
}

export const addToCart = async (existingCartItemIds: Array<string>, cartItemToBeAdded: CartItem): Promise<Array<string>> => {
    const cartItems = Array<CartItem>();
    
    // Get the data for each of the CartItems that already exist in the db
    for (const cartItemId of existingCartItemIds) {
        const cartItem = await CartItem.findByPk(cartItemId);
        if (!cartItem) throw `No CartItem found with id=${cartItemId}`;
        cartItems.push(cartItem);
    }

    // Merge duplicate items (ones that have the same product_id and colour and size options)
    let found = false;
    for (const existingCartItem of cartItems) {
        if (
            cartItemToBeAdded.product_id === existingCartItem.product_id
            && cartItemToBeAdded.colour === existingCartItem.colour
            && cartItemToBeAdded.size === existingCartItem.size
        ) {
            // Update the quantity in the array and in the db
            existingCartItem.quantity += cartItemToBeAdded.quantity;
            found = true;
            await CartItem.update({
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
        const newCartItem = await CartItem.create({ ...cartItemToBeAdded });
        cartItems.push(newCartItem);
    }

    const cartItemIds = Array<string>();
    cartItems.forEach(cartItem => {
        cartItemIds.push(cartItem.id);
    });

    return cartItemIds;
}

export const addNewCartItemToDb = async (cartItem: CartItem): Promise<CartItem> => {
    const newCartItem = await CartItem.create({
        product_id: cartItem.product_id,
        quantity: 1,
        colour: cartItem.colour,
        size: cartItem.size
    });
    return newCartItem;
}