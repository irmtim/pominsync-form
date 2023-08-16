import { IOrderType } from "entities"

export interface IData {
  minDate: Date
  orderTypes: IOrderType[]
}