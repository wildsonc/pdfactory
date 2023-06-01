import { ActionIcon } from "@mantine/core";
import { IconWand } from "@tabler/icons-react";
import { css_beautify } from "js-beautify";
import { useTemplateFormContext } from "../../context/form-context";
import CustomEditor from "../CustomEditor";

const CssEditor = ({ height }: { height?: number }) => {
  const form = useTemplateFormContext();

  const format = () => {
    form.setFieldValue("css", css_beautify(form.values.css));
  };

  return (
    <div style={{ position: "relative" }}>
      <ActionIcon onClick={format} sx={{ position: "absolute", top: 5, right: 20, zIndex: 999 }} color="blue">
        <IconWand size={16} />
      </ActionIcon>
      <CustomEditor
        value={form.values.css}
        onChange={(e) => form.setFieldValue("css", e)}
        height={height}
        language="css"
      />
    </div>
  );
};

export default CssEditor;
