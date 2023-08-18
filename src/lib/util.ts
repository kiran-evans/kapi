import { fb } from "../firebase";

export const toPgArray = (jsArray: Array<string | number>): string => {
    let pgArray = "'{";

    for (let i = 0; i < jsArray.length; i++) {
        pgArray += `"${jsArray[i]}"`;        

        // If not the last element
        if (i < jsArray.length - 1) pgArray += ",";
    }

    pgArray += "}'";
    
    return pgArray;
}

// Authenticate that the request has come from the logged in user
// Returns the idToken's uid if valid. Firebase Admin SDK will throw an error if invalid
export const authenticateRequest = async (reqIdToken: string): Promise<string> => {
    // Verify encoded id token passed from client (checks user has been signed in on the client side)
    const idToken = await fb.auth().verifyIdToken(reqIdToken);
    return idToken.uid;
}