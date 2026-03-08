import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import Analytics from "../Analytics";

const emotionMusic = {
  happy: {
    song: "Happy",
    artist: "Pharrell Williams",
    url: "https://www.youtube.com/embed/ZbZSe6N_BXs"
  },
  sad: {
    song: "Let Her Go",
    artist: "Passenger",
    url: "https://www.youtube.com/embed/RBumgq5yVrA"
  },
  angry: {
    song: "Weightless",
    artist: "Ambient",
    url: "https://www.youtube.com/embed/UfcAVejslrU"
  },
  neutral: {
    song: "Perfect",
    artist: "Ed Sheeran",
    url: "https://www.youtube.com/embed/2Vv-BfVoq4g"
  },
  surprise: {
    song: "Counting Stars",
    artist: "OneRepublic",
    url: "https://www.youtube.com/embed/hT_nvWreIhg"
  },
  fear: {
    song: "Fix You",
    artist: "Coldplay",
    url: "https://www.youtube.com/embed/k4V3Mo61fJM"
  }
};

function Dashboard() {

  const webcamRef = useRef(null);

  const [emotion, setEmotion] = useState("");
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(false);

  const capture = async () => {

    const imageSrc = webcamRef.current.getScreenshot();

    const user_id = localStorage.getItem("user_id");

    setLoading(true);

    const res = await axios.post("http://localhost:5000/detect", {
      image: imageSrc,
      user_id
    });

    const detectedEmotion = res.data.emotion;

    setEmotion(detectedEmotion);

    if (emotionMusic[detectedEmotion]) {
      setSong(emotionMusic[detectedEmotion]);
    }

    setLoading(false);
  };

  return (
    <div style={{ textAlign: "center" }}>

      <h1>Feelix</h1>

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

      {song && (
        <div style={{ marginTop: "20px" }}>
          <h2>Recommended Song 🎵</h2>
          <p>{song.song} - {song.artist}</p>

          <iframe
            width="400"
            height="220"
            src={song.url}
            title="Music"
            allow="autoplay"
          ></iframe>
        </div>
      )}

      <Analytics />

    </div>
  );
}

export default Dashboard;