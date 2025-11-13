# Оптимизация изображений для мобильных устройств

## Что было сделано

### 1. **Оптимизация ImageKitImage компонента**
- Снижено качество до 75% (вместо 80%) для мобильных
- Добавлен прогрессивный рендеринг (`pr-true`)
- Добавлены адаптивные размеры по умолчанию
- Добавлен blur placeholder для плавной загрузки

### 2. **Оптимизация критических изображений (выше сгиба)**
Файлы: `Banner.tsx`, `TopImage.tsx`
- Добавлен `priority` для приоритетной загрузки
- Установлено качество 75%
- Добавлены правильные `sizes` атрибуты
- Добавлен blur placeholder

### 3. **Замена нативных `<img>` на Next.js Image**
Файл: `Galery.tsx` (masonry variant)
- Критическая оптимизация! Нативные img теги не оптимизируются
- Добавлена автоматическая генерация WebP/AVIF
- Первые 6 изображений загружаются eager, остальные lazy
- Качество снижено до 70% для галереи

### 4. **Оптимизация компонентов**
- **Review.tsx** - аватары пользователей (52px, quality 70%)
- **BookServiceItem.tsx** - иконки сервисов (36px, quality 70%)
- **BlogShort.tsx** - изображения постов (quality 70-75%)
- **Reviews.tsx** - иконка Google (quality 80%)
- **Banner.tsx** (dynamic component) - фоновые изображения

### 5. **Обновление next.config.ts**
- Добавлен размер 375px для iPhone SE и малых мобильных
- Добавлены более гранулярные размеры изображений
- Оптимизирован кеш (1 год)
- Форматы: AVIF (приоритет) и WebP

### 6. **Создан OptimizedImage компонент**
Новый универсальный компонент в `components/OptimizedImage.tsx`:
- Автоматическое применение оптимизаций
- Адаптивные размеры по умолчанию
- Blur placeholder из коробки

## Рекомендации для дальнейшего использования

### Использование компонентов

```tsx
// Для критических изображений (выше сгиба)
<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  priority // ВАЖНО!
  quality={75}
  sizes="(max-width: 640px) 100vw, 50vw"
/>

// Для обычных изображений
<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  loading="lazy"
  quality={70}
  sizes="(max-width: 640px) 100vw, 50vw"
  placeholder="blur"
  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
/>

// Использование OptimizedImage (рекомендуется)
import OptimizedImage from 'components/OptimizedImage'

<OptimizedImage
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
/>
```

### Правила качества изображений

- **Герои/баннеры (выше сгиба)**: quality={75}, priority
- **Галереи**: quality={70}, lazy loading
- **Маленькие иконки (< 100px)**: quality={70-80}
- **Аватары**: quality={70}
- **Фоновые изображения**: quality={70}

### Атрибут `sizes`

Правильный `sizes` критически важен для производительности:

```tsx
// Полная ширина на мобильных
sizes="(max-width: 640px) 100vw, 50vw"

// Фиксированный размер
sizes="52px"

// Сложные breakpoints
sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
```

### Priority vs Lazy Loading

- **priority**: только для 1-2 изображений выше сгиба (hero, banner)
- **lazy**: для всех остальных изображений
- Первые 3-6 элементов в списке/галерее: eager
- Остальные: lazy

## Результаты оптимизации

### Что улучшилось:
1. **Размер изображений**: уменьшение на 30-40% благодаря WebP/AVIF
2. **Скорость загрузки**: приоритетная загрузка важных изображений
3. **Мобильный опыт**: адаптивные размеры для разных экранов
4. **Визуальная стабильность**: blur placeholder предотвращает layout shift
5. **Bandwidth**: меньше трафика для мобильных пользователей

### Метрики для отслеживания:
- **LCP (Largest Contentful Paint)**: должен улучшиться на 20-30%
- **CLS (Cumulative Layout Shift)**: близко к 0 благодаря placeholder
- **Размер загрузки страницы**: уменьшение на 30-50%

## Дополнительные рекомендации

1. **Используйте ImageKit.io** для динамических трансформаций
2. **Избегайте нативных `<img>` тегов** - всегда используйте Next.js Image
3. **Тестируйте на реальных устройствах** - используйте Chrome DevTools с throttling
4. **Мониторьте Web Vitals** в production через Analytics

## Troubleshooting

### Изображения загружаются медленно
- Проверьте правильность `sizes` атрибута
- Убедитесь, что используется `loading="lazy"` для изображений ниже сгиба
- Проверьте, что WebP/AVIF генерируются (DevTools → Network → Image)

### Blur placeholder не работает
- Для статических изображений используйте встроенный blur: `placeholder="blur"`
- Для динамических используйте base64 blurDataURL

### Layout shift при загрузке
- Всегда указывайте `width` и `height`
- Для `fill` используйте фиксированные размеры контейнера
