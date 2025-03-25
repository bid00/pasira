import cors from 'cors';

const corsMiddleware = (app) => {
  // Add CORS to the express app
  app.use(
    cors({
      origin:'*' , 
      methods: ["GET", "POST","PATCH","PUT"],
    })
  );
};

export default corsMiddleware;