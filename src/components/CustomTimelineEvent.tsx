/** FullCalendarイベントのカスタムコンポーネント */
import { Badge, Group, Text, Tooltip } from "@mantine/core";
import type { ExtendedCalenderEventProp } from "../features/models";
import { IconMapPin, IconSpeakerphone } from "@tabler/icons-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTimelineEvent = (eventInfo: any) => {
  const { timeText, event } = eventInfo;
  const extendProps = event.extendedProps as ExtendedCalenderEventProp;

  return (
    <>
      <Group justify="space-between">
        {/* 時間 */}
        <Text size="8px">{timeText}</Text>

        <Group justify="flex-end" gap={4}>
          {/* 証言者 */}
          {extendProps.witness?.name && (
            <Badge
              leftSection={<IconSpeakerphone size={10} />}
              color={extendProps.witness?.color}
              size="sm"
              radius="sm"
              p={1}
            >
              {extendProps.witness?.name}
            </Badge>
          )}

          {/* 場所 */}
          {extendProps.place?.name && (
            <Badge
              leftSection={<IconMapPin size={10} />}
              color="dark"
              size="sm"
              radius="sm"
              p={1}
            >
              {extendProps.place?.name}
            </Badge>
          )}
        </Group>
      </Group>

      <Group>
        {/* メモ */}
        <Tooltip
          label={event.title}
          openDelay={1000}
          disabled={!event.title}
          styles={{
            tooltip: {
              whiteSpace: "pre-line", // 改行コード \n を反映
              fontSize: "12px",
            },
          }}
          position="right-start"
          multiline
          w={240}
        >
          <Text size="14px" style={{ fontWeight: "bold" }}>
            {event.title ?? ""}
          </Text>
        </Tooltip>
      </Group>
    </>
  );
};

export default CustomTimelineEvent;
