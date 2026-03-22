module.exports = {
  apps: [
    {
      name: 'barbitch-client',
      script: '.next/standalone/server.js',
      cwd: '/opt/barbitch-client',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      node_args: '--max-old-space-size=384',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0',
      },
      error_file: '/var/log/pm2/barbitch-client-error.log',
      out_file: '/var/log/pm2/barbitch-client-out.log',
      log_file: '/var/log/pm2/barbitch-client-combined.log',
      time: true,
      merge_logs: true,
    },
  ],
}
