'use client'

import type { IErrorUserData, IUserData } from '../BookForm'

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
            className={
              'bg-[#161615] mb-5 border block w-full border-[#4A4A4A] rounded-special-small text-book text-white h-[90px] resize-none p-3.5 focus:border-[#929292] outline-none'
            }
            onChange={(e) => handleChange('comment', e.target.value)}
          />
        )}
        <div
          className={'flex gap-3 items-start py-2.5 cursor-pointer'}
          onClick={() => handleChange('gdprConsent', !userData.gdprConsent)}
        >
          <div
            className={`mt-0.5 h-4 w-4 min-w-[16px] rounded border flex items-center justify-center transition-colors ${
              userData.gdprConsent
                ? 'bg-pink-500 border-pink-500'
                : errorData.gdprConsent
                  ? 'bg-[#3C3C3B] border-red-500'
                  : 'bg-[#3C3C3B] border-[#4A4A4A]'
            }`}
          >
            {userData.gdprConsent && (
              <svg width={'10'} height={'8'} viewBox={'0 0 10 8'} fill={'none'}>
                <path
                  d={'M1 4L3.5 6.5L9 1'}
                  stroke={'white'}
                  strokeWidth={'1.5'}
                  strokeLinecap={'round'}
                  strokeLinejoin={'round'}
                />
              </svg>
            )}
          </div>
          <span
            className={`text-[11px] leading-[15px] ${errorData.gdprConsent ? 'text-red-500' : 'text-[#A0A0A0]'}`}
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
          </span>
        </div>
      </form>
    </div>
  )
}
