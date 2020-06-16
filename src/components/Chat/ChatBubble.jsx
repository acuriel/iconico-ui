import React from "react";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import Favorite from "@material-ui/icons/Favorite";


export default function ChatBubble({ msg, ...props }) {
  return (
    <div
      className={props.pushRight ? "bubble-msg current-user" : "bubble-msg"}
    >
      {props.children}
      <p>{msg.text}</p>
      {msg.highlighted ? (
          <Favorite  className="float-right-btn" onClick={() => msg.toggleHighlight()} />
      ) : (
          <FavoriteBorder className="float-right-btn" onClick={() => msg.toggleHighlight()}  />
      )}
    </div>
  );
};
