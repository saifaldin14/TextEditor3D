import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { useState } from "react";
import Toolbar3D from "./Toolbar";
import EditableText from "./EditableText";

export default function App() {
  const [activeStyle, setActiveStyle] = useState({});

  // Handle style changes from the toolbar
  const handleStyleChange = (style: any) => {
    setActiveStyle((prev) => ({ ...prev, ...style }));
  };

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 60 }}
      style={{ height: "100vh", backgroundColor: "black" }}
    >
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />
      <ambientLight intensity={0.1} />
      <directionalLight intensity={0.2} position={[10, 10, 5]} />

      {/* Render editable text with active style */}
      <EditableText
        initialText="Hello World"
        position={[0, 1, 0]}
        activeStyle={activeStyle}
      />

      {/* Render the 3D toolbar */}
      <Toolbar3D onStyleChange={handleStyleChange} />
    </Canvas>
  );
}
