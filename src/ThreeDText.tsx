import { useLoader } from "@react-three/fiber";
import { useRef, useEffect, useState } from "react";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import * as THREE from "three";

interface ThreeDTextProps {
  text: string;
  position: [number, number, number];
  fontSize?: number;
  color?: string;
}

const ThreeDText = ({
  text,
  position,
  fontSize = 1,
  color = "black",
}: ThreeDTextProps) => {
  const font = useLoader(
    FontLoader,
    "./fonts/helvetiker_regular.typeface.json"
  );
  const [textGeometry, setTextGeometry] = useState<TextGeometry | null>(null);
  const textMeshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (font) {
      // Dispose of the old geometry to prevent memory leaks
      if (textGeometry) textGeometry.dispose();

      // Create new text geometry
      const geometry = new TextGeometry(text, {
        font: font,
        size: fontSize,
        height: 0.3, // Set a larger height for a more noticeable 3D effect
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.05,
        bevelOffset: 0,
        bevelSegments: 5,
      });
      setTextGeometry(geometry);
    }
  }, [text, font, fontSize]);

  return textGeometry ? (
    <mesh
      ref={textMeshRef}
      position={position}
      geometry={textGeometry}
      onClick={(e) => e.stopPropagation()}
    >
      <meshStandardMaterial attach="material" color={color} />
    </mesh>
  ) : null;
};

export default ThreeDText;
