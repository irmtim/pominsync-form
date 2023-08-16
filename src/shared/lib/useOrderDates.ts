import moment from "moment"

const timeLimit = process.env.REACT_APP_ORDER_TIME_LIMIT

const useOrderDates = () => {
  const minDate = () => {
    const addDays = moment().hours() >= Number(timeLimit) ? 2 : 1
    return moment().startOf('day').add(addDays, 'days')
  }
  
  const maxDate = () => moment().startOf('day').add(1, 'years')

  return {
    minDate,
    maxDate
  }
}

export {useOrderDates}