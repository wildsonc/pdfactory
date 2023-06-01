import { Menu } from "@mantine/core";
import { RichTextEditor, useRichTextEditorContext } from "@mantine/tiptap";
import {
  IconBorderAll,
  IconChevronDown,
  IconChevronRight,
  IconColumnInsertLeft,
  IconColumnInsertRight,
  IconRowInsertBottom,
  IconRowInsertTop,
  IconTrash,
} from "@tabler/icons-react";

const TableRowControl = () => {
  const { editor } = useRichTextEditorContext();

  return (
    <>
      <Menu trigger="hover" position="right-start" withinPortal>
        <Menu.Target>
          <Menu.Item rightSection={<IconChevronRight size={16} />}>
            Row
          </Menu.Item>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            onClick={() => editor.chain().focus().addRowBefore().run()}
            icon={<IconRowInsertTop size={16} />}
          >
            Add Row Before
          </Menu.Item>
          <Menu.Item
            onClick={() => editor.chain().focus().addRowAfter().run()}
            icon={<IconRowInsertBottom size={16} />}
          >
            Add Row After
          </Menu.Item>
          <Menu.Item
            onClick={() => editor.chain().focus().deleteRow().run()}
            icon={<IconTrash size={16} />}
            color="red"
          >
            Delete Row
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
};

const TableHeaderControl = () => {
  const { editor } = useRichTextEditorContext();

  return (
    <>
      <Menu trigger="hover" position="right-start" withinPortal>
        <Menu.Target>
          <Menu.Item rightSection={<IconChevronRight size={16} />}>
            Header
          </Menu.Item>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            onClick={() => editor.chain().focus().toggleHeaderColumn().run()}
          >
            Toggle Header Column
          </Menu.Item>
          <Menu.Item
            onClick={() => editor.chain().focus().toggleHeaderRow().run()}
          >
            Toggle Header Row
          </Menu.Item>
          <Menu.Item
            onClick={() => editor.chain().focus().toggleHeaderCell().run()}
          >
            Toggle Header Cell
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
};

const TableCellControl = () => {
  const { editor } = useRichTextEditorContext();

  return (
    <>
      <Menu trigger="hover" position="right-start" withinPortal>
        <Menu.Target>
          <Menu.Item rightSection={<IconChevronRight size={16} />}>
            Cell
          </Menu.Item>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item onClick={() => editor.chain().focus().mergeCells().run()}>
            Merge Cell
          </Menu.Item>
          <Menu.Item onClick={() => editor.chain().focus().splitCell().run()}>
            Split Cell
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
};

const TableColumnControl = () => {
  const { editor } = useRichTextEditorContext();

  return (
    <>
      <Menu trigger="hover" position="right-start" withinPortal>
        <Menu.Target>
          <Menu.Item rightSection={<IconChevronRight size={16} />}>
            Column
          </Menu.Item>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            onClick={() => editor.chain().focus().addColumnBefore().run()}
            icon={<IconColumnInsertLeft size={16} />}
          >
            Add Column Before
          </Menu.Item>
          <Menu.Item
            onClick={() => editor.chain().focus().addColumnAfter().run()}
            icon={<IconColumnInsertRight size={16} />}
          >
            Add Column After
          </Menu.Item>
          <Menu.Item
            onClick={() => editor.chain().focus().deleteColumn().run()}
            icon={<IconTrash size={16} />}
            color="red"
          >
            Delete Column
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
};

const TableControl = () => {
  const { editor } = useRichTextEditorContext();

  return (
    <>
      <Menu withinPortal>
        <Menu.Target>
          <RichTextEditor.Control
            aria-label="Table"
            title="Table"
            px={5}
            active={editor?.isActive("table")}
          >
            <IconBorderAll stroke={1.5} size={16} />
            <IconChevronDown stroke={1.5} size={16} />
          </RichTextEditor.Control>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            onClick={() =>
              editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run()
            }
          >
            Insert Table
          </Menu.Item>
          <Menu.Item
            onClick={() => editor.chain().focus().deleteTable().run()}
            color="red"
          >
            Delete Table
          </Menu.Item>
          <Menu.Divider />
          <TableRowControl />
          <TableColumnControl />
          <TableCellControl />
          <TableHeaderControl />
        </Menu.Dropdown>
      </Menu>
    </>
  );
};

export default TableControl;
