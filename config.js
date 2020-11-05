module.exports = {
  api: {
    port: process.env.API_PORT || 3000,
    host: process.env.API_HOST || 'localhost',
  },
  jwt: {
    secret: process.env.JWT_SECRET || '70p_S3cr37',
  },
  tmdb: {
    api_key: process.env.TMDB_API_KEY || '17b23ec7ba499153d8f65b658afa4276',
  },
  env: {
    node_env: process.env.ENV || 'development',
  },
};
