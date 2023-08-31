"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const pg_1 = require("../pg");
class User extends sequelize_1.Model {
}
exports.User = User;
User.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4
    },
    auth_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    cart_item_ids: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.UUID),
        allowNull: false,
        defaultValue: []
    },
    order_ids: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.UUID),
        allowNull: false,
        defaultValue: []
    }
}, {
    sequelize: pg_1.sequelize,
    tableName: 'users'
});
