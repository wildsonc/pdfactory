import { Group, Paper, ScrollArea, PaperProps } from "@mantine/core";
import { Link, RichTextEditor } from "@mantine/tiptap";
import Color from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import Highlight from "@tiptap/extension-highlight";
import SubScript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { BubbleMenu, FloatingMenu, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useTemplateFormContext } from "../../context/form-context";
import FontFamilyControl from "../HtmlEditor/FontFamilyControl";
import FontSizeControl from "../HtmlEditor/FontSizeControl";
import { TextStyleExtended } from "../HtmlEditor/FontSizeExtension";
import SourceCodeControl from "../HtmlEditor/SourceCodeControl";

interface Props extends PaperProps {
  value: string;
}

function HtmlEditor({ value, ...props }: Props) {
  const form = useTemplateFormContext();
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyleExtended,
      Color,
      FontFamily.configure({
        types: ["textStyle"],
      }),
    ],
    onUpdate({ editor }) {
      form.setFieldValue(`settings.${value}`, editor.getHTML());
    },
    content: form.values.settings[value],
  });

  return (
    <Paper withBorder radius={6} {...props}>
      <ScrollArea.Autosize mah={250}>
        <RichTextEditor
          editor={editor}
          sx={{ borderWidth: 0 }}
          styles={{
            content: {
              "& hr": {
                margin: 0,
                padding: 0,
                borderWidth: 2,
              },
            },
          }}
        >
          <RichTextEditor.Toolbar>
            <Group spacing="xs">
              <RichTextEditor.ControlsGroup>
                <FontFamilyControl />
              </RichTextEditor.ControlsGroup>
              <RichTextEditor.ControlsGroup>
                <FontSizeControl />
              </RichTextEditor.ControlsGroup>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Bold />
                <RichTextEditor.Italic />
                <RichTextEditor.Underline />
                <RichTextEditor.ClearFormatting />
              </RichTextEditor.ControlsGroup>
              <RichTextEditor.ControlsGroup>
                <SourceCodeControl />
              </RichTextEditor.ControlsGroup>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.AlignLeft />
                <RichTextEditor.AlignCenter />
                <RichTextEditor.AlignJustify />
                <RichTextEditor.AlignRight />
              </RichTextEditor.ControlsGroup>
            </Group>
          </RichTextEditor.Toolbar>

          {editor && (
            <>
              <BubbleMenu editor={editor}>
                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Bold />
                  <RichTextEditor.Italic />
                  <RichTextEditor.Link />
                </RichTextEditor.ControlsGroup>
              </BubbleMenu>
            </>
          )}

          <RichTextEditor.Content />
        </RichTextEditor>
      </ScrollArea.Autosize>
    </Paper>
  );
}

export default HtmlEditor;
