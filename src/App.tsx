import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import ThreeDText from "./ThreeDText";

export default function App() {
  const [text, setText] = useState("Type here");

  const handleInputChange = (event: any) => {
    setText(event.target.value);
  };

  return (
    <>
      <Canvas>
        <ambientLight intensity={0.5} />
        <ThreeDText
          text={text}
          position={[0, 1, 0]}
          fontSize={1}
          color="blue"
        />
      </Canvas>
      <input
        type="text"
        value={text}
        onChange={handleInputChange}
        placeholder="Type in 3D space"
        style={{
          position: "absolute",
          bottom: "20px",
          width: "100%",
          textAlign: "center",
          padding: "10px",
          fontSize: "1.5em",
        }}
      />
    </>
  );
}
