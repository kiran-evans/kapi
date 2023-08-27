import { fb } from "../firebase";
import { CartItem } from "../models/CartItem";

// Authenticate that the request has come from the logged in user
// Returns the idToken's uid if valid. Firebase Admin SDK will throw an error if invalid
export const authenticateRequest = async (reqIdToken: string): Promise<string> => {
    // Verify encoded id token passed from client (checks user has been signed in on the client side)
    const idToken = await fb.auth().verifyIdToken(reqIdToken);
    return idToken.uid;
}

export const consolidateCarts = async (pgCartItemIds: Array<string>, reqCartItems: Array<CartItem>): Promise<Array<CartItem>> => {
    /*
        Check each item in the cart from the db against the cart from the client.
        If two items have the exact same product_id, colour and size, then consolidate them into one item with the quantity
            value being the sum of their quantities.
    */
    const newCartItems = Array<any>();
    const dbCartItems = Array<any>();
    const clientCartItems = [...reqCartItems];
    
    // Get the data for each of the db cartItems
    for (const cartItemId of pgCartItemIds) {
        const cartItem = await CartItem.findByPk(cartItemId);
        dbCartItems.push(cartItem);
    }

    // Consolidate duplicate items (ones that have the same product_id and colour and size options)
    for (let i = 0; i < dbCartItems.length; i++) {
        for (let j = 0; i < clientCartItems.length; j++) {
            // Check if they are a match, in which case consolidate them
            if (
                (dbCartItems[i].product_id === clientCartItems[j].product_id)
                && (dbCartItems[i].colour === clientCartItems[j].colour)
                && (dbCartItems[i].size === clientCartItems[j].size)
            ) {
                newCartItems.push({
                    ...dbCartItems[i],
                    quantity: dbCartItems[i].quantity + clientCartItems[j].quantity
                });
                dbCartItems.splice(i, 1);
                dbCartItems.splice(j, 1);
                continue;
            }
        }
    }

    // Create new cart_items in the db for the reamining clientCartItems
    for (const clientCartItem of clientCartItems) {
        clientCartItem.id = await addNewCartItemToDb(clientCartItem);
    }

    // Add in the remaining items
    return newCartItems.concat(dbCartItems).concat(clientCartItems);
}

export const addNewCartItemToDb = async (cartItem: CartItem): Promise<string> => {
    const newCartItem = await CartItem.create({
        product_id: cartItem.product_id,
        quantity: 1,
        colour: cartItem.colour,
        size: cartItem.size
    });
    return newCartItem.id;
}