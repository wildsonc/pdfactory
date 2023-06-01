import { Group, Paper, ScrollArea } from "@mantine/core";
import { Link, RichTextEditor } from "@mantine/tiptap";
import Color from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import Highlight from "@tiptap/extension-highlight";
import SubScript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Table from "@tiptap/extension-table";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { BubbleMenu, FloatingMenu, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useTemplateFormContext } from "../../context/form-context";
import FontFamilyControl from "./FontFamilyControl";
import FontSizeControl from "./FontSizeControl";
import { TextStyleExtended } from "./FontSizeExtension";
import PageBreakControl from "./PageBreakControl";
import SourceCodeControl from "./SourceCodeControl";
import TableBorderBottomControl from "./TableControl/TableBorderBottomControl";
import TableVerticalBorderControl from "./TableControl/TableBorderRightControl";
import TableCellControl from "./TableControl/TableCellControl";
import { TableCellExtended } from "./TableControl/TableCellExtension";
import TableControl from "./TableControl/TableControl";

const COLORS = [
  "#000",
  "#fff",
  "#fa5252",
  "#e64980",
  "#be4bdb",
  "#7950f2",
  "#4c6ef5",
  "#228be6",
  "#15aabf",
  "#12b886",
  "#40c057",
  "#82c91e",
  "#fab005",
  "#fd7e14",
];

function HtmlEditor({ height }: { height: number }) {
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
      Table,
      TableRow,
      TableHeader,
      TableCellExtended,
    ],
    onUpdate({ editor }) {
      form.setFieldValue("html", editor.getHTML());
    },
    content: form.values.html,
  });

  return (
    <Paper withBorder radius={6}>
      <ScrollArea.Autosize mah={height}>
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
              "*": {
                fontFamily: "Calibri",
              },
            },
          }}
        >
          <RichTextEditor.Toolbar sticky>
            <Group spacing="xs" mx={-5}>
              <RichTextEditor.ControlsGroup>
                <FontSizeControl />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <FontFamilyControl />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Bold />
                <RichTextEditor.Italic />
                <RichTextEditor.Underline />
                <RichTextEditor.Strikethrough />
                <RichTextEditor.ClearFormatting />
                <RichTextEditor.Highlight />
                <RichTextEditor.Code />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.H1 />
                <RichTextEditor.H2 />
                <RichTextEditor.H3 />
                <RichTextEditor.H4 />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Link />
                <RichTextEditor.Unlink />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Blockquote />
                <RichTextEditor.BulletList />
                <RichTextEditor.OrderedList />
                <RichTextEditor.Subscript />
                <RichTextEditor.Superscript />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.AlignLeft />
                <RichTextEditor.AlignCenter />
                <RichTextEditor.AlignJustify />
                <RichTextEditor.AlignRight />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.ColorPicker colors={COLORS} />
                <SourceCodeControl />
                <PageBreakControl />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <TableControl />
                <TableCellControl />
                <TableVerticalBorderControl />
                <TableBorderBottomControl />
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
                  <RichTextEditor.ColorPicker colors={COLORS} />
                  {editor.isActive("table") && <TableCellControl />}
                </RichTextEditor.ControlsGroup>
              </BubbleMenu>
              <FloatingMenu editor={editor}>
                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.H1 />
                  <RichTextEditor.H2 />
                  <RichTextEditor.BulletList />
                </RichTextEditor.ControlsGroup>
              </FloatingMenu>
            </>
          )}

          <RichTextEditor.Content />
        </RichTextEditor>
      </ScrollArea.Autosize>
    </Paper>
  );
}

export default HtmlEditor;
