import moment from "moment"

export interface IOrderGrid {
  id: string
  type : string
  names: string
  bDate: Date
  eDate: Date
  cDate: Date
}

export interface IOrder extends IOrderGrid {
  sum: number
}

export interface ICreateOrder {
  type: string
  email: string
  names: string
  sum?: number
  date: string
}

export const initCreateOrder: ICreateOrder = {
  type: '',
  email: '',
  names: '',
  // sum: 0,
  date: moment().add(1, 'days').format('yyyy-MM-DD')
}

export interface IOrderType {
  id: string
  name : string
  searchName: string
  price: number
  isForAlive: boolean
  daysCount: number
  isLiturgyOnly: boolean
}