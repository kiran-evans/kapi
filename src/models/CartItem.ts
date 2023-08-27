import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../pg';
import { Product } from './Product';
import { User } from './User';

export class CartItem extends Model { }

CartItem.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0
        }
    },
    colour: {
        type: DataTypes.STRING,
        allowNull: false
    },
    size: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'cart_items'
});

CartItem.hasOne(Product);
CartItem.belongsTo(User, {
    onDelete: 'CASCADE'
});