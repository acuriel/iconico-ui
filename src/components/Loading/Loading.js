import React, { useState } from "react";
import BounceLoader from "react-spinners/BounceLoader";

export default function Loading() {
  return (
    <div className="spinner">
      <BounceLoader
        size={100}
        // color={"#123abc"}
        loading={true}
      />
    </div>
  );
}
