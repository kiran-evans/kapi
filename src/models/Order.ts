import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../pg';
import { User } from './User';

export class Order extends Model { }

Order.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    items: {
        type: DataTypes.JSON,
        allowNull: false
    }
}, {
    sequelize
});

Order.belongsTo(User, {
    onDelete: 'SET NULL'
});