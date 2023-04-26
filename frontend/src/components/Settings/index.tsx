import {
  Collapse,
  ColorInput,
  createStyles,
  Flex,
  Group,
  Input,
  Paper,
  ScrollArea,
  Select,
  Switch,
  TextInput,
} from "@mantine/core";
import { useTemplateFormContext } from "../../context/form-context";
import MiniEditor from "../MiniEditor";

const SIZES = ["Letter", "Legal", "Tabloid", "Ledger", "A0", "A1", "A2", "A3", "A4", "A5", "A6"];

const useStyles = createStyles({
  input: { textAlign: "center", width: "100%" },
  description: { textAlign: "center", width: "100%" },
});

const Settings = ({ height }: { height: number }) => {
  const form = useTemplateFormContext();
  const { classes } = useStyles();

  return (
    <Paper p={10} withBorder>
      <ScrollArea.Autosize mah={height - 20} offsetScrollbars>
        <Group position="apart">
          <Flex direction="column" align="center">
            <Input.Label className={classes.input}>Page</Input.Label>
            <Group>
              <Select
                description="Size"
                data={SIZES}
                {...form.getInputProps("settings.page_size")}
                className={classes.input}
                w={100}
              />
              <Select
                description="Orientation"
                className={classes.input}
                data={[
                  { label: "Portrait", value: "portrait" },
                  { label: "Landscape", value: "landscape" },
                ]}
                {...form.getInputProps("settings.orientation")}
                w={120}
              />
            </Group>
          </Flex>
          <Flex direction="column" align="center">
            <Input.Label className={classes.input}>Margin</Input.Label>
            <Group noWrap>
              <TextInput
                description="Top"
                {...form.getInputProps("settings.margin_top")}
                className={classes.input}
                w={60}
              />
              <TextInput
                description="Right"
                {...form.getInputProps("settings.margin_right")}
                className={classes.input}
                w={60}
              />
              <TextInput
                description="Bottom"
                {...form.getInputProps("settings.margin_bottom")}
                className={classes.input}
                w={60}
              />
              <TextInput
                description="Left"
                {...form.getInputProps("settings.margin_left")}
                className={classes.input}
                w={60}
              />
              <Select
                description="Unit"
                data={["px", "in", "cm", "%"]}
                w={70}
                className={classes.input}
                {...form.getInputProps("settings.margin_unit")}
                withinPortal
              />
            </Group>
          </Flex>
        </Group>

        <Group mt={20}>
          <Switch
            label="Highlight variables"
            description="Debug only"
            {...form.getInputProps("settings.highlight_variables", { type: "checkbox" })}
          />
          <Switch label="Background" {...form.getInputProps("settings.background", { type: "checkbox" })} />
          {form.values.settings.background && (
            <ColorInput {...form.getInputProps("settings.background_color")} w={150} />
          )}
        </Group>
        <Switch label="Header" {...form.getInputProps("settings.header", { type: "checkbox" })} my={10} />
        <Collapse in={form.values.settings.header}>
          <MiniEditor value="header_template" />
        </Collapse>
        <Switch label="Footer" {...form.getInputProps("settings.footer", { type: "checkbox" })} my={10} />
        <Collapse in={form.values.settings.footer}>
          <MiniEditor value="footer_template" />
        </Collapse>
      </ScrollArea.Autosize>
    </Paper>
  );
};

export default Settings;
