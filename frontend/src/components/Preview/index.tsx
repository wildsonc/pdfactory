import { Center, Paper } from "@mantine/core";
import { IconFileInvoice } from "@tabler/icons-react";

interface Props {
  url: string;
}

const Preview = ({ url }: Props) => {
  return (
    <Paper h="100%" withBorder>
      {url ? (
        <iframe src={url} style={{ width: "100%", height: "100%", borderWidth: 0 }}></iframe>
      ) : (
        <Center h="100%">
          <IconFileInvoice size={60} stroke={1.2} />
        </Center>
      )}
    </Paper>
  );
};

export default Preview;
