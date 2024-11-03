import { useLoader } from "@react-three/fiber";
import { useState, useEffect, useRef } from "react";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import * as THREE from "three";

interface EditableTextProps {
  initialText: string;
  position: [number, number, number];
  fontSize?: number;
  color?: string;
  activeStyle?: Partial<{ bold: boolean; italic: boolean; color: string }>;
}

const EditableText = ({
  initialText,
  position,
  fontSize = 1,
  color = "lightblue",
  activeStyle = {},
}: EditableTextProps) => {
  const font = useLoader(FontLoader, "/fonts/helvetiker_regular.typeface.json");
  const [text, setText] = useState(initialText);
  const [isEditing, setIsEditing] = useState(false);
  const [textGeometry, setTextGeometry] = useState<TextGeometry | null>(null);
  const textMeshRef = useRef<THREE.Mesh>(null);
  const caretRef = useRef<THREE.Mesh>(null);
  const blinkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Apply activeStyle to geometry creation
  const applyStyles = (content: string) => {
    const size = activeStyle.bold ? fontSize * 1.1 : fontSize;
    const textColor = activeStyle.color || color;

    return new TextGeometry(content, {
      font,
      size: size,
      height: 0.3,
      curveSegments: 12,
      bevelEnabled: activeStyle.bold || false,
      bevelThickness: 0.03,
      bevelSize: 0.05,
      bevelOffset: 0,
      bevelSegments: 5,
    });
  };

  useEffect(() => {
    if (font) {
      if (textGeometry) textGeometry.dispose();
      const geometry = applyStyles(text);
      setTextGeometry(geometry);
    }
  }, [text, font, fontSize, activeStyle]);

  // Toggle the editing mode on click
  const handleClick = () => {
    setIsEditing(true);
  };

  // Handle keyboard events for typing and text modification
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

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isEditing]);

  // Blink caret effect
  useEffect(() => {
    if (isEditing && caretRef.current) {
      caretRef.current.visible = true;
      blinkIntervalRef.current = setInterval(() => {
        if (caretRef.current)
          caretRef.current.visible = !caretRef.current.visible;
      }, 500);
    } else if (blinkIntervalRef.current) {
      clearInterval(blinkIntervalRef.current);
      blinkIntervalRef.current = null;
      if (caretRef.current) caretRef.current.visible = false;
    }

    return () => {
      if (blinkIntervalRef.current) clearInterval(blinkIntervalRef.current);
    };
  }, [isEditing]);

  return (
    <>
      {/* Text mesh */}
      {textGeometry && (
        <mesh
          ref={textMeshRef}
          position={position}
          geometry={textGeometry}
          onClick={handleClick}
        >
          <meshStandardMaterial
            attach="material"
            color={activeStyle.color || color}
          />
        </mesh>
      )}

      {/* Caret mesh */}
      {isEditing && (
        <mesh
          ref={caretRef}
          position={[
            position[0] + text.length * fontSize * 0.6,
            position[1],
            position[2],
          ]}
        >
          <planeGeometry attach="geometry" args={[0.05, fontSize]} />
          <meshStandardMaterial attach="material" color="white" />
        </mesh>
      )}
    </>
  );
};

export default EditableText;
