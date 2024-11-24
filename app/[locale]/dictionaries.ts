import 'server-only'

const dictionaries = {
  cs: () => import('../dictionaries/cs.json').then((module) => module.default),
}

export const getDictionary = async (locale: string) => dictionaries[locale]()
