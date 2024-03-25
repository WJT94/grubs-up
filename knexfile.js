module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: 'https://ualaigiscnylojsuplwg.supabase.co',
      user: 'williamjt94@gmail.com',
      password: 'bassword',
      database: 'Grubs Up',
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './db/migrations',
    },
  },
};