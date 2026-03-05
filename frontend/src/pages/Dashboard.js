import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import Analytics from "../Analytics";

function Dashboard() {

  const webcamRef = useRef(null);
  const [emotion, setEmotion] = useState("");
  const [loading, setLoading] = useState(false);

  const capture = async () => {

    const imageSrc = webcamRef.current.getScreenshot();

    const user_id = localStorage.getItem("user_id");

    setLoading(true);

    const res = await axios.post("http://localhost:5000/detect", {
      image: imageSrc,
      user_id
    });

    setEmotion(res.data.emotion);
    setLoading(false);
  };

  return (
    <div style={{ textAlign: "center" }}>

      <h1>Feelix Dashboard</h1>

      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={400}
      />

      <br /><br />

      <button onClick={capture}>
        Detect Emotion
      </button>

      <br /><br />

      {loading && <h3>Analyzing...</h3>}

      {emotion && !loading &&
        <h2>Detected Emotion: {emotion}</h2>
      }

      <Analytics />

    </div>
  );
}

export default Dashboard;