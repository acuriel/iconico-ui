import React from "react";
import { authService } from "../../services";

import Button from "components/CustomButtons/Button";
import Reply from "@material-ui/icons/Reply";
import RemoveRedEye from "@material-ui/icons/RemoveRedEye";

import ChatBubble from './ChatBubble'


export default function ChatMessage({ msg, setReplyMsg, ...props }){
  const showReplyButton = () => {
    if (authService.currentUserValue.userName !== msg.Author.UserName)
      return (
        <Button
          color="info"
          justIcon
          simple
          round
          onClick={() => setReplyMsg(msg)}
          style={{ float: "right", marginRight: "-10px" }}
        >
          <Reply />
        </Button>
      );
  };
  const showImage = () => {
    if (msg.ImageData) {
      return (
        <div
          style={{
            position: "relative",
            width: "fit-content",
            marginBottom: "10px"
          }}
        >
          <br />
          <a href={`data:${msg.ImageMimeType};base64,${msg.ImageData}`}>
            <div className="image-cover">
              <RemoveRedEye />
            </div>
          </a>
          <img
            alt="Attachment"
            className="chat-image"
            src={`data:${msg.ImageMimeType};base64,${msg.ImageData}`}
          />
          <br />
        </div>
      );
    }
  };
  return (
    <div>
      <ChatBubble msg={msg} pushRight={authService.currentUserValue.userName === msg.Author.UserName}>
        {showReplyButton()}
        {showImage()}
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
