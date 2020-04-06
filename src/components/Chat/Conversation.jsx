import React from "react";

import ChatMessage from './ChatMessage'


export default function Conversation({conv, setReplyMsg, ...props}) {
  //ScrollToBottom
  return (
    <div>
      <div className="chat-conversation" id="chat-conversation">
        {conv.map((c, i) => (
          <ChatMessage
            key={i}
            msg={c}
            setReplyMsg={setReplyMsg}
          />
        ))}
      </div>
    </div>
  );
};
