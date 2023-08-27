import { fb } from "../firebase";
import { pool } from "../pg";
import { CartItem } from "./model";

export const toPgArray = (jsArray: Array<string | number>): string => {
    let pgArray = "'{";

    // Only add items to the array if there are any in the first place
    if (jsArray.length > 0) {
        for (let i = 0; i < jsArray.length; i++) {
            pgArray += `"${jsArray[i]}"`;        

            // If not the last element
            if (i < jsArray.length - 1) pgArray += ",";
        }
    }

    pgArray += "}'";
    
    return pgArray;
}

export const toJsArray = (pgArray: string): Array<string | number> => {
    // Remove the opening and closing curly brackets
    let noBrackets = pgArray.slice(1, pgArray.length - 1);

    // If there is nothing remaining in the string, return an empty array
    if (noBrackets.length === 0) return [];

    // Split the remaining string by the delimiter ,
    const jsArray = noBrackets.split(",");

    return jsArray;
}

// Authenticate that the request has come from the logged in user
// Returns the idToken's uid if valid. Firebase Admin SDK will throw an error if invalid
export const authenticateRequest = async (reqIdToken: string): Promise<string> => {
    // Verify encoded id token passed from client (checks user has been signed in on the client side)
    const idToken = await fb.auth().verifyIdToken(reqIdToken);
    return idToken.uid;
}

export const consolidateCarts = async (pgCartItemIds: string, reqCartItems: Array<CartItem>): Promise<Array<CartItem>> => {
    /*
        Check each item in the cart from the db against the cart from the client.
        If two items have the exact same product_id, colour and size, then consolidate them into one item with the quantity
            value being the sum of their quantities.
    */
    const newCartItems = Array<any>();
    const dbCartItems = Array<any>();
    const clientCartItems = [...reqCartItems];
    
    // Get the data for each of the db cartItems
    const dbCartItemIds = toJsArray(pgCartItemIds);
    for (const cartItemId of dbCartItemIds) {
        const { rows } = await pool.query(`SELECT * FROM cart_items WHERE id='${cartItemId}'`);
        dbCartItems.push(rows[0]);
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
    const { rows } = await pool.query(`
        INSERT INTO cart_items(
            product_id,
            quantity,
            colour,
            size
        ) VALUES (
            '${cartItem.product_id}',
            1,
            '${cartItem.colour}',
            '${cartItem.size}'
        ) RETURNING id
    `);    
    return rows[0].id;
}