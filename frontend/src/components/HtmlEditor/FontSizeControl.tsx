import { Select } from "@mantine/core";
import { useRichTextEditorContext } from "@mantine/tiptap";
import { IconTextSize } from "@tabler/icons-react";

let SIZES = [
  "6",
  "8",
  "10",
  "11",
  "12",
  "14",
  "16",
  "18",
  "20",
  "22",
  "24",
  "26",
  "28",
  "30",
  "32",
  "34",
  "36",
  "38",
  "40",
  "50",
  "60",
  "70",
];

export default function FontSizeControl() {
  const { editor } = useRichTextEditorContext();

  if (!editor) return <></>;

  const value = editor.getAttributes("textStyle")?.fontSize || "12";
  if (!SIZES.includes(value)) {
    SIZES.push(value);
    SIZES.sort();
  }
  return (
    <Select
      data={SIZES}
      value={value}
      size="xs"
      withinPortal
      onChange={(e) =>
        editor
          .chain()
          .focus()
          .setFontSize(e || "")
          .run()
      }
      icon={<IconTextSize size={16} />}
      styles={{ input: { fontSize: 14 } }}
      w={80}
    />
  );
}
