import { RichTextEditor, useRichTextEditorContext } from "@mantine/tiptap";
import { IconBorderRight } from "@tabler/icons-react";

export default function TableBorderRightControl() {
  const { editor } = useRichTextEditorContext();

  if (!editor) return <></>;

  return (
    <>
      <RichTextEditor.Control
        aria-label="Vertical border"
        title="Vertical border"
        onClick={() =>
          editor.chain().focus().setCellAttribute("borderRight", "1").run()
        }
      >
        <IconBorderRight size={16} />
      </RichTextEditor.Control>
    </>
  );
}
