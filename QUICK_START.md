# 🚀 Быстрый старт деплоя Barbitch Client

## Краткая инструкция для опытных

### 1. На локальной машине

```bash
cd d:\barbitch\client

# Коммит файлов (БЕЗ .env.production!)
git add ecosystem.config.js deploy-pm2.sh .github/ nginx-barbitch.cz.conf
git commit -m "Add PM2 and GitHub Actions deploy config"
git push origin main
```

### 2. GitHub Secrets

Добавь в https://github.com/simon1400/barbitch-client/settings/secrets/actions:

- `SSH_HOST`: `157.90.169.205`
- `SSH_USER`: `root`
- `SSH_PRIVATE_KEY`: Твой SSH приватный ключ (уже используется в других репо для этого сервера)

### 3. На сервере (157.90.169.205)

```bash
# Создай директории
sudo mkdir -p /opt/barbitch-client /var/log/pm2
sudo chown -R $USER:$USER /opt/barbitch-client /var/log/pm2

# Клонируй репо
cd /opt/barbitch-client
git clone https://github.com/simon1400/barbitch-client.git .

# Создай .env (скопируй из .env.production локально)
nano .env

# Собери и запусти
npm ci
npm run build
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Настрой Nginx
sudo cp nginx-barbitch.cz.conf /etc/nginx/sites-available/barbitch.cz
sudo ln -s /etc/nginx/sites-available/barbitch.cz /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 4. DNS

Обнови DNS записи:
- A запись `@` → `157.90.169.205`
- A запись `www` → `157.90.169.205`

### 5. SSL (после DNS)

```bash
sudo certbot --nginx -d barbitch.cz -d www.barbitch.cz
```

## Готово! 🎉

- Сайт: https://barbitch.cz
- Логи: `pm2 logs barbitch-client`
- Статус: `pm2 list`

**Полная инструкция:** См. [PM2_DEPLOY_GUIDE.md](PM2_DEPLOY_GUIDE.md)
