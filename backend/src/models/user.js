const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING(255), 
        allowNull: false,
        unique: true, 
        validate: {
            isEmail: true, 
        },
    },
    password: {
        type: DataTypes.STRING(255),  
        allowNull: false,
    },
    userName: {
        type: DataTypes.STRING(50),  
        allowNull: false,
        unique: true,  
    },
    favoriteDrink: {
        type: DataTypes.STRING(100),  
        allowNull: true,  
    },
    favoriteFood: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    livingCountry: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
}, {
    timestamps: true,  
    indexes: [
        {
            unique: true,
            fields: ['email'],  // Index on email
        },
        {
            unique: true,
            fields: ['userName'],  // Index on userName for faster search
        }
    ],
});

module.exports = User;
