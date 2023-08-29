import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../pg';

export class Product extends Model {
    declare id: string;
    declare name: string;
    declare description: string;
    declare price: number;
    declare img_url: string;
    declare categories: Array<String>;
    declare sizes: Array<string>;
    declare colours: Array<string>;
}

Product.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    img_url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    categories: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false
    },
    sizes: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false
    },
    colours: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'products'
});