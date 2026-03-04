import Analytics from "./Analytics";
import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";

function App() {
  const webcamRef = useRef(null);
  const [emotion, setEmotion] = useState("");
  const [loading, setLoading] = useState(false);

  const capture = async () => {
    try {
      setLoading(true);
      const imageSrc = webcamRef.current.getScreenshot();

      const res = await axios.post("http://localhost:5000/detect", {
        image: imageSrc,
      });

      setEmotion(res.data.emotion);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setEmotion("Error detecting emotion");
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Feelix</h1>

      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={400}
      />

      <br /><br />

      <button onClick={capture} style={{ padding: "10px 20px" }}>
        Detect Emotion
      </button>

      <br /><br />

      {loading && <h3>Analyzing emotion...</h3>}

      {emotion && !loading && (
        <h2>
          Detected Emotion: <span style={{ color: "red" }}>{emotion}</span>
        </h2>
      )}
      <Analytics />
    </div>
  );
}

export default App;