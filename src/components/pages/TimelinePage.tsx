import { useSelector } from "react-redux";
import {
  timelineSlice,
  type Timeline,
} from "../../features/timelines/timelineSlice";
import type { RootState } from "../../app/store";
import { Container, Paper, Title, Text } from "@mantine/core";
import TimelineTable from "../TimelineTable";
import TimelineConfigCard from "../TimelineConfigCard";

function TimelinePage() {
  const timeline = useSelector(
    (state: RootState) => state[timelineSlice.reducerPath]
  ) as Timeline;

  return (
    <>
      <Container my="lg">
        <Title order={2}>シナリオ</Title>
        <Paper withBorder shadow="sm" p="md" mt="md">
          <Text size="xl" maw={500}>
            {timeline.scenario.name}
          </Text>
          <Text color="dimmed" size="sm" mb="md">
            {timeline.scenario.name}
          </Text>
          <Text color="dimmed" size="sm" mb="md">
            {timeline.times[0]} ー {timeline.times[timeline.times.length - 1]}
          </Text>
        </Paper>
      </Container>

      <TimelineConfigCard />

      <TimelineTable />
    </>
  );
}

export default TimelinePage;
