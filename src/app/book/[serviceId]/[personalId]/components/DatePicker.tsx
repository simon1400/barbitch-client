'use client'
import { format } from 'date-fns'
import { cs } from 'date-fns/locale/cs'
import { isHalloweenDay } from 'lib/halloween'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './calendar.scss'

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
        locale={cs}
        onChange={(date) => selectDate(date as Date)}
        minDate={new Date()}
        excludeDates={data}
        // Den Halloweenu (lib/halloween.ts) dostane odznak 🎃 — jen vizuální
        // zvýraznění, výběr dne i sloty fungují jako jindy.
        dayClassName={(date) => (isHalloweenDay(date) ? 'book-calendar-halloween' : '')}
        renderDayContents={(day, date) =>
          date && isHalloweenDay(date) ? (
            <>
              {day}
              <span className={'book-calendar-halloween__badge'} aria-hidden>
                {'🎃'}
              </span>
              <span className={'sr-only'}>{' Halloween'}</span>
            </>
          ) : (
            day
          )
        }
        showDisabledMonthNavigation
        inline
      />
      <div>{format(selected, 'EEEE d. MMMM', { locale: cs })}</div>
    </div>
  )
}

export default BookDatePicker
