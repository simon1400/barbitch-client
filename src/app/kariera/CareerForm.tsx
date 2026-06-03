'use client'
import axios from 'axios'
import Button from 'components/Button'
import { Container } from 'components/Container'
import { Input } from 'components/form/Input'
import { Textarea } from 'components/form/Textarea'
import { BadgeAlert, CircleCheckBig, Paperclip, X } from 'lucide-react'
import { useRef, useState } from 'react'

// Maximální velikost životopisu (5 MB) + povolené přípony.
const MAX_RESUME_BYTES = 5 * 1024 * 1024
const ALLOWED_RESUME_EXT = '.pdf,.doc,.docx,.jpg,.jpeg,.png,.webp,.heic'

const CareerForm = ({ instagram }: { instagram?: string }) => {
  const [data, setData] = useState({ name: '', phone: '', message: '' })
  const [error, setError] = useState({ name: false, phone: false })
  const [resume, setResume] = useState<File | null>(null)
  const [resumeError, setResumeError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleChange = (name: string, value: string) => {
    setError({ ...error, [name]: false })
    setData({ ...data, [name]: value })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResumeError(null)
    const file = e.target.files?.[0] ?? null
    if (file && file.size > MAX_RESUME_BYTES) {
      setResumeError('Soubor je příliš velký (max 5 MB).')
      setResume(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }
    setResume(file)
  }

  const clearResume = () => {
    setResume(null)
    setResumeError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
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
      const formData = new FormData()
      formData.append('name', data.name.trim())
      formData.append('phone', data.phone.trim())
      formData.append('message', data.message.trim())
      if (resume) formData.append('resume', resume)

      await axios.post('/api/career-apply', formData)
      setStatus('success')
      setData({ name: '', phone: '', message: '' })
      clearResume()
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

          <div className={'mb-5'}>
            <label className={'font-bold mb-2 block'} htmlFor={'resume_input'}>
              {'Životopis (nepovinné)'}
            </label>
            <input
              ref={fileInputRef}
              type={'file'}
              id={'resume_input'}
              name={'resume'}
              accept={ALLOWED_RESUME_EXT}
              onChange={handleFileChange}
              className={'sr-only'}
            />
            {resume ? (
              <div
                className={
                  'w-full min-h-13 rounded-special-small shadow-lg bg-white px-5 py-3 flex items-center gap-3'
                }
              >
                <Paperclip className={'shrink-0 text-primary'} size={20} />
                <span className={'grow truncate text-sm'}>{resume.name}</span>
                <button
                  type={'button'}
                  onClick={clearResume}
                  aria-label={'Odebrat soubor'}
                  className={'shrink-0 text-gray-500 hover:text-red-500'}
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <button
                type={'button'}
                onClick={() => fileInputRef.current?.click()}
                className={
                  'w-full h-13 rounded-special-small shadow-lg bg-white px-5 flex items-center gap-3 text-gray-500 hover:text-accent text-left'
                }
              >
                <Paperclip className={'shrink-0 text-primary'} size={20} />
                <span className={'truncate'}>{'Nahrát životopis (PDF, DOC, obrázek)'}</span>
              </button>
            )}
            {resumeError && (
              <span className={'mt-1 block font-bold text-xss text-red-500'}>{resumeError}</span>
            )}
          </div>

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
