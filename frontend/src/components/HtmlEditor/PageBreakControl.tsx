import { RichTextEditor, useRichTextEditorContext } from "@mantine/tiptap";
import { IconPageBreak } from "@tabler/icons";

const PageBreakControl = () => {
  const { editor } = useRichTextEditorContext();
  return (
    <RichTextEditor.Control
      onClick={() => editor?.commands.insertContent("<hr>")}
      aria-label="Insert star emoji"
      title="Insert star emoji"
    >
      <IconPageBreak stroke={1.5} size={16} />
    </RichTextEditor.Control>
  );
};

export default PageBreakControl;
