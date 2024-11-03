import { useLoader } from "@react-three/fiber";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import * as THREE from "three";
import { useState } from "react";

interface ToolbarProps {
  onStyleChange: (
    style: Partial<{ bold: boolean; italic: boolean; color?: string }>
  ) => void;
}

const Toolbar3D = ({ onStyleChange }: ToolbarProps) => {
  const font = useLoader(FontLoader, "/fonts/helvetiker_regular.typeface.json");

  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  // Function to create rounded rectangle shape
  const createRoundedRectShape = (
    width: number,
    height: number,
    radius: number
  ) => {
    const shape = new THREE.Shape();
    shape.moveTo(-width / 2 + radius, -height / 2);
    shape.lineTo(width / 2 - radius, -height / 2);
    shape.quadraticCurveTo(
      width / 2,
      -height / 2,
      width / 2,
      -height / 2 + radius
    );
    shape.lineTo(width / 2, height / 2 - radius);
    shape.quadraticCurveTo(
      width / 2,
      height / 2,
      width / 2 - radius,
      height / 2
    );
    shape.lineTo(-width / 2 + radius, height / 2);
    shape.quadraticCurveTo(
      -width / 2,
      height / 2,
      -width / 2,
      height / 2 - radius
    );
    shape.lineTo(-width / 2, -height / 2 + radius);
    shape.quadraticCurveTo(
      -width / 2,
      -height / 2,
      -width / 2 + radius,
      -height / 2
    );
    return shape;
  };

  const createTextGeometry = (text: string, fontSize: number) => {
    return new TextGeometry(text, {
      font,
      size: fontSize,
      height: 0.05,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.01,
    });
  };

  const handleClick =
    (
      style: Partial<{ bold: boolean; italic: boolean; color?: string }>,
      name: string
    ) =>
    () => {
      onStyleChange(style);
      setHoveredButton(null);
    };

  const handlePointerOver = (name: string) => () => {
    setHoveredButton(name);
  };

  const handlePointerOut = () => {
    setHoveredButton(null);
  };

  const buttonShape = createRoundedRectShape(1, 0.5, 0.1);

  return (
    <group position={[0, 3, 0]}>
      {/* Bold Button */}
      <mesh
        onClick={handleClick({ bold: true }, "bold")}
        position={[-1.5, 0, 0]}
        scale={hoveredButton === "bold" ? [1.1, 1.1, 1.1] : [1, 1, 1]}
        onPointerOver={handlePointerOver("bold")}
        onPointerOut={handlePointerOut}
      >
        <shapeGeometry args={[buttonShape]} />
        <meshStandardMaterial
          color={hoveredButton === "bold" ? "#87CEEB" : "lightblue"}
        />
        <mesh
          position={[0, 0, 0.1]}
          geometry={createTextGeometry("Bold", 0.15)}
        >
          <meshStandardMaterial color="black" />
        </mesh>
      </mesh>

      {/* Italic Button */}
      <mesh
        onClick={handleClick({ italic: true }, "italic")}
        position={[0, 0, 0]}
        scale={hoveredButton === "italic" ? [1.1, 1.1, 1.1] : [1, 1, 1]}
        onPointerOver={handlePointerOver("italic")}
        onPointerOut={handlePointerOut}
      >
        <shapeGeometry args={[buttonShape]} />
        <meshStandardMaterial
          color={hoveredButton === "italic" ? "#90EE90" : "lightgreen"}
        />
        <mesh
          position={[0, 0, 0.1]}
          geometry={createTextGeometry("Italic", 0.15)}
        >
          <meshStandardMaterial color="black" />
        </mesh>
      </mesh>

      {/* Red Color Button */}
      <mesh
        onClick={handleClick({ color: "red" }, "red")}
        position={[1.5, 0, 0]}
        scale={hoveredButton === "red" ? [1.1, 1.1, 1.1] : [1, 1, 1]}
        onPointerOver={handlePointerOver("red")}
        onPointerOut={handlePointerOut}
      >
        <shapeGeometry args={[buttonShape]} />
        <meshStandardMaterial
          color={hoveredButton === "red" ? "#FFB6C1" : "pink"}
        />
        <mesh position={[0, 0, 0.1]} geometry={createTextGeometry("Red", 0.15)}>
          <meshStandardMaterial color="black" />
        </mesh>
      </mesh>
    </group>
  );
};

export default Toolbar3D;
