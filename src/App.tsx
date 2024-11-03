import { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import EditableText from "./EditableText";
import { OrbitControls, TransformControls } from "@react-three/drei";

function App() {
  const [text, setText] = useState("Hello, 3D World!");
  const textRef = useRef();

  return (
    <>
      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <EditableText ref={textRef} content={text} />
        <OrbitControls />
      </Canvas>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          padding: "10px",
          fontSize: "16px",
        }}
      />
    </>
  );
}

export default App;
