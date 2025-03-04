interface IDataImage {
  url: string
  name: string
}

interface IDataLink {
  title: string
  link: string
}

interface IDataMeta {
  title: string
  description: string
  image: {
    url: string
  }
}

interface IDataMetaWrap {
  title: string
  metaData: IDataMeta
}

interface IInstagramItem {
  type: 'CAROUSEL_ALBUM' | 'IMAGE' | 'VIDEO'
  previewUrl: string
  permalink: string
}

interface IGalery {
  hash: string
  url: string
  alternativeText?: string
  documentId?: string
}
