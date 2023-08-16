import { IOrderType } from "entities"

export interface IOrgData {
  minDate: Date
  timeLimit: Date
  orderTypes: IOrderType[]
}