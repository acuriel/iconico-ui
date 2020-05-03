import React, { useState, useEffect } from "react";
import { addDays, dateToStringShort, getWidth } from "../../helpers/utils";
import { Link } from "react-router-dom";
import { NavigateBefore, NavigateNext, Done, WatchLaterOutlined } from "@material-ui/icons";
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


const elementInsideInterval = (elem, getStartDate, getEndDate, focusDate, rowDays) => {
  const elemStart = getStartDate(elem);
  const elemEnd = getEndDate(elem);
  const [start, end] = getIntervalDates(focusDate, rowDays);
  return (start <= elemStart && elemStart <= end) || (start <= elemEnd && elemEnd <= end)
}


const dayInsideInterval = (date, start, end) => start <= date && date <= addDays(end, 1)

const dayMarker = row => row % 2 === 0

const getColorState = (startDate, endDate, manuallyFinishedDate, focusDay=undefined) => {
  focusDay = focusDay || Date.now();
  if(manuallyFinishedDate && focusDay > addDays(manuallyFinishedDate, 1)){
    return 'bg-danger-lite';
  }
  // if(focusDay < startDate) return 'todo';
  // else if(focusDay <= endDate) return 'in-progress'
  // else return 'bg-danger'
  return 'bg-danger';

}

const GanttItem = ({element, title, startDate, endDate, manuallyFinishedDate, isCurrentUser,intervalStart, rowDays}) => {
  return (
    <tr className={isCurrentUser ? "active" : undefined}>
      <td key={0} title={title} >
        <Link to={"/admin/consulta/" + element._id}>{title}</Link>
      </td>
      {[...Array(rowDays).keys()].map(d => {
        return (
          <td  className={dayMarker(d) ? ' time-mark':''}
            key={d + 1}
            title={dateToStringShort(addDays(intervalStart, d))}>
              <div className={(
                dayInsideInterval(addDays(intervalStart, d+1), startDate, endDate) 
                ? getColorState(startDate, endDate, manuallyFinishedDate, addDays(intervalStart, d+1)) 
                : '')}>
                {manuallyFinishedDate && addDays(intervalStart, d).getDate() === manuallyFinishedDate.getDate() ? <Done/> : ""}
              </div>
          </td>
        )})}
    </tr>
  )
}

export default function GanttChart({elements, getElementTitle, getStartDate, getEndDate, getManuallyFinishedDate, currentUser, getAuthorUser}) {
  const [rowDays, setRowDays] = useState(31);
  const [focusDate, setFocusDate] = useState(Date.now())

  useEffect(() => {
    const resizeListener = () => {
      const temp = Math.floor(getWidth() / 100);
      if(dayMarker(temp)){
        setRowDays(temp*2);
      }
    }
    window.addEventListener('resize', resizeListener)
    return () => {
      window.removeEventListener('resize', resizeListener)
    }
  }, [])

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
                format="dd/MM/yyyy"
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
            <th key={0}></th>
            {[...Array(rowDays).keys()].map(key=> 
              dayMarker(key)
              ? <th className='time-mark' key={key + 1}>
                <div>{dateToStringShort(addDays(getIntervalDates(focusDate, rowDays)[0], key))}</div>
              </th>
              : <th key={key + 1}/>)}
          </tr>
        </thead>
        <tbody>
          {elements.filter(elem => elementInsideInterval(elem, getStartDate, getEndDate, focusDate, rowDays)).map(
            (elem, i) => <GanttItem 
            element={elem} 
            title={getElementTitle(elem)} 
            startDate={getStartDate(elem)}
            endDate={getEndDate(elem)}
            manuallyFinishedDate={getManuallyFinishedDate(elem)}
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
