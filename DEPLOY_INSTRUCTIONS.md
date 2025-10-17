# 🚀 Инструкция по деплою Barbitch Client

## ✅ Что уже готово

Все файлы для деплоя созданы и настроены:

- ✅ [ecosystem.config.js](ecosystem.config.js) - PM2 конфигурация
- ✅ [deploy-pm2.sh](deploy-pm2.sh) - Скрипт обновления
- ✅ [.env.production](.env.production) - Production переменные окружения
- ✅ [.github/workflows/deploy.yml](.github/workflows/deploy.yml) - GitHub Actions
- ✅ [nginx-barbitch.cz.conf](nginx-barbitch.cz.conf) - Nginx конфигурация
- ✅ [PM2_DEPLOY_GUIDE.md](PM2_DEPLOY_GUIDE.md) - Подробное руководство
- ✅ [QUICK_START.md](QUICK_START.md) - Быстрый старт

## 📋 Конфигурация

- **Сервер:** 157.90.169.205
- **Пользователь:** root
- **Путь:** /opt/barbitch-client
- **Порт:** 3000
- **Домены:** barbitch.cz (www → redirect)
- **API:** https://strapi.barbitch.cz
- **PM2 процесс:** barbitch-client

---

## 🎯 Шаг 1: Коммит файлов в GitHub

**ВАЖНО:** `.env.production` НЕ должен попасть в git (уже в .gitignore)!

```bash
cd d:\barbitch\client

# Проверь что .env.production не будет закоммичен
git status

# Добавь только нужные файлы
git add ecosystem.config.js deploy-pm2.sh .github/ nginx-barbitch.cz.conf PM2_DEPLOY_GUIDE.md QUICK_START.md DEPLOY_INSTRUCTIONS.md

# Коммит
git commit -m "Add PM2 deployment configuration and GitHub Actions workflow"

# Пуш в main (это НЕ запустит деплой, т.к. на сервере еще нет проекта)
git push origin main
```

---

## 🔑 Шаг 2: Настройка GitHub Secrets

Перейди на: https://github.com/simon1400/barbitch-client/settings/secrets/actions

### Добавь 3 секрета:

#### 1. SSH_HOST
```
157.90.169.205
```

#### 2. SSH_USER
```
root
```

#### 3. SSH_PRIVATE_KEY
```
Используй тот же SSH приватный ключ, что и в других твоих репо для этого сервера.

Если не помнишь:
1. Открой другой репо с деплоем на этот сервер
2. Settings → Secrets → Actions
3. Скопируй или используй тот же ключ
```

**Примечание:** Если нужен новый ключ - см. раздел "Получение SSH ключа" в [PM2_DEPLOY_GUIDE.md](PM2_DEPLOY_GUIDE.md#3-получение-ssh-ключа)

---

## 🖥️ Шаг 3: Развертывание на сервере

### 1. Подключись к серверу

```bash
ssh root@157.90.169.205
```

### 2. Создай директории

```bash
sudo mkdir -p /opt/barbitch-client /var/log/pm2
sudo chown -R $USER:$USER /opt/barbitch-client /var/log/pm2
```

### 3. Клонируй репозиторий

```bash
cd /opt/barbitch-client
git clone https://github.com/simon1400/barbitch-client.git .
```

### 4. Создай .env файл

```bash
cd /opt/barbitch-client
nano .env
```

**Скопируй содержимое из `.env.production` (с локальной машины):**

```env
# API и Domain настройки
APP_DOMAIN=https://barbitch.cz
APP_API=https://strapi.barbitch.cz

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dvze1n6sj

# Facebook Pixel
PIXEL_ID=1129305392110526
PIXEL_ACCESS_TOKEN=EAAWGTex9w1EBO6gBQvE52JESuwtC8AWLrPVVyBovvXTDrPUgQb96GPZBEFqh1U1c4lCC9pRgP4HQcxK9VuqZBe0FfbUmLjgWm8CaBkZCz9dFZCaqLz0677lKAOcHwZBJYZCIp25VFzFwe9dMBn7vAkiLkAxaQcndux7dIdgX0Tw72e2SUUfPz0c6QpsSRCDJ87RgZDZD

# Instagram
IG_ACCESS_TOKEN=EAASPfk4hNWQBO5PER8RRJZBffFmyvVsfuLEtlYT8qAhaiPR9y9NwEY4NZC6AUzfSV3ibPevGyMKTTalaCQMqnUZCEIfAXn9DkRZAcUtyjj7bIBzt4CrJgPZC6O8ZCH9QhycdMeJJz38rCXooBzEfH9VDZC3yFf5OcJhKrWyZBx3DJ4ItE1artF7fAz9z7XXhY2qeb2e0H4bnqzRGMhzi55PZCMXQw

# Google API
GOOGLE_API=AIzaSyBINt2g70CC81OwkopB4LWz9KO0ksISkMA

# Featurable Widget
FEATURABLE_WIDGET_ID=bbe69fa5-27f1-4bf4-9e13-435adbf37228

# Noona
NOONA_COMPANY_ID=8qcJwRg6dbNh6Gqvm
NOONA_TOKEN=927ae84e9d3cef2c1c8757e665559fe07e2783718a1c4456f33d6ba431a9f367

# MailerSend
MAILERSEND_FROM_EMAIL=info@barbitch.cz
MAILERSEND_API_KEY=mlsn.417032a53549827bbfe632c1832bb1f1c229be9c99dad79293267db568850a6c
MAILERSEND_BCC_EMAIL=info@barbitch.cz
MAILER_SEND_TOKEN=mlsn.25adab236be8b40d089a8766c47f8caea95dc4ebea7f7bf6d8f24c3ed05537a8
```

Сохрани: `Ctrl+O`, `Enter`, `Ctrl+X`

### 5. Установи зависимости и собери проект

```bash
cd /opt/barbitch-client

# Установи зависимости (займет 1-2 минуты)
yarn install --frozen-lockfile

# Собери Next.js (займет 2-5 минут)
yarn build
```

### 6. Запусти через PM2

```bash
cd /opt/barbitch-client

# Сделай скрипт исполняемым
chmod +x deploy-pm2.sh

# Запусти PM2
pm2 start ecosystem.config.js

# Сохрани конфигурацию
pm2 save

# Настрой автозапуск при перезагрузке
pm2 startup
# Выполни команду которую выдаст PM2!
```

### 7. Проверь что работает

```bash
# Статус PM2
pm2 list

# Логи
pm2 logs barbitch-client

# Проверь локально
curl http://localhost:3000
```

---

## 🌐 Шаг 4: Настройка Nginx

### 1. Создай конфигурацию

```bash
sudo nano /etc/nginx/sites-available/barbitch.cz
```

**Скопируй содержимое из [nginx-barbitch.cz.conf](nginx-barbitch.cz.conf) или вставь:**

```nginx
# Redirect www to non-www
server {
    listen 80;
    listen [::]:80;
    server_name www.barbitch.cz;
    return 301 https://barbitch.cz$request_uri;
}

# Main server block
server {
    listen 80;
    listen [::]:80;
    server_name barbitch.cz;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Proxy to Next.js app
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Таймауты
        proxy_connect_timeout 600s;
        proxy_send_timeout 600s;
        proxy_read_timeout 600s;

        # Размер загружаемых файлов
        client_max_body_size 100M;
    }

    # Next.js static files
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 60m;
        add_header Cache-Control "public, immutable";
    }

    # Images and media
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Сохрани: `Ctrl+O`, `Enter`, `Ctrl+X`

### 2. Активируй конфигурацию

```bash
# Создай симлинк
sudo ln -s /etc/nginx/sites-available/barbitch.cz /etc/nginx/sites-enabled/

# Проверь конфигурацию
sudo nginx -t

# Перезапусти Nginx
sudo systemctl reload nginx
```

---

## 🌍 Шаг 5: Обновление DNS

### Обнови DNS записи у регистратора домена

| Тип | Имя | Значение | TTL |
|-----|-----|----------|-----|
| A | @ | 157.90.169.205 | 3600 |
| A | www | 157.90.169.205 | 3600 |

### Проверь DNS

```bash
# На локальной машине
nslookup barbitch.cz
dig barbitch.cz

# Должен вернуть: 157.90.169.205
```

**Примечание:** DNS обновление может занять от 5 минут до 24 часов.

---

## 🔒 Шаг 6: Установка SSL (после обновления DNS)

**ВАЖНО:** Подожди пока DNS обновится!

```bash
# На сервере
sudo certbot --nginx -d barbitch.cz -d www.barbitch.cz

# Следуй инструкциям:
# - Email: твой email
# - Agree to Terms: Y
# - Share email: N
# - Redirect HTTP to HTTPS: 2 (Yes)
```

---

## 🎉 Готово!

Твой сайт доступен на:
- 🌐 https://barbitch.cz
- 🔄 https://www.barbitch.cz (редирект на barbitch.cz)

### Проверь:

```bash
# На сервере
pm2 list
pm2 logs barbitch-client

# Открой в браузере
https://barbitch.cz
```

---

## 🤖 Автоматический деплой

Теперь каждый push в `main` ветку будет автоматически:
1. Подключаться к серверу
2. Делать `git pull`
3. Устанавливать зависимости
4. Собирать проект
5. Перезапускать PM2

### Проверка деплоя:
https://github.com/simon1400/barbitch-client/actions

---

## 📝 Полезные команды

### PM2
```bash
pm2 list                        # Список процессов
pm2 logs barbitch-client        # Логи
pm2 restart barbitch-client     # Перезапуск
pm2 stop barbitch-client        # Остановка
pm2 monit                       # Мониторинг
```

### Обновление вручную
```bash
cd /opt/barbitch-client
./deploy-pm2.sh
```

### Логи
```bash
pm2 logs barbitch-client
tail -f /var/log/pm2/barbitch-client-error.log
sudo tail -f /var/log/nginx/error.log
```

---

## 🔧 Troubleshooting

### Порт 3000 занят
```bash
sudo lsof -i :3000
sudo kill -9 PID
pm2 restart barbitch-client
```

### 502 Bad Gateway
```bash
pm2 list
curl http://localhost:3000
pm2 logs barbitch-client
pm2 restart barbitch-client
sudo systemctl reload nginx
```

### Build падает
```bash
export NODE_OPTIONS="--max-old-space-size=4096"
yarn build
```

### GitHub Actions не работает
- Проверь GitHub Secrets
- Проверь логи: https://github.com/simon1400/barbitch-client/actions
- Проверь SSH доступ: `ssh root@157.90.169.205`

---

## ✅ Чеклист

### Локально
- [ ] Файлы закоммичены и запушены
- [ ] `.env.production` НЕ в git

### GitHub
- [ ] `SSH_HOST` добавлен
- [ ] `SSH_USER` добавлен
- [ ] `SSH_PRIVATE_KEY` добавлен

### Сервер
- [ ] Директория `/opt/barbitch-client` создана
- [ ] Репо склонировано
- [ ] `.env` файл создан
- [ ] `yarn install` выполнен
- [ ] `yarn build` выполнен
- [ ] PM2 запущен и сохранен
- [ ] PM2 startup настроен
- [ ] Nginx настроен

### DNS и SSL
- [ ] DNS обновлен
- [ ] SSL установлен
- [ ] Сайт открывается по HTTPS

### Тестирование
- [ ] Сайт работает
- [ ] GitHub Actions работает
- [ ] PM2 автозапуск работает

---

**Успешного деплоя! 🚀**

Если вопросы - см. [PM2_DEPLOY_GUIDE.md](PM2_DEPLOY_GUIDE.md)
