import { IOrderType } from "entities/api/_models";
import { FC, useEffect, useMemo, useState } from "react";
import { getTypes } from "./api/_request";
import { firstOrderList, secondOrderList } from "entities/api/orderValues";

type Props = {
  orgId: string
  types: IOrderType[]
  data?: string
  onChange?: (type: string) => void
  onLoaded?: () => void
}

const OrderTypesSelect: FC<Props> = ({orgId, types, data, onChange, onLoaded}) => {
  // const [types, setTypes] = useState<IOrderType[]>()
  const [selected, setSelected] = useState<IOrderType>()
  // const {orgId} = {orgId: 'berluki'}

  const secondListItems = useMemo(() => {
    const filtered = types?.filter(c => c.isForAlive === selected?.isForAlive)
      .map(c => {return { daysCount: c.daysCount}})
      .filter((thing, i, arr) => arr.findIndex(t => t.daysCount === thing.daysCount) === i)
      .sort((a, b) => a.daysCount - b.daysCount)

    // const result = [...new Set(filtered?.map(c => c.daysCount))]

    return filtered
  }, [selected?.isForAlive, types])
  
  const thirdListItems = useMemo(() => types?.filter(c => c.daysCount === selected?.daysCount && c.isForAlive === selected?.isForAlive)
  , [selected?.daysCount, selected?.isForAlive, types])

  useEffect(() => {
    if (!types) return

    const newSelected = 
      data 
        ? types?.find(c => c.name === data)
        : types?.find(c => c.isForAlive === true 
                    && c.daysCount === 1) 
          ?? types[0]

    setSelected(newSelected)
  }, [])

  const selectFirstList = (isForAlive: boolean) => {
    if (!types) return

    const newSelected = 
      types?.find(c => c.isForAlive === isForAlive 
                    && c.daysCount === 1) 
      ?? types[0]

    setSelected(newSelected)
  }

  const selectSecondList = (daysCount: number) => {
    if (!types) return

    const newSelected = 
      types?.find(c => c.isForAlive === selected?.isForAlive 
                    && c.daysCount === daysCount) 
      ?? types[0]

    setSelected(newSelected)
  }

  const selectThirdList = (name: string) => {
    if (!types) return

    const newSelected = 
      types?.find(c => c.isForAlive === selected?.isForAlive 
                    && c.daysCount === selected?.daysCount
                    && c.name === name) 
      ?? types[0]

    setSelected(newSelected)
  }

  const secondListItemName = (daysCount: number) => secondOrderList.find(c => c.key === daysCount)?.value

  //OnChange
  useEffect(() => {
    if (!onChange || !selected) return

    onChange(selected.searchName)
  }, [selected])

  return types
   ? (
    <div className="d-flex flex-column">
      {/*О здравии - упокоении*/}
      <div className="d-block btn-group pb-3" role="group">
        {firstOrderList.map((item, index) => (
          <>
            <input 
              type="radio" 
              className="btn-check" 
              onChange={() => selectFirstList(item.key)}
              checked={item.key === selected?.isForAlive}
              id={`first${index}`}
            />
            <label className="btn btn-outline-secondary" htmlFor={`first${index}`}>{item.value}</label>
          </>
        ))}
      </div>
      {/*Продолжительность*/}
      <div className="d-grid justify-content-between btn-group-vertical pb-3" role="group">
        {secondListItems?.map((item, index) => (
          <>
            <input 
              type="radio" 
              className="btn-check" 
              onChange={() => selectSecondList(item.daysCount)}
              checked={item.daysCount === selected?.daysCount}
              id={`second${index}`}
            />
            <label className="btn btn-outline-secondary" htmlFor={`second${index}`}>{secondListItemName(item.daysCount)}</label>
          </>
        ))}
      </div>
      {/*Категория*/}
      <div className="btn-group-vertical pb-2" role="group">
        {thirdListItems?.map((item, index) => (
          <>
            <input 
              type="radio" 
              className="btn-check" 
              onChange={() => selectThirdList(item.name)}
              checked={item.name === selected?.name}
              id={`third${index}`}
            />
            <label className="btn btn-outline-secondary" htmlFor={`third${index}`}>{item.name} - <span className="text-warning fst-italic">{item.price} руб./имя</span></label>
          </>
        ))}
      </div>
    </div>
    )
  : <></>
};

export {OrderTypesSelect}