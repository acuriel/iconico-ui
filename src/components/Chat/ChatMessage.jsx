import React, {useContext} from "react";
import StoreContext from "stores/RootStore";
import { authService } from "../../services";

import Reply from "@material-ui/icons/Reply";
import RemoveRedEye from "@material-ui/icons/RemoveRedEye";

import ChatBubble from './ChatBubble'
import { observer } from "mobx-react";


function ChatMessage({ msg, replyAction, ...props }){
  const {uiStore} = useContext(StoreContext)


  const showImage = () => {
    if (msg.imageData) {
      return (
        <div className="chat-image-container">
          <div className="chat-image"
            style={{
              backgroundImage: `url('data:${msg.imageMimeType};base64,${msg.imageData}')`,
              }}>
            <div className="image-cover" onClick={() => msg.conversation.setGaleryVisibility(true)}>
              <RemoveRedEye />
            </div>
          </div>
          {/* <img
            alt="Attachment"
            className="chat-image"
            src={`data:${msg.imageMimeType};base64,${msg.imageData}`}
          /> */}
          <br />
        </div>
      );
    }
  };
  return (
    <div>
      <ChatBubble msg={msg} pushRight={uiStore.signedUser.userName === msg.author.userName}>
        {uiStore.signedUser.userName === msg.author.userName || <Reply className="reply-btn" onClick={() => replyAction(msg)}/>}
        {showImage()}
        <span>{msg.author.userName}</span>
        {msg.replyTo && <ChatBubble msg={msg.replyTo}><span>{msg.replyTo.author.userName}</span> </ChatBubble>}
      </ChatBubble>
    </div>
  );
};

export default observer(ChatMessage);
