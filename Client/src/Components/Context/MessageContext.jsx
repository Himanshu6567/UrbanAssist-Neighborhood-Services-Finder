import React, { createContext, useContext, useState } from "react";

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [messageData, setMessageData] = useState({ type: "", message: "" });
  const [showMgs, setShowMgs] = useState(false);

  const showMessage = (type, message) => {
    console.log("showMessage called", type, message);
    setMessageData({ type, message });
    setShowMgs(true);
  };

  return (
    <MessageContext.Provider
      value={{ messageData, showMgs, setShowMgs, showMessage }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => {
  return useContext(MessageContext);
};
