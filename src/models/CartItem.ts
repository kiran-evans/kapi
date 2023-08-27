import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../pg';
import { Product } from './Product';

export class CartItem extends Model {
    declare id: string;
    declare product_id: string;
    declare quantity: number;
    declare colour: string;
    declare size: string;
}

CartItem.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    product_id: {  
        type: DataTypes.UUID,
        references: {
            model: Product
        }
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