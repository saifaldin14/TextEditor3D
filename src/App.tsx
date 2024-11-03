import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import EditableText from "./EditableText";

export default function App() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 60 }} // Set initial camera position
      style={{ height: "100vh", backgroundColor: "black" }}
    >
      {/* Add controls to allow user to move around the scene */}
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />

      {/* Add stars to create a space-like environment */}
      <Stars
        radius={100} // Radius of the star field
        depth={50} // Depth of the star field
        count={5000} // Number of stars
        factor={4} // Star size factor
        saturation={0} // Star color saturation
        fade // Fade distant stars
        speed={0.5} // Speed of rotation
      />

      {/* Minimal lighting to illuminate the text slightly */}
      <ambientLight intensity={0.1} />
      <directionalLight intensity={0.2} position={[10, 10, 5]} />

      {/* Render the editable 3D text */}
      <EditableText
        initialText="Click to Edit"
        position={[0, 1, 0]}
        fontSize={1}
        color="lightblue"
      />
    </Canvas>
  );
}
