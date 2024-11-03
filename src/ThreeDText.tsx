import { useLoader } from "@react-three/fiber";
import { useRef, useEffect, useState } from "react";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

const ThreeDText = ({ text, position, fontSize, color }: any) => {
  const font = useLoader(
    FontLoader,
    "./fonts/helvetiker_regular.typeface.json"
  );
  const [textGeometry, setTextGeometry] = useState<TextGeometry>();
  const textMeshRef = useRef<any>();

  useEffect(() => {
    if (font) {
      const geometry = new TextGeometry(text, {
        font: font,
        size: fontSize || 1,
        height: 0.2,
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
      <meshStandardMaterial attach="material" color={color || "black"} />
    </mesh>
  ) : null;
};

export default ThreeDText;
