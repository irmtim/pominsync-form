import { useEffect, useMemo, useState } from "react";
import { ICreateOrder, initCreateOrder } from "entities/api/_models";
import { OrderTypesSelect } from "widgets/order-types-select";
import * as Yup from 'yup'
import { Field, Form, Formik } from "formik";
import moment from 'moment'
import {useOrderDates, usePostRedirect} from "shared";
import Loading from "./Loading";
import { IData } from "../api/models";
import { getMinDate, getTypes } from "../api/_request";
import { FormRow } from "./FormRow";

export type CreateFormProps = {
  org: string
  backLink?: string | null
}

const INPUT_DATE_FORMAT = 'yyyy-MM-DD'

const CreateForm = ({org, backLink}: CreateFormProps) => {

  const orderDates = useOrderDates()

  const [systemData, setSystemData] = useState<IData>()

  useEffect(() => {
    const fetchData = async () => {

      const minDate = await getMinDate(org)
      const orderTypes = await getTypes(org)

      if (minDate && orderTypes) {

        setSystemData({
          minDate: minDate,
          orderTypes: orderTypes
        })
      }
    }

    fetchData()
  }, [])

  const validationSchema = useMemo(() => Yup.object().shape({
      type: Yup.string().required('Обязательно для заполнения'),
      email: Yup.string().email('Введите корректный почтовый адрес'),
      names: Yup.string().required('Обязательно для заполнения'),
      sum: Yup.number()
        .required('Обязательно для заполнения')
        .min(10, 'Минимальное пожертвование - 10 рублей'),
      date: Yup.string()
        .required('Дата обязательна для заполнения')
        .test(
          'data-min',
          'Поминовение для этой даты невозможно',
          (value) => {
            return moment(value, INPUT_DATE_FORMAT).isSameOrAfter(moment(systemData?.minDate))
                && moment(value, INPUT_DATE_FORMAT).isSameOrBefore(orderDates.maxDate())
          })
    }), [systemData?.minDate])

  const {perform} = usePostRedirect()

  const compileOrder = (value: ICreateOrder) => {
    var result = moment(value.date).format("DD/MM/YYYY") + " "
               + value.type + " "
               + value.names
    
    return result
  }

  return !systemData
    ? <Loading/>
    : (
    <Formik<ICreateOrder>
      initialValues={{...initCreateOrder, date: orderDates.minDate().format(INPUT_DATE_FORMAT)}}
      validationSchema={validationSchema}
      onSubmit={(value) => {
        const url = `https://${org}.server.paykeeper.ru/create/`
        const postData = {
          sum: value.sum,
          client_email: value.email,
          orderid: compileOrder(value),
          user_result_callback: backLink
        }
        perform(url, postData)
      }}
      >
        {({ errors, touched, values, setFieldValue }) => (
        <Form> 
          <div className="d-flex flex-column">
            <div className="pb-2">
              <OrderTypesSelect orgId={org} types={systemData?.orderTypes} data={values.type} onChange={c => setFieldValue("type", c)} />
              {touched.type && errors.type && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block text-danger'>{errors.type}</div>
                </div>
              )}
            </div>
            <FormRow 
              label="Имена"
              element={
                <>
                  <Field className='form-control' name="names" placeholder="Укажите имена" component='textarea' rows='5' />
                  {touched.names && errors.names && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block text-danger'>{errors.names}</div>
                    </div>
                  )}
                </>}
            />
            <FormRow 
              label="Дата"
              element={
                <>
                  <Field 
                    className='form-control' 
                    name="date" 
                    type="date" 
                    placeholder="ДД.ММ.ГГГГ" 
                    min={orderDates.minDate().format(INPUT_DATE_FORMAT)} 
                    max={orderDates.maxDate().format(INPUT_DATE_FORMAT)} />
                    {touched.date && errors.date && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block text-danger'>{<>{errors.date}</>}</div>
                      </div>
                    )}
                </>}
            />
            <FormRow 
              label="Электронная почта"
              element={
                <>
                  <Field className='form-control' name="email" type="email" placeholder="Электронная почта" />
                  {touched.email && errors.email && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block text-danger'>{<>{errors.email}</>}</div>
                    </div>
                  )}
                </>}
            />
            <FormRow 
              label="Сумма"
              element={
                <>
                  <Field className='form-control' name="sum" type="number" placeholder="Сумма пожертвования" />
                  {touched.sum && errors.sum && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block text-danger'>{errors.sum}</div>
                    </div>
                  )}
                </>}
            />
            <div className="d-flex justify-content-between pb-2">
              <button type="submit" className="btn btn-primary submit-payment">Перейти к оплате</button>
            </div>
          </div>
        </Form>
        )}
    </Formik>
  )
};

export {CreateForm}