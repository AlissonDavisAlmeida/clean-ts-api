import { app } from './config/app';
import { mongoHelper } from '../infra/db/mongodb/helpers/mongo-helper';
import { config } from './config/env';

mongoHelper.connect(config.mongoUrl as string)
  .then(async () => {
    app.listen(config.port, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch(console.error);
