import { Canvas } from "@react-three/fiber";
import EditableText from "./EditableText";

export default function App() {
  return (
    <Canvas>
      {/* Add lights for visibility */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />

      {/* Render the editable 3D text */}
      <EditableText
        initialText="Click to Edit"
        position={[0, 1, 0]}
        fontSize={1}
        color="blue"
      />
    </Canvas>
  );
}
