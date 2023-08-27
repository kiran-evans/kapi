import { DataTypes } from 'sequelize';
import { db } from "../pg";

export const Product = db.define('Product', {
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
});

export const User = db.define('User', {
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
});

export const CartItem = db.define('CartItem', {
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
    tableName: 'cart_items'
});

export const Order = db.define('Order', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    items: {
        type: DataTypes.JSON,
        allowNull: false
    }
});

// Associations
User.hasMany(CartItem);
CartItem.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

CartItem.hasOne(Product);