import { Paper, ScrollArea, useMantineColorScheme, useMantineTheme } from "@mantine/core";
import Highlight, { defaultProps, Language } from "prism-react-renderer";
import Editor from "react-simple-code-editor";
import { getPrismTheme } from "./prism-theme";

interface Props {
  language: Language;
  value: string;
  height?: number;
  style?: React.CSSProperties;
  onChange: (value: string) => void;
}

const CustomEditor = ({ language, value, height, onChange, style }: Props) => {
  const { colorScheme } = useMantineColorScheme();
  const mantineTheme = useMantineTheme();

  const theme = getPrismTheme(mantineTheme, colorScheme);

  const highlight = (code: string) => (
    <Highlight {...defaultProps} theme={theme} code={code} language={language}>
      {({ tokens, getLineProps, getTokenProps }) => (
        <>
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })} key={i}>
              <span>
                {line.map((token, key) => (
                  <span {...getTokenProps({ token, key })} key={key} />
                ))}
              </span>
            </div>
          ))}
        </>
      )}
    </Highlight>
  );

  return (
    <Paper withBorder p={5}>
      <ScrollArea.Autosize mah={height || 550}>
        <Editor
          value={value}
          onValueChange={onChange}
          highlight={highlight}
          padding={12}
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 400,
            fontSize: 13,
            borderRadius: 4,
            minHeight: 300,
            ...theme.plain,
            ...style,
          }}
        />
      </ScrollArea.Autosize>
    </Paper>
  );
};

export default CustomEditor;
