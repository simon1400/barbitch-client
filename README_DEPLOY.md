# 🚀 Barbitch Client - Деплой на Production

## 📚 Документация

### Главное руководство
**👉 [DEPLOY_INSTRUCTIONS.md](DEPLOY_INSTRUCTIONS.md)** - Начни отсюда! Пошаговая инструкция по деплою.

### Дополнительные гайды
- **[QUICK_START.md](QUICK_START.md)** - Краткая версия для опытных
- **[PM2_DEPLOY_GUIDE.md](PM2_DEPLOY_GUIDE.md)** - Подробная документация с troubleshooting

---

## 📦 Файлы конфигурации

| Файл | Описание |
|------|----------|
| [ecosystem.config.js](ecosystem.config.js) | PM2 конфигурация для запуска Next.js |
| [deploy-pm2.sh](deploy-pm2.sh) | Скрипт автоматического обновления |
| [.env.production](.env.production) | Production переменные окружения (НЕ коммитить!) |
| [.github/workflows/deploy.yml](.github/workflows/deploy.yml) | GitHub Actions для автодеплоя |
| [nginx-barbitch.cz.conf](nginx-barbitch.cz.conf) | Конфигурация Nginx |

---

## ⚙️ Конфигурация Production

```
Сервер:      157.90.169.205
Пользователь: root
Путь:        /opt/barbitch-client
Порт:        3000
Домен:       barbitch.cz (www → redirect)
API:         https://strapi.barbitch.cz
PM2 процесс: barbitch-client
```

---

## 🎯 Быстрый старт

### 1. Коммит и пуш
```bash
cd d:\barbitch\client
git add ecosystem.config.js deploy-pm2.sh .github/ nginx-barbitch.cz.conf *.md
git commit -m "Add PM2 deployment configuration"
git push origin main
```

### 2. GitHub Secrets
Добавь на https://github.com/simon1400/barbitch-client/settings/secrets/actions:
- `SSH_HOST` = `157.90.169.205`
- `SSH_USER` = `root`
- `SSH_PRIVATE_KEY` = Твой SSH ключ

### 3. На сервере
```bash
ssh root@157.90.169.205
sudo mkdir -p /opt/barbitch-client /var/log/pm2
sudo chown -R $USER:$USER /opt/barbitch-client /var/log/pm2
cd /opt/barbitch-client
git clone https://github.com/simon1400/barbitch-client.git .
nano .env  # Скопируй из .env.production
yarn install --frozen-lockfile
yarn build
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 4. Nginx
```bash
sudo cp /opt/barbitch-client/nginx-barbitch.cz.conf /etc/nginx/sites-available/barbitch.cz
sudo ln -s /etc/nginx/sites-available/barbitch.cz /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. DNS + SSL
Обнови DNS → Подожди → Установи SSL:
```bash
sudo certbot --nginx -d barbitch.cz -d www.barbitch.cz
```

---

## 📝 Полезные команды

```bash
# PM2
pm2 list
pm2 logs barbitch-client
pm2 restart barbitch-client
pm2 monit

# Обновление
cd /opt/barbitch-client
./deploy-pm2.sh

# Логи
tail -f /var/log/pm2/barbitch-client-error.log
sudo tail -f /var/log/nginx/error.log
```

---

## 🤖 Автоматический деплой

После настройки, каждый push в `main` автоматически деплоится через GitHub Actions:
https://github.com/simon1400/barbitch-client/actions

---

## ✅ Чеклист деплоя

- [ ] Файлы закоммичены (кроме .env.production)
- [ ] GitHub Secrets настроены
- [ ] Проект развернут на сервере
- [ ] PM2 запущен и настроен автозапуск
- [ ] Nginx настроен
- [ ] DNS обновлен
- [ ] SSL установлен
- [ ] Сайт работает: https://barbitch.cz
- [ ] GitHub Actions работает

---

**Полная инструкция:** [DEPLOY_INSTRUCTIONS.md](DEPLOY_INSTRUCTIONS.md)
