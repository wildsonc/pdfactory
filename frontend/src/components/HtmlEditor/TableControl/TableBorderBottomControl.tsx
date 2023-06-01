import { RichTextEditor, useRichTextEditorContext } from "@mantine/tiptap";
import { IconBorderBottom } from "@tabler/icons-react";

export default function TableBorderBottomControl() {
  const { editor } = useRichTextEditorContext();

  if (!editor) return <></>;

  return (
    <>
      <RichTextEditor.Control
        aria-label="Vertical border"
        title="Vertical border"
        onClick={() =>
          editor.chain().focus().setCellAttribute("borderBottom", "1").run()
        }
      >
        <IconBorderBottom size={16} />
      </RichTextEditor.Control>
    </>
  );
}
