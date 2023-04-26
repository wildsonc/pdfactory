import { useMantineTheme } from "@mantine/core";
import { BarDatum, ResponsiveBar } from "@nivo/bar";

interface Props {
  data: BarDatum[];
  keys: string[];
}

const BarChart = ({ data, keys }: Props) => {
  const theme = useMantineTheme();
  const dark = theme.colorScheme === "dark";

  return (
    <>
      <ResponsiveBar
        data={data}
        keys={keys}
        indexBy="date"
        theme={{
          textColor: dark ? theme.colors.gray[3] : theme.colors.dark[9],
          tooltip: {
            container: {
              color: theme.colors.dark[9],
            },
          },
        }}
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.2}
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={[
          theme.colors.red[5],
          theme.colors.blue[5],
          theme.colors.lime[5],
          theme.colors.orange[5],
          theme.colors.yellow[5],
          theme.colors.indigo[5],
          theme.colors.violet[5],
        ]}
        borderRadius={2}
        labelSkipWidth={12}
        labelSkipHeight={12}
        axisLeft={null}
        labelTextColor={theme.colors.dark[9]}
        enableGridY={false}
        tooltipLabel={(d) => `${d.id}`}
        legends={[
          {
            dataFrom: "keys",
            anchor: "bottom",
            direction: "row",
            justify: false,
            translateX: 0,
            translateY: 50,
            itemsSpacing: 10,
            itemWidth: 100,
            itemHeight: 15,
            itemOpacity: 0.85,
            symbolSize: 20,
            effects: [
              {
                on: "hover",
                style: {
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    </>
  );
};

export default BarChart;
