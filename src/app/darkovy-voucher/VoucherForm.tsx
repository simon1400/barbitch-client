'use client'
import axios from 'axios'
import Alert from 'components/Alert'
import Button from 'components/Button'
import { Container } from 'components/Container'
import { Radio } from 'components/form/Radio'
import { Textarea } from 'components/form/Textarea'
import { createVoucher } from 'fetch/voucher'
import { useState } from 'react'

import { Input } from '../../components/form/Input'

const VoucherForm = () => {
  const [data, setData] = useState({
    name: '',
    for: '',
    email: '',
    phone: '',
    comment: '',
    voucher: '500',
  })

  const [error, setError] = useState({
    name: false,
    email: false,
  })

  const [loading, setLoading] = useState(false)
  const [successAlert, setSuccessAlert] = useState(false)
  const [errorAlert, setErrorAlert] = useState(false)

  const handleChange = (name: string, value: string) => {
    setError({ ...error, [name]: false })
    setData({ ...data, [name]: value })
  }

  const handleSend = async (e: any) => {
    if (loading) return
    e.preventDefault()
    const errorState = { ...error }
    if (data.name.length < 3) {
      errorState.name = true
    }
    if (!/^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(data.email)) {
      errorState.email = true
    }
    if (Object.values(errorState).some((val) => val)) {
      setError(errorState)
      return
    }

    setLoading(true)

    const combineData = {
      name: data.name,
      for: data.for,
      sum: data.voucher === 'free' ? 1500 : data.voucher,
      dateOrder: new Date(),
      email: data.email,
      phone: data.phone,
      comentUser: data.comment,
      // eslint-disable-next-line sonarjs/pseudo-random
      idVoucher: `${Math.floor(10000000 + Math.random() * 90000000)}`,
      publishedAt: null,
    }
    createVoucher(combineData)
      .then(() => {
        axios
          .post('/api/send-mail-voucher', { ...combineData, voucher: data.voucher })
          .then(() => {
            setSuccessAlert(true)
            setLoading(false)
          })
          .catch(() => setErrorAlert(true))
      })
      .catch(() => {
        setLoading(false)
        setErrorAlert(true)
      })
  }

  return (
    <Container size={'sm'}>
      <div className={'py-5 mb-20'}>
        <form id={'voucher-form'} onSubmit={handleSend}>
          <Input
            name={'name'}
            label={'Jméno'}
            placeholder={'Jan Macek'}
            value={data.name}
            handleChange={handleChange}
            required
            error={error.name}
          />
          <Input
            name={'for'}
            label={'Pro koho'}
            placeholder={'Karolína Božková'}
            value={data.for}
            handleChange={handleChange}
          />
          <Input
            name={'email'}
            label={'E-mail'}
            placeholder={'example@gmail.com'}
            value={data.email}
            handleChange={handleChange}
            required
            error={error.email}
          />
          <Input
            name={'phone'}
            label={'Telefon'}
            placeholder={'+420777777777'}
            value={data.phone}
            handleChange={handleChange}
          />
          <Radio
            name={'voucher'}
            label={'Voucher'}
            checked={data.voucher}
            handleChange={handleChange}
            required
          />
          <Textarea
            name={'comment'}
            label={'Komentář'}
            value={data.comment}
            handleChange={handleChange}
          />
          {successAlert && <Alert state={'success'} />}
          {errorAlert && <Alert state={'error'} />}
          {!successAlert && (
            <Button text={'Objednat'} href={'/'} onClick={(e) => handleSend(e)} loading={loading} />
          )}
        </form>
      </div>
    </Container>
  )
}

export default VoucherForm
