// Importar el main.js compilado de NestJS
const { bootstrap } = require('../dist/main');

let app;

async function createApp() {
  if (!app) {
    try {
      // Usar la función bootstrap del main.js
      app = await bootstrap();
    } catch (error) {
      console.error('Error creating app:', error);
      throw error;
    }
  }
  return app;
}

module.exports = async (req, res) => {
  try {
    const app = await createApp();
    const handler = app.getHttpAdapter().getInstance();
    return handler(req, res);
  } catch (error) {
    console.error('Error in serverless function:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
