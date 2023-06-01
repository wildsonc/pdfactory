import { Button, Group, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { RichTextEditor, useRichTextEditorContext } from "@mantine/tiptap";
import { IconSourceCode } from "@tabler/icons-react";
import { html_beautify } from "js-beautify";
import { useEffect, useState } from "react";
import { useTemplateFormContext } from "../../context/form-context";
import CustomEditor from "../CustomEditor";

const SourceCodeControl = () => {
  const form = useTemplateFormContext();
  const { editor } = useRichTextEditorContext();
  const [opened, handlers] = useDisclosure(false);
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    if (editor) {
      setContent(html_beautify(editor.getHTML(), { wrap_line_length: 800 }));
    }
  }, [editor?.getHTML()]);

  const saveContent = () => {
    editor?.commands.setContent(content);
    form.setFieldValue("html", content);
    handlers.close();
  };

  return (
    <>
      <RichTextEditor.Control
        onClick={handlers.open}
        aria-label="Source code"
        title="Source code"
      >
        <IconSourceCode stroke={1.5} size={16} />
      </RichTextEditor.Control>
      <Modal
        title="Source code"
        size="80%"
        opened={opened}
        onClose={handlers.close}
      >
        <CustomEditor
          value={content}
          onChange={(e) => setContent(e)}
          language="jsx"
        />
        <Group position="center" mt={20}>
          <Button onClick={handlers.close} variant="default">
            Cancel
          </Button>
          <Button color="green" onClick={saveContent}>
            Save
          </Button>
        </Group>
      </Modal>
    </>
  );
};

export default SourceCodeControl;
