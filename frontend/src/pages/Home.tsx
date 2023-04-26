import { Box, Group, useMantineTheme } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconArchive, IconTemplate, IconTypography, IconUsers } from "@tabler/icons-react";
import { useQuery } from "react-query";
import BarChart from "../components/dashboard/BarChart";
import { StatsRing } from "../components/dashboard/StatsRing";
import api from "../services/api";

interface Props {
  bar_chart: {
    date: string;
    [key: string]: string;
  }[];
  templates: string[];
  users: number;
  documents: number;
  fonts: number;
}

const Home = () => {
  const theme = useMantineTheme();

  const { isLoading, data, refetch } = useQuery<Props>(
    "dashboard",
    () =>
      api
        .get(`/api/dashboard`)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          showNotification({
            title: "Error",
            message: err.message,
            color: "red",
          });
        }),
    { staleTime: 1000 * 60 }
  );

  if (!data) return <></>;

  return (
    <>
      <Group position="center" grow>
        <StatsRing label="Templates" color="blue" stats={data.templates.length} icon={IconTemplate} />
        <StatsRing label="Fonts" color="yellow" stats={data.fonts} icon={IconTypography} />
        <StatsRing label="Users" color="cyan" stats={data.users} icon={IconUsers} />
        <StatsRing label="Documents" color="green" stats={data.documents} icon={IconArchive} />
      </Group>
      <Box h="calc(100vh - 150px)">
        <BarChart keys={data.templates} data={data.bar_chart} />
      </Box>
    </>
  );
};

export default Home;
