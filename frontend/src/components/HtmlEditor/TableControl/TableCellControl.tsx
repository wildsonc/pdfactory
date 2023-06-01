import {
  Button,
  Center,
  ColorPicker,
  Group,
  Input,
  Modal,
  NumberInput,
  Select,
  Tabs,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { RichTextEditor, useRichTextEditorContext } from "@mantine/tiptap";
import { IconTableOptions } from "@tabler/icons-react";

const borderStyles = [
  {
    label: "Solid",
    value: "solid",
  },
  {
    label: "Dotted",
    value: "dotted",
  },
  {
    label: "Dashed",
    value: "dashed",
  },
  {
    label: "Double",
    value: "double",
  },
  {
    label: "Groove",
    value: "groove",
  },
  {
    label: "Ridge",
    value: "ridge",
  },
  {
    label: "Inset",
    value: "inset",
  },
  {
    label: "Outset",
    value: "outset",
  },
  {
    label: "None",
    value: "none",
  },
  {
    label: "Hidden",
    value: "hidden",
  },
];

export default function TableCellControl() {
  const { editor } = useRichTextEditorContext();
  const [opened, handlers] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      backgroundColor: "rgba(0, 0, 0, 1)",
      borderStyle: "",
      borderWidth: 1,
      borderColor: "black",
    },
  });

  if (!editor) return <></>;

  const apply = () => {
    editor
      .chain()
      .focus()
      .setCellAttribute("borderStyle", form.values.borderStyle)
      .setCellAttribute("borderWidth", form.values.borderWidth)
      .setCellAttribute("borderColor", form.values.borderColor)
      .run();
    handlers.close();
  };

  return (
    <>
      <RichTextEditor.Control
        aria-label="Cell properties"
        title="Cell properties"
        onClick={handlers.open}
      >
        <IconTableOptions stroke={1.5} size={16} />
      </RichTextEditor.Control>

      <Modal
        title={<strong>Cell properties</strong>}
        opened={opened}
        onClose={handlers.close}
        centered
        withCloseButton={false}
      >
        <Tabs orientation="vertical" defaultValue="border">
          <Tabs.List>
            <Tabs.Tab value="border">Border</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="border" pl="xs">
            <Select
              label="Border Style"
              withinPortal
              data={borderStyles}
              {...form.getInputProps("borderStyle")}
            />
            <NumberInput
              label="Border Width"
              min={0}
              {...form.getInputProps("borderWidth")}
            />
            <Input.Label>Border Color</Input.Label>
            <Center>
              <ColorPicker
                format="hex"
                mt={2}
                {...form.getInputProps("borderColor")}
              />
            </Center>
          </Tabs.Panel>

          <Tabs.Panel value="style" pl="xs">
            <Input.Label>Background</Input.Label>
            <ColorPicker
              format="rgba"
              {...form.getInputProps("backgroundColor")}
            />
          </Tabs.Panel>
        </Tabs>

        <Group position="center" mt="md">
          {/* <Button variant="default" onClick={() => form.reset()}>
            Reset
          </Button> */}
          <Button onClick={apply}>Apply</Button>
        </Group>
      </Modal>
    </>
  );
}
