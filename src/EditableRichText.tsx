import { useLoader } from "@react-three/fiber";
import { useState, useEffect, useRef } from "react";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import * as THREE from "three";
import { RichText } from "./types";

interface EditableRichTextProps {
  initialText: RichText;
  position: [number, number, number];
}

const EditableRichText = ({ initialText, position }: EditableRichTextProps) => {
  const font = useLoader(FontLoader, "/fonts/helvetiker_regular.typeface.json");
  const [richText, setRichText] = useState<RichText>(initialText);
  const textRefs = useRef<THREE.Mesh[]>([]);

  // Render each text chunk with its respective styles
  return (
    <>
      {richText.map((chunk, index) => {
        const fontSize = chunk.style.fontSize || 1;
        const color = chunk.style.color || "white";

        // Create text geometry with style
        const geometry = new TextGeometry(chunk.content, {
          font: font,
          size: fontSize,
          height: 0.2,
          curveSegments: 12,
          bevelEnabled: false,
        });

        // Apply styles like bold and italic
        const material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(color),
        });

        return (
          <mesh
            key={index}
            ref={(el) => (textRefs.current[index] = el!)}
            geometry={geometry}
            material={material}
            position={[
              position[0] + index * fontSize * 0.6,
              position[1],
              position[2],
            ]}
          />
        );
      })}
    </>
  );
};

export default EditableRichText;
