// 1. Imports the validated variables from the new config
// This automatically runs the "check" I wrote in env.js
const { PORT } = require('./src/config/env.js'); 

const app = require('./src/app.js');
const connectDB = require('./src/config/connectDB.js');

// 2. Connects to the database first, then start the server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is verified and running on port ${PORT}`);
    });
}).catch(err => {
    console.error("Failed to start server:", err.message);
});
