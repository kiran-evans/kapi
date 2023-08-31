import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../pg';

export class User extends Model {
    declare id: string;
    declare auth_id: string;
    declare cart_item_ids: Array<string>;
    declare order_ids: Array<string>
}

User.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    auth_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    cart_item_ids: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        allowNull: false,
        defaultValue: []
    },
    order_ids: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        allowNull: false,
        defaultValue: []
    }
}, {
    sequelize,
    tableName: 'users'
});