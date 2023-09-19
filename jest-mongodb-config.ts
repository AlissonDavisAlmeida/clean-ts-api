const config = {
  mongodbMemoryServerOptions: {
    instance: {
      dbName: 'jest'
    },
    binary: {
      version: '5.9.0',
      skipMD5: true
    },
    autoStart: false
  }
};

export default config;
