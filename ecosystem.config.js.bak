module.exports = {
  apps: [
    {
      name: 'barbitch-client',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: '/opt/barbitch-client',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: '/var/log/pm2/barbitch-client-error.log',
      out_file: '/var/log/pm2/barbitch-client-out.log',
      log_file: '/var/log/pm2/barbitch-client-combined.log',
      time: true,
      merge_logs: true,
    },
  ],
}
