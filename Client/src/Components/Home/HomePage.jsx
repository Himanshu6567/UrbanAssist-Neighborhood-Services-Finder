import React, { useEffect } from "react";
import HeroSection from "./Hero Section";
import OurServices from "./OurServices";
import GetInTouch from "./GetInTouch";
import FeedbackSection from "./UserFeedback";
import { useMessage } from "../Context/MessageContext";
import { useSocket } from "../Context/SocketContext";

export default function HomePage() {
  // const socket = useSocket();
  // const { showMessage } = useMessage();

  // useEffect(() => {
  //   const UserId = localStorage.getItem("Userid");
  //   if (UserId) {
  //     if (socket) {
  //       socket.on("reqAccept", (data) => {
  //         const { id, task } = data;

  //         console.log("live form user data", data);
  //         if (UserId === task.userId) {
  //           showMessage(
  //             "success",
  //             "your request has been accepted by Service provider"
  //           );
  //         }
  //       });

  //       socket.on("reqReject", (data) => {
  //         const { id, task } = data;
  //         console.log("reject id ", id);
  //         if (UserId === task.userId) {
  //           showMessage(
  //             "Error",
  //             "your request has been rejected by Service provider"
  //           );
  //         }
  //       });
  //     }

  //     if (!socket) {
  //       console.log("socket not found");
  //     }

  //     return () => {

  //       if (socket) {
  //         socket.off("reqAccept");
  //         socket.off("reqReject");
  //       }
  //     };
  //   }
  // }, [socket]);

  return (
    <div>
      <HeroSection />
      <OurServices />
      <FeedbackSection />
      <GetInTouch />
    </div>
  );
}
