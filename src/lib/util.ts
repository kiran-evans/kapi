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
    // This array will be systematically shrunk so that only new items remain
    const remainingCartItems = [...reqCartItems];

    // This array will serve as the list of CartItems that already exists the the db
    const existingCartItemsInDb = Array<CartItem>();
    
    // This array serves as the result of adding existing cart items after they have been updated, and finally adding the remainingCartItems
    const consolidatedCartItems = Array<CartItem>();
    
    // Get the data for each of the CartItems that already exist in the db
    for (const cartItemId of pgCartItemIds) {
        const cartItem = await CartItem.findByPk(cartItemId);
        if (!cartItem) throw `No CartItem found with id=${cartItemId}`;
        existingCartItemsInDb.push(cartItem);
    }

    // Consolidate duplicate items (ones that have the same product_id and colour and size options)
    for (let i = 0; i < existingCartItemsInDb.length; i++) {
        for (let j = 0; i < remainingCartItems.length; j++) {
            // Check if they are a match, in which case consolidate them
            if (
                (existingCartItemsInDb[i].product_id === remainingCartItems[j].product_id)
                && (existingCartItemsInDb[i].colour === remainingCartItems[j].colour)
                && (existingCartItemsInDb[i].size === remainingCartItems[j].size)
            ) {
                // Increase the quantity of the item in the database
                const [affectedCount, affectedRows] = await CartItem.update({
                    quantity: existingCartItemsInDb[i].quantity + remainingCartItems[j].quantity
                }, {
                    where: {
                        id: existingCartItemsInDb[i].id
                    },
                    returning: true
                });
                // Remove the item at this index from the array of "new" items because it already exists and has now had its quantity updated
                remainingCartItems.splice(i, 1);
                // Add this item's updated body to the final output
                consolidatedCartItems.push(affectedRows[0]);
                continue;
            }
        }
    }

    // Create new cart_items in the db for the remaining items which WERE NOT duplicates
    for (const remainingItem of remainingCartItems) {
        consolidatedCartItems.push(await addNewCartItemToDb(remainingItem));
    }

    return consolidatedCartItems;
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