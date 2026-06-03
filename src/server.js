const app        = require('./app');
const connectMongo = require('./config/mongo');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const iniciar = async () => {
  try {
    await connectMongo();
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

iniciar();