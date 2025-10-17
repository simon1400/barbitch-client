# 🚀 Развертывание Barbitch Client на сервере с PM2

## Информация о сервере
- **IP:** 157.90.169.205
- **OS:** Ubuntu 22.04
- **Node, Yarn, NPM, PM2:** Уже установлены
- **Домен:** barbitch.cz (+ www.barbitch.cz)
- **Порт приложения:** 3000
- **GitHub:** https://github.com/simon1400/barbitch-client

---

## Часть 1: Подготовка на локальной машине

### 1. Убедись что все файлы созданы

```bash
cd d:\barbitch\client

# Проверь что все файлы на месте
ls -la ecosystem.config.js
ls -la deploy-pm2.sh
ls -la .env.production
ls -la .github/workflows/deploy.yml
```

### 2. Добавь файлы в .gitignore

Убедись что в [.gitignore](client/.gitignore) есть:

```
.env.production
.env.local
.env
```

**Важно:** `.env.production` НЕ должен быть в репозитории! Он содержит секретные ключи.

### 3. Закоммить и запушить файлы

```bash
cd d:\barbitch\client

# Добавь файлы (БЕЗ .env.production!)
git add ecosystem.config.js deploy-pm2.sh .github/

# Коммит
git commit -m "Add PM2 configuration and GitHub Actions deploy workflow"

# Пуш в main ветку
git push origin main
```

---

## Часть 2: Настройка GitHub Secrets

### 1. Открой настройки репозитория

Перейди на: https://github.com/simon1400/barbitch-client/settings/secrets/actions

### 2. Добавь следующие секреты

Нажми **"New repository secret"** и добавь:

| Имя секрета | Значение | Описание |
|------------|----------|----------|
| `SSH_HOST` | `157.90.169.205` | IP адрес сервера |
| `SSH_USER` | `root` | SSH пользователь |
| `SSH_PRIVATE_KEY` | Приватный SSH ключ | Тот же ключ что используется в других репо для этого сервера |

### 3. Получение SSH ключа

**Если у тебя уже есть SSH ключ для этого сервера:**

На локальной машине:
```bash
# Скопируй содержимое приватного ключа
cat ~/.ssh/id_rsa
# или
cat ~/.ssh/id_ed25519
```

**Если нужен новый SSH ключ:**

На локальной машине:
```bash
# Генерируй новую пару ключей
ssh-keygen -t ed25519 -C "github-actions-barbitch-client" -f ~/.ssh/barbitch_deploy

# Скопируй публичный ключ на сервер
ssh-copy-id -i ~/.ssh/barbitch_deploy.pub root@157.90.169.205

# Покажи приватный ключ (для GitHub Secret)
cat ~/.ssh/barbitch_deploy
```

Скопируй **весь вывод** (включая `-----BEGIN` и `-----END`) и вставь в GitHub Secret `SSH_PRIVATE_KEY`.

---

## Часть 3: Развертывание проекта на сервере

### 1. Подключись к серверу

```bash
ssh root@157.90.169.205
```

### 2. Создай директорию для проекта

```bash
# Создай директорию
sudo mkdir -p /opt/barbitch-client
sudo chown -R $USER:$USER /opt/barbitch-client

# Создай директорию для логов PM2
sudo mkdir -p /var/log/pm2
sudo chown -R $USER:$USER /var/log/pm2
```

### 3. Клонируй репозиторий

```bash
cd /opt/barbitch-client

# Клонируй репозиторий
git clone https://github.com/simon1400/barbitch-client.git .

# Проверь что файлы на месте
ls -la ecosystem.config.js deploy-pm2.sh
```

### 4. Создай .env файл на сервере

```bash
cd /opt/barbitch-client

# Создай .env файл
nano .env
```

**Вставь содержимое из `.env.production`** (с локальной машины):

```env
# Production Environment Variables

# API и Domain настройки
APP_DOMAIN=https://barbitch.cz
APP_API=https://strapi.barbitch.cz

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dvze1n6sj

# Facebook Pixel
PIXEL_ID=1129305392110526
PIXEL_ACCESS_TOKEN=...

# Instagram
IG_ACCESS_TOKEN=...

# Google API
GOOGLE_API=...

# Featurable Widget
FEATURABLE_WIDGET_ID=...

# Noona
NOONA_COMPANY_ID=...
NOONA_TOKEN=...

# MailerSend
MAILERSEND_FROM_EMAIL=info@barbitch.cz
MAILERSEND_API_KEY=...
MAILERSEND_BCC_EMAIL=info@barbitch.cz
MAILER_SEND_TOKEN=...
```

Сохрани: `Ctrl+O`, `Enter`, `Ctrl+X`

### 5. Установи зависимости и собери проект

```bash
cd /opt/barbitch-client

# Установи зависимости
yarn install --frozen-lockfile

# Собери Next.js приложение
yarn build
```

**Примечание:** Билд может занять 2-5 минут.

### 6. Запусти проект через PM2

```bash
cd /opt/barbitch-client

# Сделай deploy скрипт исполняемым
chmod +x deploy-pm2.sh

# Запусти через PM2
pm2 start ecosystem.config.js

# Сохрани конфигурацию PM2
pm2 save

# Настрой автозапуск PM2 при перезагрузке сервера
pm2 startup
# Выполни команду которую выдаст PM2 (обычно начинается с sudo)
```

### 7. Проверь что проект работает

```bash
# Статус PM2
pm2 list

# Логи в реальном времени
pm2 logs barbitch-client

# Проверь что Next.js отвечает
curl http://localhost:3000
```

---

## Часть 4: Настройка Nginx

### 1. Создай конфигурацию Nginx для barbitch.cz

```bash
sudo nano /etc/nginx/sites-available/barbitch.cz
```

**Вставь:**

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

# Если все ОК, перезапусти Nginx
sudo systemctl reload nginx
```

### 3. Проверь доступность

Открой в браузере: http://barbitch.cz

**Если домен еще не перенаправлен:**
- Проверь через IP: http://157.90.169.205
- Или добавь в hosts файл на локальной машине:
  ```
  157.90.169.205 barbitch.cz
  ```

---

## Часть 5: Перенаправление домена

### 1. Обнови DNS записи у регистратора домена

Измени A записи для `barbitch.cz`:

| Тип | Имя | Значение | TTL |
|-----|-----|----------|-----|
| A | @ | 157.90.169.205 | 3600 |
| A | www | 157.90.169.205 | 3600 |

### 2. Проверь DNS

```bash
# Проверь что DNS обновился (может занять до 24 часов)
nslookup barbitch.cz
dig barbitch.cz
```

### 3. Подожди распространения DNS

DNS может обновляться от 5 минут до 24 часов, в зависимости от TTL старых записей.

---

## Часть 6: Установка SSL сертификата

**После того как DNS обновился**, установи SSL:

```bash
# Установи Let's Encrypt сертификат
sudo certbot --nginx -d barbitch.cz -d www.barbitch.cz

# Следуй инструкциям:
# - Email: твой email
# - Agree to Terms: Yes (Y)
# - Share email: No (N)
# - Redirect HTTP to HTTPS: Yes (2)
```

**Готово!** 🎉

Твой проект доступен на: https://barbitch.cz

---

## 📝 Полезные команды PM2

### Управление процессом

```bash
# Список процессов
pm2 list

# Логи
pm2 logs barbitch-client
pm2 logs barbitch-client --lines 100

# Остановить
pm2 stop barbitch-client

# Запустить
pm2 start barbitch-client

# Перезапустить
pm2 restart barbitch-client

# Удалить из PM2
pm2 delete barbitch-client

# Мониторинг
pm2 monit

# Информация о процессе
pm2 show barbitch-client
```

### Обновление проекта вручную

```bash
cd /opt/barbitch-client

# Pull изменений
git pull origin main

# Запусти deploy скрипт
./deploy-pm2.sh
```

### Просмотр логов

```bash
# PM2 логи
pm2 logs barbitch-client

# Системные логи
tail -f /var/log/pm2/barbitch-client-error.log
tail -f /var/log/pm2/barbitch-client-out.log

# Nginx логи
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## 🤖 Автоматический деплой через GitHub Actions

После первоначальной настройки, каждый push в `main` ветку будет автоматически деплоить проект на сервер.

### Как это работает

1. Ты пушишь код в `main` ветку на GitHub
2. GitHub Actions автоматически запускается
3. Подключается к серверу по SSH
4. Делает `git pull`, `yarn install`, `yarn build`
5. Перезапускает PM2 процесс
6. Готово! 🎉

### Проверка деплоя

Проверь статус на: https://github.com/simon1400/barbitch-client/actions

---

## 🔧 Troubleshooting

### Проблема: Порт 3000 занят

```bash
sudo lsof -i :3000
sudo kill -9 PID
pm2 restart barbitch-client
```

### Проблема: PM2 не запускается после перезагрузки

```bash
pm2 startup
pm2 save
# Выполни команду которую выдаст PM2
```

### Проблема: 502 Bad Gateway

```bash
# Проверь что Next.js работает
pm2 list
curl http://localhost:3000

# Проверь логи
pm2 logs barbitch-client

# Перезапусти
pm2 restart barbitch-client
sudo systemctl reload nginx
```

### Проблема: Build падает из-за памяти

```bash
# Увеличь лимит памяти для Node
export NODE_OPTIONS="--max-old-space-size=4096"
yarn build
```

### Проблема: Env переменные не подхватываются

```bash
# Проверь .env файл
cd /opt/barbitch-client
cat .env

# Убедись что переменные есть
cat .env | grep APP_API

# Перезапусти PM2
pm2 restart barbitch-client
```

### Проблема: GitHub Actions деплой не работает

```bash
# Проверь что SSH ключ правильно добавлен
ssh root@157.90.169.205

# Проверь логи на GitHub Actions
# https://github.com/simon1400/barbitch-client/actions

# Проверь SSH доступ для GitHub
ssh-keyscan -H 157.90.169.205
```

### Проблема: Next.js не находит модули после деплоя

```bash
cd /opt/barbitch-client

# Удали node_modules и переустанови
rm -rf node_modules
rm yarn.lock
yarn install
yarn build
pm2 restart barbitch-client
```

---

## 📊 Проверка работы других проектов на PM2

```bash
# Список всех PM2 процессов
pm2 list

# Если нужно перезапустить другой проект
pm2 restart OTHER_PROJECT_NAME
```

---

## ✅ Чеклист развертывания

### Локальная машина
- [ ] Создан `ecosystem.config.js`
- [ ] Создан `deploy-pm2.sh`
- [ ] Создан `.env.production` (НЕ в git!)
- [ ] Создан `.github/workflows/deploy.yml`
- [ ] Файлы закоммичены и запушены в `main`

### GitHub
- [ ] Добавлен секрет `SSH_HOST`
- [ ] Добавлен секрет `SSH_USER`
- [ ] Добавлен секрет `SSH_PRIVATE_KEY`

### Сервер
- [ ] Создана директория `/opt/barbitch-client`
- [ ] Репозиторий склонирован
- [ ] Файл `.env` настроен с правильными данными
- [ ] Выполнена `yarn install`
- [ ] Выполнена `yarn build`
- [ ] Проект запущен через PM2
- [ ] PM2 сохранен (`pm2 save`)
- [ ] PM2 автозапуск настроен (`pm2 startup`)
- [ ] Nginx конфигурация создана
- [ ] Nginx перезапущен

### DNS и SSL
- [ ] DNS записи обновлены на новый IP
- [ ] DNS распространился (проверка через `nslookup`)
- [ ] SSL сертификат установлен (`certbot`)
- [ ] Сайт доступен по HTTPS

### Тестирование
- [ ] Сайт открывается в браузере
- [ ] GitHub Actions деплой работает
- [ ] Логи проверены (`pm2 logs barbitch-client`)
- [ ] PM2 автозапуск работает после перезагрузки

---

## 🔐 Безопасность

### Обязательно проверь:

1. **`.env.production` НЕ в git репозитории**
   ```bash
   git ls-files | grep .env.production
   # Должно быть пусто!
   ```

2. **SSH ключи защищены**
   ```bash
   chmod 600 ~/.ssh/id_rsa
   ```

3. **Firewall настроен**
   ```bash
   sudo ufw status
   # Должны быть открыты только 22, 80, 443
   ```

---

**Успешного деплоя! 🚀**

Если возникнут вопросы - проверь:
1. PM2 логи: `pm2 logs barbitch-client`
2. Nginx логи: `sudo tail -f /var/log/nginx/error.log`
3. GitHub Actions: https://github.com/simon1400/barbitch-client/actions
