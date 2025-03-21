import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useMessage } from "./MessageContext";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null); //  state to store the  socket
  const { showMessage } = useMessage();

  useEffect(() => {
    const socketInstance = io("http://localhost:8000", {
      // connect the socket with backend
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
    });
    setSocket(socketInstance);

    //
    const UserId = localStorage.getItem("Userid");

    if (UserId) {
      socketInstance.on("reqAccept", (data) => {
        //  if the user request accepted by service provider so notify him
        const { id, task } = data;
        if (UserId === task.userId) {
          showMessage(
            "success",
            "Your request has been accepted by Service Provider"
          );
        }
      });

      socketInstance.on("reqReject", (data) => {
        //  if the user request rejected by service provider so notify him
        const { id, task } = data;
        if (UserId === task.userId) {
          showMessage(
            "error",
            "Your request has been rejected by Service Provider"
          );
        }
      });
    }
    //
    return () => {
      socketInstance.off("reqAccept");
      socketInstance.off("reqReject");
      socketInstance.disconnect();
    };
  }, [showMessage]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
