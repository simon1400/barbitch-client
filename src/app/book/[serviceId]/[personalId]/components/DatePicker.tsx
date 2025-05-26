'use client'
import { format } from 'date-fns'
import { cs } from 'date-fns/locale/cs'
import DatePicker, { registerLocale } from 'react-datepicker'
import './calendar.scss'

registerLocale('cs', cs)

const BookDatePicker = ({
  data,
  selectDate,
  selected,
}: {
  data: Date[]
  selected: Date
  selectDate: (value: Date) => void
}) => {
  return (
    <div className={'text-center'}>
      <DatePicker
        calendarClassName={`book-calendar-wrap mb-5`}
        selected={selected}
        locale={'cs'}
        onChange={(date) => selectDate(date as Date)}
        minDate={new Date()}
        excludeDates={data}
        showDisabledMonthNavigation
        inline
      />
      <div>{format(selected, 'EEEE d. MMMM', { locale: cs })}</div>
    </div>
  )
}

export default BookDatePicker
