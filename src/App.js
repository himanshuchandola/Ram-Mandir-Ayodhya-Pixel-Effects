import React, { useRef, useEffect } from "react";
import "./style.css";
import CanvasComponent from "./components/Canvas";
import backgroundMusic from "./audio/JaiShreeRam.mp3";

const App = () => {
  const audioRef = useRef(new Audio(backgroundMusic));

  useEffect(() => {
    audioRef.current
      .play()
      .catch((error) => console.log("Playback prevented by browser"));
  }, []);

  return (
    <>
      <CanvasComponent />
    </>
  );
};

export default App;
