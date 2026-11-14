import type { Metadata } from 'next'

import { getHomePosts } from 'fetch/blog'
import { getContact, getContactExtras } from 'fetch/contact'
import { getHomeMeta } from 'fetch/getMeta'
import {
  getCatalogPrices,
  getHomeContent,
  getHomeServices,
  getPopularServices,
  getServicePrices,
  getTeam,
} from 'fetch/home'
import { getGalleryItems, getHomepage } from 'fetch/homepage'
import { getReviews } from 'fetch/reviews'
import { isHalloweenOn } from 'lib/halloween'
import {
  DEFAULT_ABOUT_TITLE,
  DEFAULT_ADDRESS,
  DEFAULT_FAQ,
  DEFAULT_LEAD,
  DEFAULT_OPEN_HOURS_SHORT,
  DEFAULT_PHONE,
  DEFAULT_SEO_TITLE,
  DEFAULT_SERVICES_TITLE,
  DEFAULT_SLOGAN,
  DEFAULT_WHY_ITEMS,
  fillFaqAnswer,
  stripHtml,
} from 'lib/homeContent'
import { getStrapiImageUrl } from 'lib/image-utils'
import { jsonLd } from 'lib/jsonLd'
import { cmsTitle } from 'lib/seo'
import { LocalBusinessSchema } from 'schemasOrg/localBusiness'
import About from 'sections/About'
import Banner from 'sections/Banner'
import Galery from 'sections/Galery'
import HandSec from 'sections/HandSec'
import { HomeHero } from 'sections/home/HomeHero'
import HomePosts from 'sections/home/HomePosts'
import HomeReviews from 'sections/home/HomeReviews'
import PopularServices from 'sections/home/PopularServices'
import Team from 'sections/home/Team'
import WhyRibbons from 'sections/home/WhyRibbons'
import { HalloweenHero } from 'sections/Top/HalloweenHero'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const homepageMeta = await getHomeMeta()

  return {
    title: cmsTitle(homepageMeta.metaData.title || 'Barbitch – Manikúra, řasy a obočí v Brně'),
    description:
      homepageMeta.metaData.description ||
      'Objevte moderní beauty studio Bar.bitch v Brně. Profesionální manikúra, trendy obočí a dokonalé řasy. Individuální přístup a relaxace s kvalitními materiály. Rezervujte si termín ještě dnes!',
    openGraph: {
      title: homepageMeta.metaData.title,
      siteName: 'Barbitch',
      locale: 'cs_CZ',
      description: homepageMeta.metaData.description,
      images: [getStrapiImageUrl(homepageMeta.metaData.image?.url)],
      url: 'https://barbitch.cz',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: homepageMeta.metaData.title,
      description: homepageMeta.metaData.description,
      images: [getStrapiImageUrl(homepageMeta.metaData.image?.url)],
    },
    alternates: {
      canonical: 'https://barbitch.cz',
    },
  }
}

/**
 * Hlavní stránka (redesign s286, zadání HOMEPAGE_REDESIGN_NEXT_SESSION_PROMPT.md).
 * Každá data zvlášť a s náhradou v kódu — výpadek jednoho dotazu (nebo starý
 * Strapi bez nových polí) nesmí shodit ostatní sekce. `app/(home)/loading.tsx`
 * je pryč: kvůli němu přicházel obsah stránky v HTML až za patičkou a H2
 * „Dárkový voucher“ a „Kontakt“ stály před H1.
 */
const Home = async () => {
  const [
    data,
    content,
    homeServices,
    prices,
    popular,
    team,
    galleryItems,
    posts,
    contact,
    contactExtras,
    reviews,
    catalog,
  ] = await Promise.all([
    getHomepage(),
    getHomeContent(),
    getHomeServices(),
    getServicePrices(),
    getPopularServices(4),
    getTeam(),
    getGalleryItems(),
    getHomePosts(),
    getContact(),
    getContactExtras(),
    getReviews(),
    getCatalogPrices(),
  ])
  // Prázdný odkaz (výpadek CMS) by odstranil CTA — vlastní rezervace na /book jede vždy.
  const linkToReserve = contact.linkToReserve || '/book'
  const instagramUrl = contact.socItems?.find((item) => item.type === 'instagram')?.link
  const openHoursShort = contactExtras.openHoursShort?.trim() || DEFAULT_OPEN_HOURS_SHORT

  const faq = (content.faq?.length ? content.faq : DEFAULT_FAQ)
    .filter((item) => item?.title?.trim() && item?.content?.trim())
    .map((item) => ({
      title: item.title.trim(),
      content: fillFaqAnswer(item.content, {
        prices,
        catalog,
        howToGetThere: contactExtras.howToGetThere,
      }),
    }))
  const faqSchema = faq.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faq.map((item) => ({
          '@type': 'Question',
          name: item.title,
          acceptedAnswer: { '@type': 'Answer', text: stripHtml(item.content) },
        })),
      }
    : null

  const whyItems = content.whyItems?.length ? content.whyItems : DEFAULT_WHY_ITEMS

  return (
    <main>
      <LocalBusinessSchema />
      {faqSchema && (
        <script
          id={'schema-org-faq'}
          type={'application/ld+json'}
          // eslint-disable-next-line react-dom/no-dangerously-set-innerhtml
          dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema) }}
        />
      )}
      {isHalloweenOn() ? (
        <HalloweenHero title={data.title} linkToReserve={linkToReserve} />
      ) : (
        <HomeHero
          seoTitle={content.seoTitle?.trim() || DEFAULT_SEO_TITLE}
          slogan={data.title?.trim() || DEFAULT_SLOGAN}
          lead={content.lead?.trim() || DEFAULT_LEAD}
          heroImage={content.heroImage}
          heroImageMobile={content.heroImageMobile}
          linkToReserve={linkToReserve}
          facts={{
            address: DEFAULT_ADDRESS,
            openHours: openHoursShort,
            phone: contact.phone || DEFAULT_PHONE,
          }}
        />
      )}
      <HandSec
        title={content.servicesTitle?.trim() || DEFAULT_SERVICES_TITLE}
        services={homeServices}
        prices={prices}
      />
      <PopularServices services={popular} gallery={galleryItems} />
      <Team team={team} linkToReserve={linkToReserve} />
      {/* Galerie beze změny (s282); jen bílé pozadí jako ostatní sekce místo textury body. */}
      <div className={'bg-white'}>
        <Galery
          items={galleryItems}
          fallback={data.galery}
          services={homeServices}
          instagramUrl={instagramUrl}
          linkToReserve={linkToReserve}
        />
      </div>
      <WhyRibbons items={whyItems} />
      <HomeReviews reviews={reviews} gallery={galleryItems} />
      <About
        title={content.aboutTitle?.trim() || DEFAULT_ABOUT_TITLE}
        text={data.aboutUs}
        faq={faq}
        addressLine={'Křenová 294/16, Brno'}
        hoursLine={openHoursShort.charAt(0).toLowerCase() + openHoursShort.slice(1)}
      />
      <Banner />
      <HomePosts posts={posts} />
    </main>
  )
}

export default Home
