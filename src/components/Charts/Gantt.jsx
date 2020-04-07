import React, { useState, useEffect } from "react";
import { addDays } from "../../helpers/utils";

import GridItem from "components/Grid/GridItem";
import GridContainer from "components/Grid/GridContainer";
import { Button } from "@material-ui/core";

const getIntervalDates = (focusDay, rowDays) => [
  addDays(focusDay, -1 * Math.floor(rowDays/2)), 
  addDays(focusDay, Math.floor(rowDays/2))
]

const useIntervalState = (rowDays, focusDate=Date.now()) => {
  const [rowDaysState, setRowDaysState] = useState(rowDays);
  const [focusDateState, setFocusDateState] = useState(focusDate)

  const setState = (newRowDays=rowDays, newFocusDate=focusDate) => {
    setRowDaysState(newRowDays);
    setFocusDateState(newFocusDate);
  }

  return [rowDaysState, focusDateState]
}

const elementInsideInterval = (elem, getStartDate, getEndDate, focusDate, rowDays) => {
  const elemStart = getStartDate(elem);
  const elemEnd = getEndDate(elem);
  const [start, end] = getIntervalDates(focusDate, rowDays);
  return (start <= elemStart && elemStart <= end) || (start <= elemEnd && elemEnd <= end)
}


const dayInsideInterval = (date, start, end) => start <= date && date <= end

const GanttItem = ({element, getElementTitle, startDate, endDate, isCurrentUser,intervalStart, rowDays, ...props}) => {
  return (
    <tr className={isCurrentUser && "active"}>
      <td key={0} >{getElementTitle(element)}</td>
      {[...Array(rowDays).keys()].map(d => {
        return (
          <td 
            key={d + 1} 
            className={dayInsideInterval(addDays(intervalStart, d), startDate, endDate) && "filled"}>
              <div/>
          </td>
        )})}
    </tr>
  )
}

export default function GanttChart({elements, getElementTitle, getStartDate, getEndDate, currentUser, getAuthorUser, ...props}) {
  const [rowDays, setRowDays] = useState(31);
  const [focusDate, setFocusDate] = useState(Date.now())

  return (
    <div>
      <GridContainer>
        <GridItem xs={1} sm={1} md={1}>
          <Button onClick={() => setFocusDate(addDays(focusDate, -1).getTime())}>Prev</Button>
        </GridItem>
        <GridItem xs={10} sm={10} md={10}>
          <div>{focusDate}</div>
        </GridItem>
        <GridItem xs={1} sm={1} md={1}>
          <Button onClick={() => setFocusDate(addDays(focusDate, 1).getTime())}>Next</Button>
        </GridItem>
      </GridContainer>
      <table className="iconico-gantt">
        <tbody>
          {elements.filter(elem => elementInsideInterval(elem, getStartDate, getEndDate, focusDate, rowDays)).map(
            (elem, i) => <GanttItem 
            element={elem} 
            getElementTitle={getElementTitle} 
            startDate={getStartDate(elem)}
            endDate={getEndDate(elem)}
            rowDays={rowDays}
            intervalStart = {getIntervalDates(focusDate, rowDays)[0]}
            isCurrentUser={currentUser.userName === getAuthorUser(elem)}
            key={i}
            />)}
          </tbody>
      </table>
    </div>
  )
}
