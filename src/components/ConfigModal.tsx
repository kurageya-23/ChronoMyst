import React, { useMemo } from "react";
import {
  Button,
  Container,
  Grid,
  Group,
  Modal,
  TextInput,
  Text,
  Fieldset,
  Stack,
} from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "@mantine/form";
import {
  getTimeRange,
  isTimeAfter,
  TimeInput,
  TimePicker,
} from "@mantine/dates";
import { timelineSlice } from "../features/timelines/timelineSlice";
import { ColorSelector } from "./ColorSelector";
import type { RootState } from "../app/store";
import type {
  Character,
  Place,
  Timeline,
  TimelineConfig,
} from "../features/models";
import DynamicList from "./DynamicList";

export type ConfigModalProps = {
  opened: boolean;
  onClose: () => void;
};

const ConfigModal: React.FC<ConfigModalProps> = ({ opened, onClose }) => (
  <Modal
    opened={opened}
    onClose={onClose}
    centered
    size="100%"
    withinPortal
    title="設定"
    styles={{
      header: {
        height: 20,
        paddingTop: 4,
        paddingBottom: 4,
        // タイトル行の高さを揃える
        "& .mantine-Modal-title": {
          lineHeight: 1,
          fontSize: "1rem",
        },
        // クローズボタンのサイズを調整
        '& button[aria-label="Close modal"]': {
          padding: 4,
        },
      },

      body: {
        backgroundColor: "#fafafa",
      },
    }}
  >
    <ModalContent onClose={onClose} />
  </Modal>
);

type ModalContentProps = { onClose: () => void };

const ModalContent: React.FC<ModalContentProps> = ({ onClose }) => {
  const dispatch = useDispatch();
  const { config } = useSelector(
    (s: RootState) => s[timelineSlice.reducerPath]
  ) as Timeline;

  // 初期値をミュータブルなコピーで準備
  const initialValues = useMemo<TimelineConfig>(
    () => ({
      interval: config.interval,
      startTime: config.startTime,
      endTime: config.endTime,
      characters: config.characters.map((c) => ({ ...c })),
      places: config.places.map((p) => ({ ...p })),
    }),
    [config]
  );

  const form = useForm<TimelineConfig>({
    mode: "uncontrolled",
    initialValues,
  });

  // interval 変更時にプリセットを再生成
  const presets = useMemo(
    () =>
      getTimeRange({
        startTime: "00:00",
        endTime: "24:00",
        interval: isTimeAfter(form.values.interval, "00:10")
          ? form.values.interval
          : "00:10",
      }),
    [form.values.interval]
  );

  // 送信 & モーダル閉じる
  const handleSubmit = (values: TimelineConfig) => {
    dispatch(timelineSlice.actions.updateConfig(values));
    onClose();
  };

  return (
    <Container my="lg">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap={4}>
          {/* 時間設定 */}
          <Fieldset legend="時間">
            <TimeInput
              withAsterisk
              label="間隔"
              placeholder="ex1. 01:00 | ex2. 0:30"
              minTime="00:10"
              {...form.getInputProps("interval")}
            />
            <Grid align="flex-end" mt="sm">
              <Grid.Col span="auto">
                <TimePicker
                  label="開始時間"
                  withAsterisk
                  withDropdown
                  presets={presets}
                  {...form.getInputProps("startTime")}
                />
              </Grid.Col>
              <Grid.Col span="content">
                <Text mb={6}>ー</Text>
              </Grid.Col>
              <Grid.Col span="auto">
                <TimePicker
                  label="終了時間"
                  withAsterisk
                  withDropdown
                  presets={presets}
                  {...form.getInputProps("endTime")}
                />
              </Grid.Col>
            </Grid>
          </Fieldset>

          {/* 登場人物リスト */}
          <DynamicList<Character>
            legend="登場人物"
            items={form.values.characters}
            onInsert={() =>
              form.insertListItem("characters", {
                name: "",
                playerName: "",
                color: "#228be6",
                memo: "",
              })
            }
            onRemove={(i) => form.removeListItem("characters", i)}
            renderItem={(c, i) => (
              <>
                <Text size="sm">{i + 1}.</Text>
                <TextInput
                  placeholder="キャラクター名"
                  {...form.getInputProps(`characters.${i}.name`)}
                />
                <TextInput
                  placeholder="プレイヤー名"
                  {...form.getInputProps(`characters.${i}.playerName`)}
                />
                <ColorSelector
                  value={c.color}
                  onChange={(col) =>
                    form.setFieldValue(`characters.${i}.color`, col)
                  }
                />
              </>
            )}
          />

          {/* 場所リスト */}
          <DynamicList<Place>
            legend="場所"
            items={form.values.places}
            onInsert={() =>
              form.insertListItem("places", { name: "", memo: "" })
            }
            onRemove={(i) => form.removeListItem("places", i)}
            renderItem={(_p, i) => (
              <>
                <Text size="sm">{i + 1}.</Text>
                <TextInput
                  placeholder="場所名"
                  {...form.getInputProps(`places.${i}.name`)}
                />
                <TextInput
                  placeholder="メモ"
                  {...form.getInputProps(`places.${i}.memo`)}
                />
              </>
            )}
          />

          <Group justify="flex-end" mt="md">
            <Button type="submit" color="teal">
              設定を反映する
            </Button>
          </Group>
        </Stack>
      </form>
    </Container>
  );
};

export default ConfigModal;
