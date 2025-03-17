'use client'

import { format } from 'date-fns'
import { cs } from 'date-fns/locale/cs'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './calendar.scss'

registerLocale('cs', cs)

export const BookDatePicker = ({
  data,
  selectDate,
  selected,
  setSelectMonth,
}: {
  data: Date[]
  selected: Date
  selectDate: (value: Date) => void
  setSelectMonth: (month: string) => void // Используем функцию вместо Dispatch
}) => {
  return (
    <div className={'text-center'}>
      <DatePicker
        calendarClassName={'book-calendar-wrap mb-5'}
        selected={selected}
        locale={'cs'}
        onChange={(date) => selectDate(date as Date)}
        minDate={new Date()}
        excludeDates={data}
        showDisabledMonthNavigation
        inline
        onMonthChange={(date) => {
          setSelectMonth(format(date, 'MM'))
          console.log(date)
        }}
      />
      <div>{format(selected, 'EEEE d. MMMM', { locale: cs })}</div>
    </div>
  )
}
