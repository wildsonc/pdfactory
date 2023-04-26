import { ActionIcon } from "@mantine/core";
import { IconWand } from "@tabler/icons";
import js_beautify from "js-beautify";
import { useTemplateFormContext } from "../../context/form-context";
import CustomEditor from "../CustomEditor";

const JsonEditor = ({ height }: { height?: number }) => {
  const form = useTemplateFormContext();

  const format = () => {
    form.setFieldValue("json", js_beautify(form.values.json));
  };

  return (
    <div style={{ position: "relative" }}>
      <ActionIcon onClick={format} sx={{ position: "absolute", top: 5, right: 20, zIndex: 999 }} color="blue">
        <IconWand size={16} />
      </ActionIcon>
      <CustomEditor
        value={form.values.json}
        height={height}
        onChange={(e) => form.setFieldValue("json", e)}
        language="json"
      />
    </div>
  );
};

export default JsonEditor;
