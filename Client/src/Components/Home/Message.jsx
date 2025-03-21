import React, { useEffect, useState } from "react";
import { HiMiniXMark } from "react-icons/hi2";
import { useMessage } from "../Context/MessageContext";

export default function Message() {
  const [processValue, setProcessValue] = useState(100);
  const [color, setColor] = useState("red");

  const { messageData, showMgs, setShowMgs } = useMessage();

  useEffect(() => {
    if (showMgs) {
      if (messageData.type === "success") {
        //If the alert is success it will be shown in green color else it will be shown in red color
        setColor("green");
      } else {
        setColor("red");
      }

      setProcessValue(100);
      const hideTimeout = setTimeout(() => {  // hide the notification automatically after 3 sec
        setShowMgs(false);
      }, 3000);

      const interval = setInterval(() => { // process box fill
        setProcessValue((prev) => Math.max(prev - 100 / 30, 0));
      }, 100);

      return () => {
        clearTimeout(hideTimeout);
        clearInterval(interval);
      };
    }
  }, [showMgs]);

  //chose color
  const colorClasses = {
    red: "bg-red-800 border-red-600 [&::-webkit-progress-value]:bg-red-400",
    green:
      "bg-green-800 border-green-600 [&::-webkit-progress-value]:bg-green-400",
  };

  return (
    showMgs && (
      <div className="fixed flex items-center justify-center w-full top-20">
        <div className="fixed flex flex-col items-center justify-center w-full">
          {/* Message Box */}
          <div
            className={`relative flex items-center justify-between w-1/2 h-12 px-6 text-white ${colorClasses[color]} bg-opacity-100 border-2   rounded`}
          >
            <div>
              <span className="text-xl font-bold">{messageData.type}</span>,
              <span> {messageData.message}</span>
            </div>
            <button
              onClick={() => setShowMgs(false)}
              className="text-2xl font-bold"
            >
              <HiMiniXMark />
            </button>
          </div>

          {/* Progress Bar  */}
          <div className="w-1/2 mt-[-13px]">
            <progress
              id="progress"
              value={processValue}
              className={`w-full h-1 ${colorClasses[color]}`}
              max="100"
            ></progress>
          </div>
        </div>
      </div>
    )
  );
}
