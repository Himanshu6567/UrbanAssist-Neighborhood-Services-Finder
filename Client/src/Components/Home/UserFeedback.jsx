import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";

export default function FeedbackSection() {
  const [feedbackData, setFeedbackData] = useState([]);

  useEffect(() => {
    handleGetFeedback(); // when page initially load, the useeffect call the function handleGetFeedback
  }, []);

  // fetch the feedback data
  const handleGetFeedback = async () => {
    try {
      const response = await axios.get("http://localhost:8000/Feedbacks");
      if (response.status === 201) {
        setFeedbackData(response.data);
        console.log("feedback ", response.data);
      }
    } catch (error) {
      console.error("enable to fatch initial services", error);
    }
  };

  return (
    <div className="p-8 text-gray-900 bg-gray-200">
      <h2 className="mb-6 text-2xl font-bold text-center">User Feedback</h2>
      <div className="grid max-w-6xl grid-cols-1 gap-6 mx-auto md:grid-cols-2 lg:grid-cols-3">
        {feedbackData.map((feedback, index) => (
          <div
            key={index}
            className="p-4 text-center bg-gray-100 shadow-lg rounded-xl"
          >
            <img
              src={feedback.photo}
              alt={feedback.name}
              className="w-16 h-16 mx-auto mb-4 rounded-full"
            />
            <h3 className="mb-2 text-lg font-semibold">{feedback.name}</h3>
            <div className="flex justify-center mb-2">
              {Array.from({ length: feedback.rating }, (_, i) => (
                <FaStar key={i} className="text-yellow-400" />
              ))}
            </div>
            <p className="font-bold text-gray-700">{feedback.feedback}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
