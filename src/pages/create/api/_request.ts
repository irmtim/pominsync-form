import axios, { AxiosResponse } from "axios"
import { IOrderType } from "entities"

const API_URL = process.env.REACT_APP_API_URL
const MINDATE_URL = (orgId: string) => `${API_URL}/orders/min-date?orgId=${orgId}`
const GET_ORDERTYPES_URL = (orgId: string) => `${API_URL}/orders/ordertypes?orgId=${orgId}`

export const getMinDate = (orgId: string): Promise<Date | null> => {
  
  return axios
    .post(MINDATE_URL(orgId)) 
    .then((d: AxiosResponse<Date | null>) => d.data) 
}

export const getTypes = (orgId: string): Promise<Array<IOrderType>> => {
  
  return axios
    .post(GET_ORDERTYPES_URL(orgId)) 
    .then((d: AxiosResponse<Array<IOrderType>>) => d.data) 
}