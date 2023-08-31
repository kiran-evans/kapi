"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartItem = void 0;
const sequelize_1 = require("sequelize");
const pg_1 = require("../pg");
const Product_1 = require("./Product");
class CartItem extends sequelize_1.Model {
}
exports.CartItem = CartItem;
CartItem.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4
    },
    product_id: {
        type: sequelize_1.DataTypes.UUID,
        references: {
            model: Product_1.Product
        }
    },
    quantity: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0
        }
    },
    colour: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    size: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: pg_1.sequelize,
    tableName: 'cart_items'
});
