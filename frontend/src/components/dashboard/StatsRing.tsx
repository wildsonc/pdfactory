import { Center, Group, Paper, RingProgress, Text } from "@mantine/core";
import { Icon } from "@tabler/icons-react";

interface StatsRingProps {
  label: string;
  stats: string | number;
  color: string;
  icon: Icon;
}

export function StatsRing({ label, stats, color, icon: Icon }: StatsRingProps) {
  return (
    <Paper withBorder radius="md" p="xs">
      <Group noWrap>
        <RingProgress
          size={80}
          roundCaps
          thickness={8}
          sections={[{ value: 100, color: color }]}
          label={
            <Center>
              <Icon size="1.4rem" stroke={1.5} />
            </Center>
          }
        />

        <div>
          <Text color="dimmed" size="xs" transform="uppercase" weight={700}>
            {label}
          </Text>
          <Text weight={700} size="xl">
            {stats}
          </Text>
        </div>
      </Group>
    </Paper>
  );
}
