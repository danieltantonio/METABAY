(() => {
    require('dotenv').config();
    const app = require('./src/app');
    const PORT = parseInt(process.env.PORT) || 5000;
    
    app.listen(PORT, () => console.log(`Server started on port: ${PORT} `));
})();