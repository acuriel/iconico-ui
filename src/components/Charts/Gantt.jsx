import React, { useState } from "react";
import { addDays, dateToString } from "../../helpers/utils";

import { NavigateBefore, NavigateNext } from "@material-ui/icons";
import IconButton from '@material-ui/core/IconButton';
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';


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

const getColorState = (startDate, endDate, focusDay=undefined) => {
  focusDay = focusDay || Date.now();
  if(focusDay < startDate) return 'todo';
  else if(focusDay <= endDate) return 'in-progress'
  else return 'done'
}

const GanttItem = ({element, getElementTitle, startDate, endDate, isCurrentUser,intervalStart, rowDays, ...props}) => {
  return (
    <tr className={isCurrentUser ? "active" : undefined}>
      <td key={0} >{getElementTitle(element)}</td>
      {[...Array(rowDays).keys()].map(d => {
        return (
          <td 
            key={d + 1} 
            className={dayInsideInterval(addDays(intervalStart, d), startDate, endDate) ? getColorState(startDate, endDate) : undefined}>
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
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container justify="center" spacing={2} className="grantt-header">
          <Grid item>
            <IconButton onClick={() => setFocusDate(addDays(focusDate, -1).getTime())}>
              <NavigateBefore/>
            </IconButton>
          </Grid>
          <Grid item>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                id="date-picker-inline"
                label="Ir a fecha"
                value={focusDate}
                onChange={(date) => setFocusDate(date)}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
            />
          </Grid>
          <Grid item>
            <IconButton onClick={() => setFocusDate(addDays(focusDate, 1).getTime())}>
              <NavigateNext/>
            </IconButton>
          </Grid>
        </Grid>
      </MuiPickersUtilsProvider>

      <table className="iconico-gantt">
        <thead>
          <tr>
            <th>Consultas</th>
            {[...Array(rowDays).keys()].map(key=> key % 5 === 1 ? <th className='time-mark'>{dateToString(addDays(getIntervalDates(focusDate, rowDays)[0], key))}</th>:<th></th>)}
          </tr>
        </thead>
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
            focusDate={focusDate}
            key={i}
            />)}
          </tbody>
      </table>
    </div>
  )
}
