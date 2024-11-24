module.exports = {
  apps: [
    {
      name: 'Tulsio client',
      script: 'npm start',
      env_production: {},
    },
  ],

  deploy: {
    production: {
      user: 'dimi',
      host: ['89.221.216.23'],
      ref: 'origin/main',
      repo: 'git@github.com:simon1400/tulsio-client-v2.git',
      path: '/home/dimi/app/tulsio/client',
      'post-deploy': 'npm i && npm run build && pm2 reload ecosystem.config.js --env production',
    },
  },
}
