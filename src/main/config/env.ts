export const config = {
  mongoUrl: process.env.MONGO_URL,
  port: process.env.PORT ?? 3000,
  jwtSecret: process.env.JWT_SECRET ?? 'tj670==5H'
};
