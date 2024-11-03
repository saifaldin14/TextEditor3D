import { forwardRef } from "react";
import { Text } from "@react-three/drei";

interface EditableTextProps {
  content: string;
}

const EditableText = forwardRef<any, EditableTextProps>(({ content }, ref) => {
  return (
    <Text
      ref={ref}
      fontSize={1}
      color="hotpink"
      anchorX="center"
      anchorY="middle"
    >
      {content}
    </Text>
  );
});

export default EditableText;
