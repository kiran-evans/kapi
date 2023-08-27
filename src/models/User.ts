import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../pg';
import { CartItem } from './CartItem';
import { Order } from './Order';

export class User extends Model { }

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
    }
}, {
    sequelize
});

User.hasMany(Order);
User.hasMany(CartItem);