import { useEffect, useMemo, useState } from "react";
import { ICreateOrder, initCreateOrder } from "entities/api/_models";
import { OrderTypesSelect } from "widgets/order-types-select";
import * as Yup from 'yup'
import { Field, Form, Formik } from "formik";
import moment from 'moment'
import {FormRow, FormValidation, useOrderDates, usePostRedirect} from "shared";
import Loading from "./Loading";
import { IOrgData } from "../api/models";
import { getOrgData } from "../api/_request";

export type CreateFormProps = {
  org: string
  backLink?: string | null
}

const INPUT_DATE_FORMAT = 'yyyy-MM-DD'

const CreateForm = ({org, backLink}: CreateFormProps) => {

  const orderDates = useOrderDates()

  const [systemData, setSystemData] = useState<IOrgData>()

  useEffect(() => {
    const fetchData = async () => {

      const orgData = await getOrgData(org)

      if (orgData) {
        setSystemData(orgData)
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
          `Записки на следующий день принимаются до ${moment(systemData?.timeLimit, 'YYYY-MM-DDTHH:mm').format('HH:mm')}`,
          (value) => {
            if (!moment(value).isSame(moment().add(1,'days'), 'days')) {
              return true
            }

            return moment().isBefore(moment(systemData?.timeLimit))
          })
        .test(
          'data-range',
          'Поминовение для этой даты невозможно',
          (value) => {
            return moment(value, INPUT_DATE_FORMAT).isSameOrAfter(moment(systemData?.minDate, INPUT_DATE_FORMAT))
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
      initialValues={{...initCreateOrder, date: moment(systemData.minDate).format(INPUT_DATE_FORMAT)}}
      validationSchema={validationSchema}
      onSubmit={(value) => {
        const url = `https://${org}.server.paykeeper.ru/create/`
        const postData = {
          sum: value.sum,
          client_email: value.email,
          orderid: compileOrder(value),
          user_result_callback: backLink !== null ? backLink : '/'
        }
        perform(url, postData)
      }}
      >
        {({ errors, touched, values, setFieldValue }) => (
        <Form> 
          <div className="d-flex flex-column">
            <div className="pb-2">
              <OrderTypesSelect orgId={org} types={systemData.orderTypes} data={values.type} onChange={c => setFieldValue("type", c)} />
              <FormValidation errors={errors.type} touched={touched.type}/>
            </div>
            <FormRow 
              label="Имена"
              element={
                <>
                  <Field className='form-control' name="names" placeholder="Укажите имена" component='textarea' rows='5' />
                  <FormValidation errors={errors.names} touched={touched.names}/>
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
                    min={moment(systemData.minDate).format(INPUT_DATE_FORMAT)} 
                    max={orderDates.maxDate().format(INPUT_DATE_FORMAT)} 
                  />
                  <FormValidation errors={errors.date} touched={touched.date}/>
                </>}
            />
            <FormRow 
              label="Электронная почта"
              element={
                <>
                  <Field className='form-control' name="email" type="email" placeholder="Электронная почта" />
                  <FormValidation errors={errors.email} touched={touched.email}/>
                </>}
            />
            <FormRow 
              label="Сумма"
              element={
                <>
                  <Field className='form-control' name="sum" type="number" placeholder="Сумма пожертвования" />
                  <FormValidation errors={errors.sum} touched={touched.sum}/>
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