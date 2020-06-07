import React, { useState, useEffect, useRef } from "react";
// import "react-chat-elements/dist/main.css";

import Conversation from './Conversation'

import { animateScroll } from "react-scroll";
import Viewer from 'react-viewer';
import Button from "components/CustomButtons/Button";
import ImageUpload from "components/CustomUpload/ImageUpload";
import TextField from '@material-ui/core/TextField';

// @material-ui/core components
import Send from "@material-ui/icons/Send";
import AddPhotoAlternate from "@material-ui/icons/AddPhotoAlternate";
import PhotoSizeSelectActual from "@material-ui/icons/PhotoSizeSelectActual";
import Reply from "@material-ui/icons/Reply";
import { observer } from "mobx-react";


const scrollToBottom = () => {
  animateScroll.scrollToBottom({
    containerId: "chat-conversation",
    duration: 0
  });
};


function Chat({ conversation }) {
  const [showAttaching, setShowAttaching] = useState(false);

  // scrollToBottom()

  useEffect(() => {
    const interval = setInterval(() => conversation._reload(), 1000)
    return () => {
      clearInterval(interval);
    }
  }, [])

  const sendMessage = () => {
    conversation.sendMessage();
    setShowAttaching(false);

  }

  const handleKeyPress = (event) => {
    if(event.key === 'Enter'){
      sendMessage();
    }
  }

  return (
    <div>
      <Viewer
        visible={conversation.galeryVisibility.get()}
        activeIndex={conversation.galeryActiveIndex}
        onClose={() => conversation.setGaleryVisibility(false)}
        images={conversation.allImagesSrc}
        onMaskClick={() => conversation.setGaleryVisibility(false)}
        />
      <Conversation messages={conversation.comments} replyAction={(msg) => conversation.setReply(msg)} />
      <div>
        <div className="chat-text-box">
          <TextField
            style={{ display: "inline-block" }}
            label="Mensaje"
            required
            fullWidth={true}
            value={conversation.newMessage.text}
            onKeyPress={handleKeyPress}
            onChange={ e => {
              conversation.newMessage.text = e.target.value
            }}/>
          {conversation.newMessage.attachedFile ? (
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
        {conversation.newMessage.replyTo && (
        <div className="chat-text-box">
            <Reply />
            <b>{conversation.newMessage.replyTo.author.userName}: </b>
            {conversation.newMessage.replyTo.text}
          </div>
        )}
      </div>
      {showAttaching && <ImageUpload handleChange={f => conversation.newMessage.attachedFile = f} />}
    </div>
  );
}

export default observer(Chat);
