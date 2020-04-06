import React, { useState, useEffect, useRef } from "react";
// import "react-chat-elements/dist/main.css";

import {apiService} from "services";
import Conversation from './Conversation'

import { animateScroll } from "react-scroll";

import { makeStyles } from "@material-ui/core/styles";
import CustomInput from "components/CustomInput/CustomInput";
import Button from "components/CustomButtons/Button";
import ImageUpload from "components/CustomUpload/ImageUpload";

// @material-ui/core components
import Send from "@material-ui/icons/Send";
import AddPhotoAlternate from "@material-ui/icons/AddPhotoAlternate";
import PhotoSizeSelectActual from "@material-ui/icons/PhotoSizeSelectActual";
import Reply from "@material-ui/icons/Reply";
import { authService } from "../../services";


const scrollToBottom = () => {
  animateScroll.scrollToBottom({
    containerId: "chat-conversation",
    duration: 0
  });
};

const useConversation = (consultationId, getEndpoint, externalData=undefined) => {
  const [conv, setConv] = useState([]);
  useEffect(() => {
    (externalData 
      ? getEndpoint(
        consultationId, 
        externalData.Author._id, 
        externalData.Receiver._id) 
      : getEndpoint(consultationId)
      ).then(res => {
      setConv(res.data);
      scrollToBottom();
      sessionStorage.setItem("chat_count", res.data.length);
    });
  }, []);
  return [conv, setConv];
};

export default function Chat({ currentElement, currentExternal, noEditing, getEndpoint, postEndpoint, ...props }) {
  const [text, setText] = useState("");
  const [comMsg, setComMsg] = useState(null);
  const inputRef = useRef();
  const [conv, setConv] = useConversation(currentElement._id, getEndpoint, currentExternal);
  const [showAttaching, setShowAttaching] = useState(false);
  const [attachedFile, setAttachedFile] = useState(undefined);

  const liveChat = (consultationId, setConv) => {
    return new Promise((resolve, reject) => {
      try {
        getEndpoint(consultationId).then(res => {
          if (res.data.length !== parseInt(sessionStorage.getItem("chat_count"))) {
            sessionStorage.setItem("chat_count", res.data.length);
            setConv(res.data);
            scrollToBottom();
          }
        });
        return resolve;
      } catch (error) {
        console.log("Error loading conversation: " + error);
        return reject(error);
      }
    }).then(setTimeout(() => liveChat(consultationId, setConv), 3000));
  };

  useEffect(() => {
    liveChat(currentElement._id, setConv);
  }, []);
  
  const sendMessage = () => {
    let newConv = {
      _idConsulta: currentElement._id,
      Author: { UserName: authService.currentUserValue.userName },
      Mentions: currentExternal ? [currentExternal.Receiver] : [],
      ThisCommentAnswersTo: comMsg,
      CommentText: inputRef.current.value
  };
  const send = () =>
    postEndpoint(newConv).then(() => {
      setText("");
      inputRef.current.value = "";
      setConv([...conv, newConv]);
      setComMsg(null);
      setAttachedFile(undefined);
      setShowAttaching(false);
      scrollToBottom();
    });

    if (attachedFile) {
      apiService.uploadImage(attachedFile).then(res => {
        send();
      });
    } else {
      send();
    }
  };

  const handleKeyPress = (event) => {
    if(event.key === 'Enter'){
      sendMessage()
      setText("");
      inputRef.current.value = "";
      console.log('enter press here! ')
    }
  }

  const renderCommentingMsg = () => {
    return comMsg && (
        <div className="chat-text-box">
          <Reply />
          <b>{comMsg.Author.UserName}: </b>
          {comMsg.CommentText}
        </div>
      );
  };
  const renderTextBox = () => {
    return !noEditing && (
      <div>
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
              inputRef: inputRef,
              value: text,
              onChange: (e) => setText(e.target.value),
              onKeyPress:handleKeyPress
            }}
          />
          {attachedFile ? (
            <Button
              color="success"
              simple
              justIcon
              onClick={() => setShowAttaching(true)}
              style={{ float: "right" }}
            >
              <PhotoSizeSelectActual />
            </Button>
          ) : (
            <Button
              color="info"
              simple
              justIcon
              onClick={() => setShowAttaching(true)}
              style={{ float: "right" }}
            >
              <AddPhotoAlternate />
            </Button>
          )}

          <Button
            color="info"
            simple
            justIcon
            onClick={() => sendMessage()}
            style={{ float: "right" }}
          >
            <Send />
          </Button>
        </div>
        {renderCommentingMsg()}
      </div>
    );
  }
  return (
    <div>
      {/* {renderMembers()} */}
      <Conversation conv={conv} setReplyMsg={setComMsg} />
      {renderTextBox()}
      {showAttaching && <ImageUpload handleChange={setAttachedFile} />}
    </div>
  );
}
