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

export const toJsArray = (pgArray: string): Array<string | number> => {
    let jsArray: Array<string | number> = [];

    return jsArray;
}