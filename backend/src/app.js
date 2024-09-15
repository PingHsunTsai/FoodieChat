const express = require('express');
const cors = require('cors');
const autoRoutes = require('./routes/auto_routes');
const { connectDB, sequelize } = require('./config/db');

const app = express();

app.use(cors()); 
app.use(express.json());

connectDB();

sequelize.sync()
    .then(() => console.log('Database & tables created!'))
    .catch((error) => {
        console.log('Error creating tables:', error);
    });

app.use('/api', autoRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));
