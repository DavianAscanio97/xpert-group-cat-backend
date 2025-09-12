const { bootstrap } = require('./dist/main');

let app;

module.exports = async (req, res) => {
  try {
    if (!app) {
      app = await bootstrap();
    }
    
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
