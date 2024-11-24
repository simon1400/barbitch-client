module.exports = {
  apps: [
    {
      name: 'Barbitch client',
      script: 'npm start',
      env_production: {},
    },
  ],

  deploy: {
    production: {
      user: 'dimi',
      host: [process.env.SERVER_IP],
      ref: 'origin/main',
      repo: 'git@github.com:simon1400/tulsio-client-v2.git',
      path: '/home/dimi/app/barbitch/client',
      'post-deploy': 'npm i && npm run build && pm2 reload ecosystem.config.js --env production',
    },
  },
}
