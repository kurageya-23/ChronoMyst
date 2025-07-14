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
  Switch,
  Select,
} from "@mantine/core";
import { TimePicker } from "@mantine/dates";
import DynamicList from "../../../DynamicList";
import { ColorSelector } from "../../../ColorSelector";
import { useTimelineConfig } from "./hooks";
import {
  CHARACTER_MAX_COUNT,
  CHARACTER_MAX_LENGTH,
  CHARACTER_MIN_COUNT,
  INTERVAL_PRESETS,
  PLACE_MAX_COUNT,
  PLACE_MAX_LENGTH,
  PLACE_MEMO_MAX_LENGTH,
  PLACE_MIN_COUNT,
  PLAYER_MAX_LENGTH,
} from "../../../../app/appConstants";

export type ConfigModalProps = {
  opened: boolean;
  onClose: () => void;
};

const ConfigModal: React.FC<ConfigModalProps> = ({ opened, onClose }) => {
  const {
    form,
    presets,
    handleSubmit,
    onCharacterInsert,
    onCharacterRemove,
    onPlaceInsert,
    onPlaceRemove,
    multiDaysChecked,
    onChangeMultiDaysCheck,
  } = useTimelineConfig(opened, onClose);

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
            <Fieldset legend="タイムラインの表示設定">
              <Stack gap={4}>
                {/* 時間間隔 */}
                <TimePicker
                  {...form.getInputProps("interval")}
                  label="間隔"
                  withAsterisk
                  withDropdown
                  presets={INTERVAL_PRESETS}
                />

                {/* 日をまたぐシナリオかどうか */}
                <Switch
                  mt="sm"
                  checked={multiDaysChecked}
                  onChange={(event) => {
                    onChangeMultiDaysCheck(event.currentTarget.checked);
                  }}
                  label="日をまたぐシナリオ(β)"
                  labelPosition="right"
                />

                {/* 開始、終了時間 */}
                <Grid align="flex-end">
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

                  {/* 日をまたぐ場合の日数 */}
                  {multiDaysChecked ? (
                    <Grid.Col span="content">
                      <Group align="flex-end" gap={2}>
                        <Select
                          w={60}
                          {...form.getInputProps("days")}
                          data={["1", "2", "3"]}
                        />
                        {"日目の"}
                      </Group>
                    </Grid.Col>
                  ) : (
                    <></>
                  )}

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
              </Stack>
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
                onInsert={onCharacterInsert}
                onRemove={(i) => onCharacterRemove(i)}
                renderItem={(c, i) => (
                  <>
                    <Text size="sm">{i + 1}.</Text>
                    <TextInput
                      {...form.getInputProps(`characters.${i}.name`)}
                      placeholder="キャラクター名"
                      maxLength={CHARACTER_MAX_LENGTH}
                    />
                    <TextInput
                      {...form.getInputProps(`characters.${i}.playerName`)}
                      placeholder="プレイヤー名"
                      maxLength={PLAYER_MAX_LENGTH}
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
                onInsert={onPlaceInsert}
                onRemove={(i) => onPlaceRemove(i)}
                renderItem={(_, i) => (
                  <>
                    <Text size="sm">{i + 1}.</Text>
                    <TextInput
                      {...form.getInputProps(`places.${i}.name`)}
                      placeholder="場所名"
                      maxLength={PLACE_MAX_LENGTH}
                    />
                    <TextInput
                      {...form.getInputProps(`places.${i}.memo`)}
                      placeholder="メモ"
                      maxLength={PLACE_MEMO_MAX_LENGTH}
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
