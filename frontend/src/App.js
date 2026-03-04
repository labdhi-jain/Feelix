import React, { useRef } from "react";
import Webcam from "react-webcam";
import axios from "axios";

function App() {
  const webcamRef = useRef(null);

  const capture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();

    const res = await axios.post("http://127.0.0.1:5000/detect", {
      image: imageSrc,
    });

    alert("Detected Emotion: " + res.data.emotion);
  };

  return (
    <div>
      <h1>Feelix</h1>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
      />
      <button onClick={capture}>Detect Emotion</button>
    </div>
  );
}

export default App;