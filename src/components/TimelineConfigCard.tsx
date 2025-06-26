import React from "react";
import { Button, Container, Grid, Group, Text, TextInput } from "@mantine/core";
import {
  getTimeRange,
  isTimeAfter,
  TimeInput,
  TimePicker,
} from "@mantine/dates";
import { useForm } from "@mantine/form";
import {
  timelineSlice,
  type Timeline,
  type TimelineConfig,
} from "../features/timelines/timelineSlice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../app/store";

const TimelineConfigCard: React.FC = () => {
  const dispatch = useDispatch();
  const { characters } = useSelector(
    (state: RootState) => state[timelineSlice.reducerPath]
  ) as Timeline;

  const form = useForm<TimelineConfig>({
    mode: "controlled",
    initialValues: {
      interval: "01:00",
      startTime: "12:00",
      endTime: "23:00",
      characters: characters,
    },

    validate: {},
  });

  return (
    <Container my="lg">
      <form
        onSubmit={form.onSubmit((values) => {
          dispatch(timelineSlice.actions.updateConfig(values));
        })}
      >
        {/* 時間の間隔 */}
        <TimeInput
          withAsterisk
          label="時間の間隔"
          placeholder="ex1. 01:00 | ex2. 0:30"
          minTime="00:10"
          key={form.key("interval")}
          {...form.getInputProps("interval")}
        />

        <Grid align="flex-end">
          <Grid.Col span={5}>
            {/* 開始時間 */}
            <TimePicker
              label="開始時間"
              withAsterisk
              withDropdown
              presets={getTimeRange({
                startTime: "00:00",
                endTime: "24:00",
                interval: isTimeAfter(form.values.interval, "00:10")
                  ? form.values.interval
                  : "00:10",
              })}
              key={form.key("startTime")}
              {...form.getInputProps("startTime")}
            />
          </Grid.Col>

          <Grid.Col span={1}>
            <Text mb={6}>ー</Text>
          </Grid.Col>

          <Grid.Col span={5}>
            {/* 終了時間 */}
            <TimePicker
              label="終了時間"
              withDropdown
              withAsterisk
              presets={getTimeRange({
                startTime: "00:00",
                endTime: "24:00",
                interval: isTimeAfter(form.values.interval, "00:10")
                  ? form.values.interval
                  : "00:10",
              })}
              key={form.key("endTime")}
              {...form.getInputProps("endTime")}
            />
          </Grid.Col>
        </Grid>

        {/* 登場人物 */}
        {form.getValues().characters.map((c, index) => (
          <Group key={c.name} mt="xs">
            <TextInput
              key={form.key(`characters.${index}.name`)}
              {...form.getInputProps(`characters.${index}.name`)}
            />
          </Group>
        ))}

        {/* 場所 */}

        <Group justify="flex-end" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Container>
  );
};

export default TimelineConfigCard;
