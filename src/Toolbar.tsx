import { useLoader } from "@react-three/fiber";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import * as THREE from "three";
import { TextChunk } from "./types";

interface ToolbarProps {
  onStyleChange: (style: Partial<TextChunk["style"]>) => void;
}

const Toolbar3D = ({ onStyleChange }: ToolbarProps) => {
  const font = useLoader(FontLoader, "/fonts/helvetiker_regular.typeface.json");

  const createTextGeometry = (text: string, fontSize: number) => {
    return new TextGeometry(text, {
      font,
      size: fontSize,
      height: 0.1,
      curveSegments: 12,
      bevelEnabled: false,
    });
  };

  const handleClick = (style: Partial<TextChunk["style"]>) => () => {
    onStyleChange(style);
  };

  return (
    <group position={[0, 2, 0]}>
      {/* Bold Button */}
      <mesh onClick={handleClick({ bold: true })} position={[-1.5, 0, 0]}>
        <planeGeometry args={[1, 0.5]} />
        <meshStandardMaterial color="lightblue" />
        <mesh
          position={[-0.3, 0, 0.1]}
          geometry={createTextGeometry("Bold", 0.2)}
        >
          <meshStandardMaterial color="black" />
        </mesh>
      </mesh>

      {/* Italic Button */}
      <mesh onClick={handleClick({ italic: true })} position={[0, 0, 0]}>
        <planeGeometry args={[1, 0.5]} />
        <meshStandardMaterial color="lightgreen" />
        <mesh
          position={[-0.4, 0, 0.1]}
          geometry={createTextGeometry("Italic", 0.2)}
        >
          <meshStandardMaterial color="black" />
        </mesh>
      </mesh>

      {/* Red Color Button */}
      <mesh onClick={handleClick({ color: "red" })} position={[1.5, 0, 0]}>
        <planeGeometry args={[1, 0.5]} />
        <meshStandardMaterial color="pink" />
        <mesh
          position={[-0.35, 0, 0.1]}
          geometry={createTextGeometry("Red", 0.2)}
        >
          <meshStandardMaterial color="black" />
        </mesh>
      </mesh>
    </group>
  );
};

export default Toolbar3D;
