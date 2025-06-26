import { useSelector } from "react-redux";
import {
  timelineSlice,
  type Timeline,
} from "../../features/timelines/timelineSlice";
import type { RootState } from "../../app/store";
import { Paper, Title, Text, Grid } from "@mantine/core";
import TimelineTable from "../TimelineTable";
import TimelineConfigCard from "../TimelineConfigCard";

function TimelinePage() {
  const timeline = useSelector(
    (state: RootState) => state[timelineSlice.reducerPath]
  ) as Timeline;

  return (
    <>
      <Grid>
        <Grid.Col span={8}>
          <TimelineConfigCard />
          <TimelineTable />
        </Grid.Col>
        <Grid.Col span={4}>
          <Title order={5}>シナリオ情報</Title>
          <Paper withBorder shadow="sm" p="sm">
            <Text size="md">{timeline.scenario.name}</Text>
            <Text color="dimmed" size="sm" mb="md">
              {timeline.times[0]} ー {timeline.times[timeline.times.length - 1]}
            </Text>
          </Paper>
        </Grid.Col>
      </Grid>
    </>
  );
}

export default TimelinePage;
