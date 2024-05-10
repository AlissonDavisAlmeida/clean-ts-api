export const config = {
  mongoUrl: process.env.MONGO_URL ?? 'mongodb+srv://Alisson:hwDtOECNmMcd2Cap@cluster0.pgaza.mongodb.net/clean-node-api?retryWrites=true&w=majority',
  port: process.env.PORT ?? 3000,
  jwtSecret: process.env.JWT_SECRET ?? 'tj670==5H'
};
