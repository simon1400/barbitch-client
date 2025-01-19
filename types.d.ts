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