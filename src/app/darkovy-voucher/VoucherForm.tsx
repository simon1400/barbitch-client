'use client'
import axios from 'axios'
import Alert from 'components/Alert'
import Button from 'components/Button'
import { Container } from 'components/Container'
import { Text } from 'components/dynamicComponents/Text'
import { DeliveryMethod } from 'components/form/DeliveryMethod'
import { Radio } from 'components/form/Radio'
import { Textarea } from 'components/form/Textarea'
import { createVoucher } from 'fetch/voucher'
import { useState } from 'react'

import { Input } from '../../components/form/Input'

const beforeFormContent =
  '<p>Dárkové vouchery se staly moderním a stylovým způsobem, jak potěšit blízké – ať už k narozeninám, svátkům nebo prostě jen tak. V beauty salonu <b>Bar.Bitch Brno</b> vám nabízíme možnost darovat nezapomenutelný zážitek v podobě voucheru na profesionální péči o nehty, řasy a obočí. Čtěte dál a objevte, jaký typ voucheru je pro vás ideální a jak snadno ho můžete objednat.</p>'

const VoucherForm = () => {
  const [data, setData] = useState({
    name: '',
    for: '',
    email: '',
    phone: '',
    comment: '',
    voucher: '500',
    deliveryMethod: 'email', // email, mail, pickup
    street: '',
    city: '',
    postalCode: '',
    country: 'Česká republika',
  })

  const [error, setError] = useState({
    name: false,
    for: false,
    email: false,
    street: false,
    city: false,
    postalCode: false,
  })

  const [loading, setLoading] = useState(false)
  const [successAlert, setSuccessAlert] = useState(false)
  const [errorAlert, setErrorAlert] = useState(false)

  const handleChange = (name: string, value: string) => {
    // Ограничение на 18 символов для поля "for"
    if (name === 'for' && value.length > 18) {
      return
    }
    setError({ ...error, [name]: false })
    setData({ ...data, [name]: value })
  }

  const handleDeliveryChange = (name: string, value: string) => {
    setData({ ...data, [name]: value })
    // Очистить ошибки адреса при смене метода доставки
    if (value !== 'mail') {
      setError({ ...error, street: false, city: false, postalCode: false })
    }
  }

  const validateForm = () => {
    const errorState = { ...error }

    if (data.name.length < 3) errorState.name = true
    if (data.for.length < 3) errorState.for = true
    if (!/^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(data.email)) errorState.email = true

    if (data.deliveryMethod === 'mail') {
      if (data.street.length < 3) errorState.street = true
      if (data.city.length < 2) errorState.city = true
      if (data.postalCode.length < 5) errorState.postalCode = true
    }

    return errorState
  }

  const handleSend = async (e: any) => {
    if (loading) return
    e.preventDefault()

    const errorState = validateForm()
    if (Object.values(errorState).some((val) => val)) {
      setError(errorState)
      return
    }

    setLoading(true)

    const combineData = {
      name: data.name,
      for: data.for,
      sum: data.voucher,
      dateOrder: new Date(),
      email: data.email,
      phone: data.phone,
      comentUser: data.comment,
      deliveryMethod: data.deliveryMethod,
      street: data.deliveryMethod === 'mail' ? data.street : '',
      city: data.deliveryMethod === 'mail' ? data.city : '',
      postalCode: data.deliveryMethod === 'mail' ? data.postalCode : '',
      country: data.deliveryMethod === 'mail' ? data.country : '',
      // eslint-disable-next-line sonarjs/pseudo-random
      idVoucher: `${Math.floor(10000000 + Math.random() * 90000000)}`,
      publishedAt: null,
    }
    createVoucher(combineData)
      .then(() => {
        axios
          .post('/api/send-mail-voucher', {
            ...combineData,
            voucher: data.voucher,
            recipientName: data.for,
          })
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
    <>
      <div className={'content'}>
        <Text data={{ contentText: beforeFormContent }} />
      </div>
      <Container size={'sm'}>
        <div className={'py-5 mb-20'}>
          <form id={'voucher-form'} onSubmit={handleSend}>
            <Input
              name={'name'}
              label={'Jméno'}
              placeholder={'Jméno'}
              value={data.name}
              handleChange={handleChange}
              required
              error={error.name}
            />
            <Input
              name={'for'}
              label={'Pro koho'}
              placeholder={'Pro koho'}
              value={data.for}
              handleChange={handleChange}
              required
              error={error.for}
              warning={data.for.length >= 18}
              warningText={'Maximální počet znaků: 18'}
            />
            <Input
              name={'email'}
              label={'E-mail'}
              placeholder={'E-mail'}
              value={data.email}
              handleChange={handleChange}
              required
              error={error.email}
            />
            <Input
              name={'phone'}
              label={'Telefon'}
              placeholder={'Telefon'}
              value={data.phone}
              handleChange={handleChange}
            />
            <Radio
              name={'voucher'}
              label={'Hodnota voucheru'}
              checked={data.voucher}
              handleChange={handleChange}
              required
            />
            <Textarea
              name={'comment'}
              label={'Poznámka k objednávce'}
              value={data.comment}
              handleChange={handleChange}
            />
            <DeliveryMethod
              name={'deliveryMethod'}
              label={'Způsob doručení'}
              checked={data.deliveryMethod}
              handleChange={handleDeliveryChange}
              required
            />
            {data.deliveryMethod === 'mail' && (
              <div className={'space-y-0'}>
                <div className={'grid grid-cols-1 md:grid-cols-2 gap-5 mb-5'}>
                  <Input
                    name={'street'}
                    label={'Ulice a číslo popisné'}
                    placeholder={'Příkladná 123'}
                    value={data.street}
                    handleChange={handleChange}
                    required
                    error={error.street}
                  />
                  <Input
                    name={'city'}
                    label={'Město'}
                    placeholder={'Praha'}
                    value={data.city}
                    handleChange={handleChange}
                    required
                    error={error.city}
                  />
                </div>
                <div className={'grid grid-cols-1 md:grid-cols-2 gap-5 mb-5'}>
                  <Input
                    name={'postalCode'}
                    label={'PSČ'}
                    placeholder={'120 00'}
                    value={data.postalCode}
                    handleChange={handleChange}
                    required
                    error={error.postalCode}
                  />
                  <Input
                    name={'country'}
                    label={'Země'}
                    placeholder={'Česká republika'}
                    value={data.country}
                    handleChange={handleChange}
                    required
                  />
                </div>
              </div>
            )}
            {successAlert && <Alert state={'success'} />}
            {errorAlert && <Alert state={'error'} />}
            {!successAlert && (
              <Button
                text={'Objednat'}
                href={'/'}
                onClick={(e) => handleSend(e)}
                loading={loading}
              />
            )}
          </form>
        </div>
      </Container>
    </>
  )
}

export default VoucherForm
