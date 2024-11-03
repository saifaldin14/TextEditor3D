import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import EditableRichText from "./EditableRichText";
import { useState } from "react";
import Toolbar3D from "./Toolbar";
import { RichText, TextChunk } from "./types";

export default function App() {
  const [richText, setRichText] = useState<RichText>([
    { content: "Hello, ", style: {} },
    { content: "world!", style: { bold: true, color: "yellow" } },
  ]);

  const handleStyleChange = (style: Partial<TextChunk["style"]>) => {
    // Modify the style of the last text chunk for simplicity
    setRichText((prev) => {
      const updatedChunks = [...prev];
      const lastChunk = updatedChunks[updatedChunks.length - 1];
      updatedChunks[updatedChunks.length - 1] = {
        ...lastChunk,
        style: { ...lastChunk.style, ...style },
      };
      return updatedChunks;
    });
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

      {/* Render editable rich text */}
      <EditableRichText initialText={richText} position={[0, 1, 0]} />

      {/* Render the 3D toolbar for formatting */}
      <Toolbar3D onStyleChange={handleStyleChange} />
    </Canvas>
  );
}
