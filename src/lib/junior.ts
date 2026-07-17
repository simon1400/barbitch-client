// Глобальная константа скидки для junior-мастеров (только отображение цен на клиенте).
// Применяется к ИТОГОВОЙ цене (-20% на всё, включая базу + варианты + modifiers).
// Источник истины — движок: strapi booking-engine slots-core
// (JUNIOR_DISCOUNT_PERCENT). При изменении менять СИНХРОННО там и здесь.
export const JUNIOR_DISCOUNT_PERCENT = 20

export const calcJuniorPrice = (seniorPrice: number): number =>
  Math.round(seniorPrice * (1 - JUNIOR_DISCOUNT_PERCENT / 100))
