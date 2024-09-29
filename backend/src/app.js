const express = require('express');
const cors = require('cors');
const autoRoutes = require('./routes/auto_routes');
const { connectDB } = require('./config/db');
const { syncModels } = require('./models/index');
const { Graph } = require('./controllers');

const app = express();

app.use(cors()); 
app.use(express.json());

connectDB();

app.use('/api', autoRoutes);

app.listen(5000, async () => {
    console.log('Server running on port 5000');
    
    // Sync all models and associations
    await syncModels();

    const graphInstance = new Graph();
    graphInstance.dumpGraph();
});
