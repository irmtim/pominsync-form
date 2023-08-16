import axios, { AxiosResponse } from "axios"
import { IOrderType } from "entities"
import { IOrgData } from "./models"

const API_URL = process.env.REACT_APP_API_URL
const ORG_DATA_URL = (orgId: string) => `${API_URL}/orders/org-data?orgId=${orgId}`
const GET_ORDERTYPES_URL = (orgId: string) => `${API_URL}/orders/ordertypes?orgId=${orgId}`

export const getTypes = (orgId: string): Promise<Array<IOrderType>> => {
  
  return axios
    .post(GET_ORDERTYPES_URL(orgId)) 
    .then((d: AxiosResponse<Array<IOrderType>>) => d.data) 
}

export const getOrgData = (orgId: string): Promise<IOrgData> => {
  
  return axios
    .post(ORG_DATA_URL(orgId)) 
    .then((d: AxiosResponse<IOrgData>) => d.data) 
}