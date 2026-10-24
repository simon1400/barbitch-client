import { BadgeAlert, CircleCheckBig } from 'lucide-react'

const Alert = ({
  state,
  title,
  text,
}: {
  state: 'success' | 'error'
  /** Vlastní nadpis/text — bez nich platí výchozí texty objednávky. */
  title?: string
  text?: string
}) => {
  const bg = state === 'success' ? 'bg-green-300/70' : 'bg-red-300/70'
  const textColor = state === 'success' ? 'text-green-800' : 'text-red-800'
  const head =
    title ??
    (state === 'success'
      ? 'Objednávka byla úspěšně odeslána!'
      : 'Došlo k chybě při odesílání objednávky.')
  const body =
    text ??
    (state === 'success'
      ? 'Podrobnosti a voucher najdete ve své e-mailové schránce.'
      : 'Zkuste to prosím znovu nebo nás kontaktujte.')
  return (
    <div
      role={state === 'error' ? 'alert' : 'status'}
      className={`px-5 py-4 rounded-special-small mb-5 flex gap-3 ${bg} ${textColor}`}
    >
      {state === 'success' ? <CircleCheckBig /> : <BadgeAlert />}
      <div>
        <span className={`font-bold`}>{head}</span>
        <p>{body}</p>
      </div>
    </div>
  )
}

export default Alert
