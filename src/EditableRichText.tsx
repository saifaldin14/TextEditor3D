import { useLoader } from "@react-three/fiber";
import { useState, useEffect, useRef } from "react";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import * as THREE from "three";
import { RichText } from "./types"; // Import your RichText type here

interface EditableRichTextProps {
  initialText: RichText;
  position: [number, number, number];
}

const EditableRichText = ({ initialText, position }: EditableRichTextProps) => {
  const font = useLoader(FontLoader, "/fonts/helvetiker_regular.typeface.json");
  const [richText, setRichText] = useState<RichText>(initialText);
  const [editingIndex, setEditingIndex] = useState<number | null>(
    initialText.length - 1
  ); // Start at the last chunk
  const [caretPositionInChunk, setCaretPositionInChunk] = useState<number>(0);
  const [highlightRange, setHighlightRange] = useState<{
    start: number;
    end: number;
  } | null>(null);
  const textRefs = useRef<THREE.Mesh[]>([]);
  const caretRef = useRef<THREE.Mesh>(null);
  const blinkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Helper function to calculate the position of each chunk to prevent overlap
  const calculateChunkPositions = () => {
    const positions: any[] = [];
    let xOffset = 0;

    richText.forEach((chunk, index) => {
      const fontSize = chunk.style.fontSize || 1;
      const geometry = new TextGeometry(chunk.content, {
        font,
        size: fontSize,
        height: 0.2,
        curveSegments: 12,
        bevelEnabled: false,
      });
      geometry.computeBoundingBox();

      const chunkWidth = geometry.boundingBox?.max.x || 0;
      positions.push(xOffset);
      xOffset += chunkWidth + 0.1; // Add a small space between chunks

      // Dispose of the temporary geometry
      geometry.dispose();
    });
    return positions;
  };

  // Function to calculate caret offset within a chunk
  const calculateCaretOffset = (chunkIndex: number, caretPosition: number) => {
    const chunk = richText[chunkIndex];
    const fontSize = chunk.style.fontSize || 1;
    let offset = 0;

    for (let i = 0; i < caretPosition; i++) {
      const charGeometry = new TextGeometry(chunk.content[i], {
        font,
        size: fontSize,
        height: 0.2,
      });
      charGeometry.computeBoundingBox();
      const charWidth = charGeometry.boundingBox?.max.x || 0;
      offset += charWidth;
      charGeometry.dispose(); // Dispose of geometry to avoid memory leaks
    }

    return offset;
  };

  // Handle clicking on a chunk to start editing at a specific position
  const handleClick = (index: number, event: any) => {
    setEditingIndex(index);
    setHighlightRange(null); // Reset any existing highlight

    // Calculate the caret position within the chunk based on click
    const chunk = richText[index];
    const fontSize = chunk.style.fontSize || 1;
    const clickX = event.intersections[0].point.x - position[0];
    let cumulativeWidth = 0;
    let caretPosition = 0;

    for (let i = 0; i < chunk.content.length; i++) {
      const characterGeometry = new TextGeometry(chunk.content[i], {
        font,
        size: fontSize,
        height: 0.2,
      });
      characterGeometry.computeBoundingBox();
      const charWidth = characterGeometry.boundingBox?.max.x || 0;
      cumulativeWidth += charWidth;

      if (cumulativeWidth > clickX) {
        caretPosition = i;
        break;
      }

      characterGeometry.dispose();
    }

    setCaretPositionInChunk(caretPosition);
  };

  // Handle mouse drag for text selection
  const handleMouseDrag = (index: number, event: any) => {
    const chunk = richText[index];
    const fontSize = chunk.style.fontSize || 1;
    const dragX = event.intersections[0].point.x - position[0];
    let cumulativeWidth = 0;
    let endPosition = 0;

    for (let i = 0; i < chunk.content.length; i++) {
      const characterGeometry = new TextGeometry(chunk.content[i], {
        font,
        size: fontSize,
        height: 0.2,
      });
      characterGeometry.computeBoundingBox();
      const charWidth = characterGeometry.boundingBox?.max.x || 0;
      cumulativeWidth += charWidth;

      if (cumulativeWidth > dragX) {
        endPosition = i;
        break;
      }

      characterGeometry.dispose();
    }

    setHighlightRange({ start: caretPositionInChunk, end: endPosition });
  };

  // Handle backspace and seamless movement across chunks
  const handleKeyDown = (event: KeyboardEvent) => {
    if (editingIndex === null) return;

    setRichText((prevText) => {
      const updatedText = [...prevText];
      const chunk = updatedText[editingIndex];

      if (event.key === "Backspace") {
        if (caretPositionInChunk > 0) {
          chunk.content =
            chunk.content.slice(0, caretPositionInChunk - 1) +
            chunk.content.slice(caretPositionInChunk);
          setCaretPositionInChunk((prev) => prev - 1);
        } else if (editingIndex > 0) {
          updatedText.splice(editingIndex, 1);
          setEditingIndex(editingIndex - 1);
          setCaretPositionInChunk(updatedText[editingIndex - 1].content.length);
        }
      } else if (event.key.length === 1) {
        chunk.content =
          chunk.content.slice(0, caretPositionInChunk) +
          event.key +
          chunk.content.slice(caretPositionInChunk);
        setCaretPositionInChunk((prev) => prev + 1);
      }

      return updatedText;
    });
  };

  useEffect(() => {
    if (editingIndex !== null) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [editingIndex, caretPositionInChunk]);

  // Blink caret effect
  useEffect(() => {
    if (editingIndex !== null && caretRef.current) {
      caretRef.current.visible = true;
      blinkIntervalRef.current = setInterval(() => {
        if (caretRef.current) {
          caretRef.current.visible = !caretRef.current.visible;
        }
      }, 500);
    } else if (blinkIntervalRef.current) {
      clearInterval(blinkIntervalRef.current);
      blinkIntervalRef.current = null;
      if (caretRef.current) caretRef.current.visible = false;
    }

    return () => {
      if (blinkIntervalRef.current) clearInterval(blinkIntervalRef.current);
    };
  }, [editingIndex]);

  const chunkPositions = calculateChunkPositions();

  return (
    <>
      {richText.map((chunk, index) => {
        const fontSize = chunk.style.fontSize || 1;
        const color = chunk.style.color || "white";

        // Create geometry for each chunk
        const geometry = new TextGeometry(chunk.content, {
          font: font,
          size: fontSize,
          height: 0.2,
          curveSegments: 12,
          bevelEnabled: false,
        });

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
              position[0] + chunkPositions[index],
              position[1],
              position[2],
            ]}
            onPointerDown={(e) => handleClick(index, e)}
            onPointerMove={(e) => handleMouseDrag(index, e)}
            dispose={geometry.dispose}
          />
        );
      })}

      {/* Caret mesh for blinking cursor */}
      {editingIndex !== null && (
        <mesh
          ref={caretRef}
          position={[
            position[0] +
              chunkPositions[editingIndex] +
              calculateCaretOffset(editingIndex, caretPositionInChunk),
            position[1],
            position[2],
          ]}
        >
          <planeGeometry args={[0.05, 1]} />
          <meshStandardMaterial color="white" />
        </mesh>
      )}

      {/* Highlighted background */}
      {highlightRange && editingIndex !== null && (
        <mesh
          position={[
            position[0] +
              chunkPositions[editingIndex] +
              calculateCaretOffset(editingIndex, highlightRange.start),
            position[1],
            position[2] - 0.01,
          ]}
        >
          <planeGeometry
            args={[
              calculateCaretOffset(editingIndex, highlightRange.end) -
                calculateCaretOffset(editingIndex, highlightRange.start),
              1,
            ]}
          />
          <meshStandardMaterial color="lightblue" opacity={0.5} transparent />
        </mesh>
      )}
    </>
  );
};

export default EditableRichText;
