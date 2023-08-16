import axios, { AxiosResponse } from "axios"
import { IOrderType } from "entities/api/_models"

const API_URL = process.env.REACT_APP_API_URL
const GET_URL = (orgId: string) => `${API_URL}/orders/ordertypes?orgId=${orgId}`

export const getTypes = (orgId: string): Promise<Array<IOrderType>> => {
  
  return axios
    .post(GET_URL(orgId)) 
    .then((d: AxiosResponse<Array<IOrderType>>) => d.data) 
}