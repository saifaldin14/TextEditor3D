import { useLoader, useFrame } from "@react-three/fiber";
import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import * as THREE from "three";

interface EditableTextProps {
  initialText: string;
  position: [number, number, number];
  fontSize?: number;
  color?: string;
}

const EditableText = ({
  initialText,
  position,
  fontSize = 1,
  color = "black",
}: EditableTextProps) => {
  const font = useLoader(FontLoader, "/fonts/helvetiker_regular.typeface.json");
  const [text, setText] = useState(initialText);
  const [isEditing, setIsEditing] = useState(false);
  const [textGeometry, setTextGeometry] = useState<TextGeometry | null>(null);
  const textMeshRef = useRef<THREE.Mesh>(null);

  // Initialize the text geometry whenever the text or font changes
  useEffect(() => {
    if (font) {
      // Dispose of the old geometry to prevent memory leaks
      if (textGeometry) textGeometry.dispose();

      const geometry = new TextGeometry(text, {
        font: font,
        size: fontSize,
        height: 0.3,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.05,
        bevelOffset: 0,
        bevelSegments: 5,
      });
      setTextGeometry(geometry);
    } else {
      console.log("HEYYYYYAAAA");
    }
  }, [text, font, fontSize]);

  // Toggle edit mode on click
  const handleClick = () => {
    setIsEditing(true);
  };

  // Capture keystrokes to edit text directly in 3D
  useEffect(() => {
    if (isEditing) {
      const handleKeyDown = (event: any) => {
        event.stopPropagation();

        if (event.key === "Enter") {
          setIsEditing(false);
        } else if (event.key === "Backspace") {
          setText((prev) => prev.slice(0, -1));
        } else if (event.key.length === 1) {
          setText((prev) => prev + event.key);
        }
      };

      window.addEventListener("keydown", handleKeyDown as EventListener);
      return () =>
        window.removeEventListener("keydown", handleKeyDown as EventListener);
    }
  }, [isEditing]);

  return textGeometry ? (
    <mesh
      ref={textMeshRef}
      position={position}
      geometry={textGeometry}
      onClick={handleClick}
    >
      <meshStandardMaterial attach="material" color={color} />
    </mesh>
  ) : null;
};

export default EditableText;
