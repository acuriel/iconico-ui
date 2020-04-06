import React, { useState, useEffect, useRef } from "react";
import "react-chat-elements/dist/main.css";

import {apiService} from "services";

// import ScrollToBottom from "react-scroll-to-bottom";

import { makeStyles } from "@material-ui/core/styles";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import CustomDropdown from "components/CustomDropdown/CustomDropdown.js";

// @material-ui/core components
import Favorite from "@material-ui/icons/Favorite";
import Send from "@material-ui/icons/Send";
import Reply from "@material-ui/icons/Reply";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";

import efstyles from "assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.js";

const useefStyles = makeStyles(efstyles);

const useConversation = (cons, ext) => {
  const [conv, setConv] = useState([]);
  useEffect(() => {
    apiService
      .getExternalConversation(cons._id, ext.Author._id, ext.Receiver._id)
      .then(res => setConv(res.data));
  }, []);
  return [conv, setConv];
};

export default function ProviderChat({
  currentElement,
  currentExternal,
  ...props
}) {
  const efClasses = useefStyles();
  const [consultation, setConsultation] = useState(currentElement);
  const [text, setText] = useState("");
  const [comMsg, setComMsg] = useState(null);
  const inputRef = useRef();
  const [conv, setConv] = useConversation(currentElement, currentExternal);

  const ChatMessage = ({ msg, ...props }) => {
    const showReplyButton = () => {
      if (!props.currentUser)
        return (
          <Button
            color="info"
            justIcon
            simple
            round
            onClick={() => setComMsg(msg)}
            style={{ float: "right", marginRight: "-10px" }}
          >
            <Reply />
          </Button>
        );
    };
    return (
      <div>
        <ChatBubble msg={msg} pushRight={props.currentUser}>
          {showReplyButton()}
          <span>{msg.Author.UserName}</span>
          {msg.ThisCommentAnswersTo !== null ? (
            <ChatBubble msg={msg.ThisCommentAnswersTo} />
          ) : (
            ""
          )}
        </ChatBubble>
      </div>
    );
  };

  const ChatBubble = ({ msg, ...props }) => {
    return (
      <div
        className={props.pushRight ? "bubble-msg current-user" : "bubble-msg"}
      >
        {props.children}
        <p>{msg.CommentText}</p>
        {msg.HighLighted ? <Favorite /> : <FavoriteBorder />}
      </div>
    );
  };

  const Conversation = () => {
    return (
      <div>
        <div className="chat-conversation">
          {conv.map((c, i) => (
            <ChatMessage
              key={i}
              msg={c}
              currentUser={c.Author.id === apiService.currentUser().id}
            />
          ))}
        </div>
      </div>
    );
  };

  const sendMessage = () => {
    const newConv = {
      _idConsulta: currentElement._id,
      Author: {
        id: apiService.currentUser().id,
        UserName: apiService.currentUser().UserName,
        UserEmail: apiService.currentUser().UserEmail
      },
      Mentions: [currentExternal.Receiver],
      HighLighted: false,
      HighLightedBy: null,
      ThisCommentAnswersTo: comMsg,
      ImageData: null,
      ImageMimeType: null,
      CommentText: inputRef.current.value,
      PostedOn: Date.now()
    };
    apiService.addExternalMessage(newConv).then(() => {
      setText("");
      inputRef.current.value = "";
      setConv([...conv, newConv]);
      setComMsg(null);
    });
  };

  const renderCommentingMsg = () => {
    if (comMsg !== null)
      return (
        <div className="chat-text-box">
          <Reply />
          <b>{comMsg.Author.UserName}: </b>
          {comMsg.CommentText}
        </div>
      );
  };
  const renderTextBox = () => {
    return (
      <div className="chat-text-box">
        <CustomInput
          style={{ dispplay: "inline-block" }}
          labelText="Mensaje"
          id="message"
          // value={text}
          formControlProps={{
            fullWidth: true
          }}
          inputProps={{
            multiline: true,
            rows: 3,
            inputRef: inputRef
          }}
        />
        <Button
          color="info"
          simple
          onClick={() => sendMessage()}
          style={{ float: "right" }}
        >
          Enviar
          <Send />
        </Button>
        {renderCommentingMsg()}
      </div>
    );
  };

  return (
    <div>
      {/* {renderMembers()} */}
      <Conversation conv={conv} />
      {renderTextBox()}
    </div>
  );
}
