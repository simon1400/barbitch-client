import comboServicesData from '../data/combo-services.json'

export interface IComboServiceItem {
  serviceId: string
  title: string
  minutes: number
  order: number
}

export interface IComboService {
  id: string
  title: string
  description: string
  price: number
  totalMinutes: number
  image: string
  services: IComboServiceItem[]
}

export interface IComboServiceGroup {
  title: string
  services: IComboService[]
}

export const getComboServices = (): IComboServiceGroup => {
  return comboServicesData as IComboServiceGroup
}

export const getComboServiceById = (id: string): IComboService | undefined => {
  const data = getComboServices()
  return data.services.find((service) => service.id === id)
}
