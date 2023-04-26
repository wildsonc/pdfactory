import { Select } from "@mantine/core";
import { useRichTextEditorContext } from "@mantine/tiptap";
import { IconTypography } from "@tabler/icons";
import { useQuery } from "react-query";
import api from "../../services/api";

let DEFAULT = [
  { label: "Sans-Serif", value: "sans-serif" },
  { label: "Serif", value: "serif" },
];

interface Props {
  name: string;
}

export default function FontFamilyControl() {
  const { editor } = useRichTextEditorContext();
  const { data } = useQuery<Props[]>(
    "fonts",
    async () => {
      const response = await api.get("/api/fonts");
      return response.data;
    },
    { staleTime: 1000 * 60 }
  );

  if (!editor) return <></>;

  const fonts = data?.map(({ name }) => ({ label: name, value: name }));
  const value = editor.getAttributes("textStyle")?.fontFamily || "";

  return (
    <Select
      data={DEFAULT.concat(fonts || []).sort((a, b) => (a.label > b.label ? 1 : b.label > a.label ? -1 : 0))}
      value={value}
      size="xs"
      withinPortal
      onChange={(e) =>
        editor
          .chain()
          .focus()
          .setFontFamily(e || "")
          .run()
      }
      icon={<IconTypography size={16} />}
      styles={{ input: { fontSize: 14 } }}
      w={200}
    />
  );
}
