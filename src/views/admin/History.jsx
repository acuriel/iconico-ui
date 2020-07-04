import React, { useState, useContext } from "react";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import { dateToString, secuencialStringSearch } from "../../helpers/utils";
import StoreContext from "stores/RootStore";
import HistoryStore from "stores/HistoryStore";

import GridItem from "components/Grid/GridItem";
import GridContainer from "components/Grid/GridContainer";
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Chip from "@material-ui/core/Chip";
import Paper from '@material-ui/core/Paper';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Card from "components/Card/Card";
import CardHeader from "components/Card/CardHeader";
import CardBody from "../../components/Card/CardBody";
import CardIcon from "../../components/Card/CardIcon";
import Assignment from "@material-ui/icons/Assignment";
import Person from "@material-ui/icons/Person";
import CalendarToday from "@material-ui/icons/CalendarToday";
import MembersAvatarGroup from "components/ConsultationInfo/MembersAvatarGroup";


import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';


function History() {
  const [historyStore, setHistoryStore] = useState(new HistoryStore());
  const [title, setTitle] = useState("");
  const [consultationTitle, setConsultationTitle] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [member, setMember] = useState("");
  const [fromDate, setFromDate] = useState(null)
  const [toDate, setToDate] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedTruth, setSelectedTruth] = useState(undefined)
  const {consultationStore} = useContext(StoreContext);

  const filterData = (truths)=>{
    return truths.filter(truth => {
      return (!title || title.length === 0 || secuencialStringSearch(title, truth.title)) &&
      (!consultationTitle || consultationTitle.length === 0 || secuencialStringSearch(consultationTitle, truth.consultationTitle)) &&
      (selectedTags.length === 0 || truth.tags.some(t => selectedTags.indexOf(t) >= 0)) &&
      (!member || member.length === 0 || truth.members.some(m => m === member)) &&
      (!fromDate || fromDate <= truth.consultationEnd ) &&
      (!toDate || toDate  >= truth.consultationStart)
    }
      )
  }

  return  (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
    <div>
      <Modal
        className="truth-modal"
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={showModal}
        onClose={() => setShowModal(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={showModal}>
          <Card className="modal-content">

              <CardHeader color="info" icon>
                <CardIcon color="info">
                  <Assignment />
                </CardIcon>
                <h3 style={{color:"black"}}>{selectedTruth?.title}</h3>
              </CardHeader>
              <CardBody>
                <div className="member-list-section">
                  <GridContainer>
                    <GridItem sm={9} xs={12}>
                    <Person
                    style={{
                      fontSize: "1.5em",
                      marginBottom: "-4px",
                      marginRight: "5px"
                    }}
                  />
                  {selectedTruth?.author.userName}
                  <CalendarToday
                    style={{
                      fontSize: "1.5em",
                      marginBottom: "-4px",
                      marginRight: "5px",
                      marginLeft: "20px"
                    }}
                  />{" "}
                  {selectedTruth && selectedTruth.createdOn && dateToString(selectedTruth.createdOn)}
                  <p style={{ marginTop: "15px" }}><b>Descripción: </b></p>
                  {selectedTruth?.summary}

                    </GridItem>
                    <GridItem sm={3} xs={12}>
                      <h5>Miembros</h5>
                      {selectedTruth && <MembersAvatarGroup users={selectedTruth.members}/>}
                    </GridItem>
                    <GridItem sm={12} xs={12}>
                      {selectedTruth && <img src={`data:${selectedTruth.imageMimeType};base64,${selectedTruth.imageData}`} alt="" style={{maxHeight:"300px"}}/>}
                    </GridItem>
                  </GridContainer>
                </div>
              </CardBody>
            </Card>
        </Fade>
      </Modal>
      <GridContainer style={{marginBottom:"20px"}}>
        <GridItem xs={12} sm={6} md={4}>
          <TextField
            label="Título"
            style={{marginTop:"16px"}}
            autoFocus={true}
            fullWidth
            value={title}
            onChange={ e => setTitle(e.target.value)}
          />
        </GridItem>
        <GridItem xs={12} sm={6} md={4}>
          <TextField
            label="Título de Consulta"
            style={{marginTop:"16px"}}
            autoFocus={true}
            fullWidth
            value={consultationTitle}
            onChange={ e => setConsultationTitle(e.target.value)}
          />
        </GridItem>
        <GridItem xs={12} sm={6} md={4}>
          <Autocomplete
            style={ { marginTop:"16px" }}
            multiple
            options={historyStore.allTags}
            getOptionLabel={(option) => option}
            onChange={(_,v) => setSelectedTags(v)}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="Etiquetas"
                placeholder="Etiqueta"
              />
            )}
          />
        </GridItem>
        <GridItem xs={12} sm={6} md={4}>
          <Autocomplete
            style={{marginTop:"16px"}}
            id="combo-box-demo"
            options={consultationStore.getAllMembers}
            getOptionLabel={(option) => option.userName}
            onChange={(_, v) => setMember(v ? v.userName : '')}
            renderInput={(params) => <TextField {...params} label="Miembros"/>}
          />
        </GridItem>
        <GridItem xs={12} sm={6} md={4}>
          <KeyboardDatePicker
            style={{width:"100%"}}
            disableToolbar
            variant="inline"
            format="dd/MM/yyyy"
            margin="normal"
            id="date-picker-inline"
            label="Después de"
            value={fromDate}
            onChange={(date) => {
              setFromDate(date);
            }}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}/>
        </GridItem>
        <GridItem xs={12} sm={6} md={4}>
          <KeyboardDatePicker
            style={{width:"100%"}}
            disableToolbar
            variant="inline"
            format="dd/MM/yyyy"
            margin="normal"
            id="date-picker-inline"
            label="Antes de"
            value={toDate}
            onChange={(date) => {
              setToDate(date);
            }}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}/>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
        <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell style={{fontWeight:"bold"}}>Título</TableCell>
            <TableCell style={{fontWeight:"bold"}}>Etiquetas</TableCell>
            <TableCell align="right" style={{fontWeight:"bold"}}>Fechas</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filterData(historyStore.truthes).map((truth) =>  (
            <TableRow key={truth.id}>
              <TableCell component="th" scope="row">
                <Link onClick={() => {
                  setSelectedTruth(truth);
                  setShowModal(true)
                  }}> {truth.title}</Link>
              </TableCell>
              <TableCell align="left">
                {truth.tags.map(tag => <Chip label={tag} />)}
              </TableCell>
              <TableCell align="right">{dateToString(new Date(truth.consultationStart))} - {dateToString(new Date(truth.consultationEnd))}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
        </GridItem>
      </GridContainer>
    </div>
    </MuiPickersUtilsProvider>
  );
}

export default observer(History);
