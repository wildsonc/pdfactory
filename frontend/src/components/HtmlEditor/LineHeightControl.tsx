import { Select } from "@mantine/core";
import { useRichTextEditorContext } from "@mantine/tiptap";
import { IconTextSize } from "@tabler/icons";

export default function LineHeightControl() {
  const { editor } = useRichTextEditorContext();

  if (!editor) return <></>;

  let DATA = [
    { label: "6", value: "6" },
    { label: "8", value: "8" },
    { label: "10", value: "10" },
    { label: "11", value: "11" },
    { label: "12", value: "" },
    { label: "14", value: "14" },
    { label: "16", value: "16" },
    { label: "18", value: "18" },
    { label: "20", value: "20" },
    { label: "22", value: "22" },
    { label: "24", value: "24" },
    { label: "26", value: "26" },
    { label: "28", value: "28" },
    { label: "30", value: "30" },
    { label: "32", value: "32" },
    { label: "34", value: "34" },
    { label: "36", value: "36" },
    { label: "38", value: "38" },
    { label: "40", value: "40" },
    { label: "50", value: "50" },
    { label: "60", value: "60" },
    { label: "70", value: "70" },
  ];

  const value = editor.getAttributes("textStyle")?.fontSize || "";
  return (
    <Select
      data={DATA}
      value={value}
      size="xs"
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
