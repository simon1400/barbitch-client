'use client'
import axios from 'axios'
import Button from 'components/Button'
import { Container } from 'components/Container'
import { Input } from 'components/form/Input'
import { Textarea } from 'components/form/Textarea'
import { BadgeAlert, CircleCheckBig } from 'lucide-react'
import { useState } from 'react'

const CareerForm = ({ instagram }: { instagram?: string }) => {
  const [data, setData] = useState({ name: '', phone: '', message: '' })
  const [error, setError] = useState({ name: false, phone: false })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleChange = (name: string, value: string) => {
    setError({ ...error, [name]: false })
    setData({ ...data, [name]: value })
  }

  const validate = () => {
    const next = { ...error }
    next.name = data.name.trim().length < 2
    // alespoň 9 číslic v telefonu
    next.phone = (data.phone.match(/\d/g) || []).length < 9
    return next
  }

  const handleSend = async (e: React.MouseEvent | React.FormEvent) => {
    e.preventDefault()
    if (loading) return

    const next = validate()
    if (next.name || next.phone) {
      setError(next)
      return
    }

    setLoading(true)
    setStatus('idle')

    try {
      await axios.post('/api/career-apply', {
        name: data.name.trim(),
        phone: data.phone.trim(),
        message: data.message.trim(),
      })
      setStatus('success')
      setData({ name: '', phone: '', message: '' })
    } catch {
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container size={'sm'}>
      {status === 'success' ? (
        <div
          className={
            'px-6 py-8 rounded-special-small bg-green-300/70 text-green-900 flex gap-4 items-start'
          }
        >
          <CircleCheckBig className={'shrink-0 mt-1'} />
          <div>
            <span className={'font-bold block text-sm'}>{'Děkujeme, máme to!'}</span>
            <p className={'text-xs1'}>{'Ozveme se ti co nejdříve. Těšíme se na tebe 💕'}</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSend}>
          <Input
            name={'name'}
            label={'Jméno'}
            placeholder={'Tvoje jméno'}
            value={data.name}
            handleChange={handleChange}
            required
            error={error.name}
          />
          <Input
            name={'phone'}
            label={'Telefon'}
            placeholder={'+420 ...'}
            value={data.phone}
            handleChange={handleChange}
            required
            error={error.phone}
          />
          <Textarea
            name={'message'}
            label={'Pár slov o sobě (nepovinné)'}
            value={data.message}
            handleChange={handleChange}
          />

          {status === 'error' && (
            <div
              className={
                'px-5 py-4 rounded-special-small mb-5 flex gap-3 bg-red-300/70 text-red-900'
              }
            >
              <BadgeAlert className={'shrink-0'} />
              <div>
                <span className={'font-bold block'}>{'Něco se nepovedlo.'}</span>
                <p className={'text-xs1'}>
                  {'Zkus to prosím znovu'}
                  {instagram ? ', nebo nám napiš přímo na ' : '.'}
                  {instagram && (
                    <a
                      href={instagram}
                      target={'_blank'}
                      rel={'noreferrer'}
                      className={'underline font-bold'}
                    >
                      {'Instagramu'}
                    </a>
                  )}
                  {instagram ? '.' : ''}
                </p>
              </div>
            </div>
          )}

          <Button
            text={'Odeslat'}
            href={'#formular'}
            onClick={handleSend}
            loading={loading}
            id={'career-submit'}
          />
        </form>
      )}
    </Container>
  )
}

export default CareerForm
