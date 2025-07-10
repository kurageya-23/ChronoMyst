import React from "react";
import {
  Modal,
  Container,
  Stack,
  Fieldset,
  Grid,
  Text,
  Group,
  Button,
  TextInput,
} from "@mantine/core";
import { TimePicker } from "@mantine/dates";
import DynamicList from "../../../DynamicList";
import { ColorSelector } from "../../../ColorSelector";
import { useTimelineConfig } from "./hooks";
import {
  CHARACTER_MAX_COUNT,
  CHARACTER_MIN_COUNT,
  INTERVAL_PRESETS,
  PLACE_MAX_COUNT,
  PLACE_MIN_COUNT,
} from "../../../../app/appConstants";

export type ConfigModalProps = {
  opened: boolean;
  onClose: () => void;
};

const ConfigModal: React.FC<ConfigModalProps> = ({ opened, onClose }) => {
  const { form, presets, handleSubmit } = useTimelineConfig(opened, onClose);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      size="100%"
      withinPortal
      title="設定"
    >
      <Container my="lg">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap={4}>
            {/* 時間設定 */}
            <Fieldset legend="時間">
              <TimePicker
                {...form.getInputProps("interval")}
                label="間隔"
                withAsterisk
                withDropdown
                presets={INTERVAL_PRESETS}
              />

              <Grid align="flex-end" mt="sm">
                <Grid.Col span="auto">
                  <TimePicker
                    {...form.getInputProps("startTime")}
                    label="開始時間"
                    withAsterisk
                    withDropdown
                    presets={presets}
                  />
                </Grid.Col>

                <Grid.Col span="content">
                  <Text mb={6}>ー</Text>
                </Grid.Col>

                <Grid.Col span="auto">
                  <TimePicker
                    {...form.getInputProps("endTime")}
                    label="終了時間"
                    withAsterisk
                    withDropdown
                    presets={presets}
                  />
                </Grid.Col>
              </Grid>
            </Fieldset>

            {/* 登場人物 */}
            <Fieldset legend="登場人物" mt="md">
              <Text size="xs" color="dimmed">
                1～10名まで設定できます
              </Text>
              {/* TODO: Mantine の <FormList> を使うと、リスト内アイテムのエラー管理とレイアウトが自動的にハンドリングできます。 */}
              <DynamicList
                items={form.values.characters}
                min={CHARACTER_MIN_COUNT}
                max={CHARACTER_MAX_COUNT}
                errorMessage={form.errors.characters?.toString()}
                onInsert={() => {
                  form.insertListItem("characters", {
                    name: "",
                    playerName: "",
                    color: "#228be6",
                    memo: "",
                  });
                }}
                onRemove={(i) => {
                  form.removeListItem("characters", i);
                }}
                renderItem={(c, i) => (
                  <>
                    <Text size="sm">{i + 1}.</Text>
                    <TextInput
                      {...form.getInputProps(`characters.${i}.name`)}
                      placeholder="キャラクター名"
                      maxLength={20}
                    />
                    <TextInput
                      {...form.getInputProps(`characters.${i}.playerName`)}
                      placeholder="プレイヤー名"
                      maxLength={20}
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
            </Fieldset>

            {/* 場所 */}
            <Fieldset legend="場所" mt="md">
              <Text size="xs" color="dimmed">
                最大10か所まで設定できます
              </Text>
              {/* TODO: Mantine の <FormList> を使うと、リスト内アイテムのエラー管理とレイアウトが自動的にハンドリングできます。 */}
              <DynamicList
                items={form.values.places}
                min={PLACE_MIN_COUNT}
                max={PLACE_MAX_COUNT}
                errorMessage={form.errors.places?.toString()}
                onInsert={() =>
                  form.insertListItem("places", { name: "", memo: "" })
                }
                onRemove={(i) => form.removeListItem("places", i)}
                renderItem={(_, i) => (
                  <>
                    <Text size="sm">{i + 1}.</Text>
                    <TextInput
                      {...form.getInputProps(`places.${i}.name`)}
                      placeholder="場所名"
                    />
                    <TextInput
                      {...form.getInputProps(`places.${i}.memo`)}
                      placeholder="メモ"
                    />
                  </>
                )}
              />
            </Fieldset>

            <Group justify="flex-end" mt="md">
              <Button type="submit" color="teal">
                設定を反映する
              </Button>
            </Group>
          </Stack>
        </form>
      </Container>
    </Modal>
  );
};

export default ConfigModal;
