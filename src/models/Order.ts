import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../pg';
import { CartItem } from './CartItem';

export class Order extends Model {
    declare id: string;
    declare items: Array<CartItem>;
    declare total: number;
    declare paid: boolean;
}

Order.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    items: {
        type: DataTypes.ARRAY(DataTypes.JSON),
        allowNull: false
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    paid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize,
    tableName: 'orders'
});