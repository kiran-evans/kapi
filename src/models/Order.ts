import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../pg';

export class Order extends Model {
    declare id: string;
    declare items: Array<any>
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
    }
}, {
    sequelize,
    tableName: 'orders'
});