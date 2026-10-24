'use client'

import type { IErrorUserData, IUserData } from '../BookForm'

import { ConsentCheckbox } from 'components/form/ConsentCheckbox'
import { bookingTextareaCls } from 'components/form/fieldStyles'

import { Switch } from '@/components/ui/switch'

import { Input } from './Input'

export const UserData = ({
  userData,
  errorData,
  handleChange,
}: {
  userData: IUserData
  errorData: IErrorUserData
  handleChange: (name: string, value: string | boolean) => void
}) => {
  return (
    <div className={'bg-[#252523] rounded-special-small px-5 pt-3.5 pb-2 mb-5'}>
      <h2 className={'text-sm text-white mb-5 text-center'}>{'Vaše informace'}</h2>
      <form className={'block max-w-[270px] mx-auto'}>
        <Input
          label={'Jméno'}
          data={userData}
          name={'name'}
          error={errorData.name}
          handleChange={handleChange}
        />
        <Input
          label={'Telefonní číslo'}
          data={userData}
          error={errorData.phone}
          name={'phone'}
          handleChange={handleChange}
        />
        <Input
          label={'E-mail'}
          data={userData}
          name={'email'}
          error={errorData.email}
          handleChange={handleChange}
        />
        <div className={'flex gap-3 items-center py-2.5'}>
          <Switch
            checked={userData.checkComent}
            className={'bg-[#3C3C3B] text-[#3C3C3B]'}
            onClick={() => handleChange('checkComent', !userData.checkComent)}
          />
          <span className={'text-book text-[#A0A0A0]'}>{'Zanechat vzkaz'}</span>
        </div>
        {userData.checkComent && (
          <textarea
            value={userData.comment}
            className={`${bookingTextareaCls()} mb-5`}
            onChange={(e) => handleChange('comment', e.target.value)}
          />
        )}
        <ConsentCheckbox
          name={'gdprConsent'}
          checked={userData.gdprConsent}
          error={errorData.gdprConsent}
          onChange={(value) => handleChange('gdprConsent', value)}
        >
          {'Souhlasím s '}
          <a
            href={'https://barbitch.cz/obchodni-podminky'}
            target={'_blank'}
            rel={'noopener noreferrer'}
            className={'text-pink-500 underline'}
          >
            {'obchodními podmínkami'}
          </a>
          {' a '}
          <a
            href={'https://barbitch.cz/zasady-ochrany-osobnich-udaju'}
            target={'_blank'}
            rel={'noopener noreferrer'}
            className={'text-pink-500 underline'}
          >
            {'zásadami ochrany osobních údajů'}
          </a>
          {'.'}
        </ConsentCheckbox>
      </form>
    </div>
  )
}
