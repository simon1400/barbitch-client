import type { Config } from 'tailwindcss'

const mainPalette = {
  accent: 'var(--accent)',
  primary: 'var(--primary)',
}

const config: Config = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/sections/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  typography: {
    DEFAULT: {
      css: {
        fontDisplay: 'swap',
      },
    },
  },
  theme: {
    extend: {
      screens: {
        xs: '430px',
      },
      colors: mainPalette,
      fontSize: {
        xss: [
          '13px',
          {
            lineHeight: '19px',
            fontWeight: '800',
          },
        ],
        xs1: [
          '14px',
          {
            lineHeight: '24px',
            fontWeight: '500',
          },
        ],
        xs: [
          '15px',
          {
            lineHeight: '21px',
            fontWeight: '800',
          },
        ],
        sm: [
          '16px',
          {
            lineHeight: '23px',
            fontWeight: '800',
          },
        ],
        baseSm: [
          '16px',
          {
            lineHeight: '30px',
            fontWeight: '500',
          },
        ],

        // response start
        resXxs: [
          '10px',
          {
            lineHeight: '13px',
            fontWeight: '800',
          },
        ],
        resXs: [
          '12px',
          {
            lineHeight: '15px',
            fontWeight: '800',
          },
        ],
        resSm: [
          '13px',
          {
            lineHeight: '24px',
            fontWeight: '800',
          },
        ],
        resMd: [
          '15px',
          {
            lineHeight: '16px',
            fontWeight: '800',
          },
        ],
        resMd1: [
          '16px',
          {
            lineHeight: '17px',
            fontWeight: '800',
          },
        ],
        resLg: [
          '20px',
          {
            lineHeight: '20px',
            fontWeight: '800',
          },
        ],
        resBig: [
          '30px',
          {
            lineHeight: '31px',
            fontWeight: '800',
          },
        ],
        resTop: [
          '35px',
          {
            lineHeight: '36px',
            fontWeight: '800',
          },
        ],

        // response end
        sm11: [
          '20px',
          {
            lineHeight: '20px',
            fontWeight: '300',
          },
        ],
        baseText: [
          '20px',
          {
            lineHeight: '39px',
            fontWeight: '500',
          },
        ],
        h5: [
          '23px',
          {
            lineHeight: '24px',
            fontWeight: '800',
          },
        ],
        sm1: [
          '25px',
          {
            lineHeight: '35px',
            fontWeight: '800',
          },
        ],
        base: [
          '26px',
          {
            lineHeight: '45px',
            fontWeight: '500',
          },
        ],
        md: [
          '32px',
          {
            lineHeight: '45px',
            fontWeight: '800',
          },
        ],
        md1: [
          '34px',
          {
            lineHeight: '35px',
            fontWeight: '800',
          },
        ],
        md2: [
          '44px',
          {
            lineHeight: '37px',
            fontWeight: '800',
          },
        ],
        lg: [
          '62px',
          {
            lineHeight: '87px',
            fontWeight: '800',
          },
        ],
        xl: [
          '71px',
          {
            lineHeight: '100px',
            fontWeight: '800',
          },
        ],
        xxl: [
          '55px',
          {
            lineHeight: '56px',
            fontWeight: '800',
          },
        ],
        big: [
          '91px',
          {
            lineHeight: '93px',
            fontWeight: '800',
          },
        ],
        top: [
          '127px',
          {
            lineHeight: '115px',
            fontWeight: '800',
          },
        ],
      },
      boxShadow: {
        'default-level1': '0 4px 8px var(--darkBlueUltraSoft)',
        'default-level2': '0 4px 16px var(--darkBlueUltraSoft)',
        'default-level3': '0 8px 24px var(--darkBlueUltraSoft)',
        'default-level4': '0 24px 40px var(--darkBlueUltraSoft)',
      },
      spacing: {
        0: '0px',
        0.5: '2px',
        1: '4px',
        1.5: '6px',
        2: '8px',
        2.5: '10px',
        3: '12px',
        3.5: '13.5px',
        4: '16px',
        4.5: '18px',
        5: '20px',
        5.5: '22px',
        6: '24px',
        6.5: '26px',
        7: '28px',
        8: '32px',
        9: '36px',
        10: '40px',
        11.5: '45px',
        13: '50px',
        15: '60px',
        18: '77px',
        23: '94px',
        27: '108px',
        33: '132px',
        50: '200px',
      },
      backgroundImage: {
        base: "url('/assets/background.jpg')",
      },
      borderRadius: {
        default: '2px',
        'special-small': '4px',
        special: '20px',
        rounded: '100%',
      },
    },
  },
  plugins: [],
}
export default config
