module.exports = {
  apps: [
    {
      name: 'raasbot',
      script: 'node_modules/.bin/next',
      args: 'start',
      cwd: '/var/www/raasbot',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: '/var/log/raasbot/error.log',
      out_file: '/var/log/raasbot/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      max_memory_restart: '512M',
    },
  ],
};
