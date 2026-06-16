import type { Metadata } from 'next'

import Button from 'components/Button'
import { Container } from 'components/Container'
import { getContact } from 'fetch/contact'
import { HIRING } from 'lib/hiring'
import { BreadcrumbSchema } from 'schemasOrg/breadcrumb'
import { JobPostingSchema } from 'schemasOrg/jobPosting'
import { Top } from 'sections/Top/Top'

import CareerForm from './CareerForm'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Kariéra — hledáme lashmakerku',
  description:
    'Přidej se k týmu beauty salonu Bar.Bitch v centru Brna. Hledáme lashmakerku / lash stylistku na prodlužování řas. Napiš nám na Instagramu nebo vyplň krátký formulář.',
  alternates: {
    canonical: 'https://barbitch.cz/kariera',
  },
  openGraph: {
    title: 'Hledáme lashmakerku | Bar.Bitch Brno',
    description:
      'Připoj se k mladému týmu salonu v centru Brna. Prodlužování řas, kvalitní materiály, férové ohodnocení s provizí.',
    url: 'https://barbitch.cz/kariera',
    siteName: 'Barbitch',
    locale: 'cs_CZ',
    type: 'website',
    images: ['/assets/banner.jpg'],
  },
}

const introText =
  'Hledáme šikovnou lashmakerku do našeho salonu v centru Brna. Připoj se k mladému sehranému týmu a dělej to, co tě baví — prodlužování řas a krásu, ze které mají klientky radost. Šikovné juniorky vítáme, hlavní je preciznost a chuť se učit.'

const taskItems = [
  'Prodlužování a zhušťování řas — klasika i objemové techniky',
  'Lash lifting, barvení a péče o řasy a obočí',
  'Poradíš klientkám s výběrem stylu a péčí o řasy',
]

const offerItems = [
  'Stylové prostředí v centru Brna a mladý sehraný tým',
  'Férové ohodnocení s provizí z odvedené práce a stálou klientelu',
  'Kvalitní materiály, zázemí a prostor pro růst',
]

const lookingForItems = [
  'Zkušenost s prodlužováním řas (vítáme i šikovné juniorky)',
  'Preciznost, smysl pro detail a čisté provedení',
  'Spolehlivost, úsměv a chuť učit se nové techniky',
]

const List = ({ title, items }: { title: string; items: string[] }) => (
  <div className={'content'}>
    <h2 className={'uppercase'}>{title}</h2>
    <ul>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
)

const buildJobDescription = () => {
  const section = (heading: string, items: string[]) => {
    const lis = items.map((item) => `<li>${item}</li>`).join('')
    return `<p><strong>${heading}</strong></p><ul>${lis}</ul>`
  }

  return [
    `<p>${introText}</p>`,
    section('Co tě čeká', taskItems),
    section('Co nabízíme', offerItems),
    section('Koho hledáme', lookingForItems),
  ].join('')
}

const Kariera = async () => {
  const contact = await getContact()
  const instagram = contact.socItems?.find((item) => item.type === 'instagram')?.link

  return (
    <main>
      <JobPostingSchema
        title={HIRING.jobTitle}
        description={buildJobDescription()}
        datePosted={HIRING.datePosted}
        validThrough={HIRING.validThrough}
        employmentType={HIRING.employmentType}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Hlavní strana', url: 'https://barbitch.cz' },
          { name: 'Kariéra', url: 'https://barbitch.cz/kariera' },
        ]}
      />
      <Top
        title={'Hledáme lashmakerku'}
        small
        linkToReserve={contact.linkToReserve || ''}
        titleClassName={'text-md1 sm:text-md2 lg:text-top'}
      >
        <div className={'flex flex-wrap gap-4'}>
          {instagram && (
            <Button
              text={'Napiš nám na Instagramu'}
              href={instagram}
              blank
              white
              id={'career-instagram'}
            />
          )}
          <Button text={'Vyplnit formulář'} href={'#formular'} id={'career-form-scroll'} />
        </div>
      </Top>

      {/* Úvod */}
      <section className={'pt-10 lg:pt-16'}>
        <Container size={'lg'}>
          <div className={'content'}>
            <p>{introText}</p>
          </div>
        </Container>
      </section>

      {/* Info */}
      <section className={'pt-6 lg:pt-10 pb-10 lg:pb-16'}>
        <Container size={'xl'}>
          <div className={'grid gap-12 lg:grid-cols-3 lg:gap-16'}>
            <List title={'Co tě čeká'} items={taskItems} />
            <List title={'Co nabízíme'} items={offerItems} />
            <List title={'Koho hledáme'} items={lookingForItems} />
          </div>
        </Container>
      </section>

      {/* Formulář */}
      <section id={'formular'} className={'pb-23 lg:pb-27 scroll-mt-16'}>
        <Container size={'xl'}>
          <h2 className={'text-md1 lg:text-md2 uppercase text-center mb-4'}>{'Ozvi se nám'}</h2>
          <p className={'text-center text-xs1 lg:text-baseSm max-w-[600px] mx-auto mb-10'}>
            {
              'Nech nám na sebe kontakt a my se ti co nejdříve ozveme. Nebo nám rovnou napiš na Instagramu — co ti vyhovuje víc.'
            }
          </p>
          <CareerForm instagram={instagram} />
        </Container>
      </section>
    </main>
  )
}

export default Kariera
