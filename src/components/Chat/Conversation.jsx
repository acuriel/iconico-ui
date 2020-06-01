import React from "react";
import { observer } from "mobx-react";

import ChatMessage from './ChatMessage'


function Conversation({messages, replyAction}) {
  return (
    <div>
      <div className="chat-conversation" id="chat-conversation" autoFocus={true}>
        {messages.map(msg => (
          <ChatMessage
            key={msg.id}
            msg={msg}
            replyAction={() => replyAction(msg)}
          />
        ))}
      </div>
    </div>
  );
};

export default observer(Conversation);
