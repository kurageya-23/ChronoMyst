/** FullCalendarイベントのカスタムコンポーネント */
import { Badge, Stack, Group, Text, Tooltip } from "@mantine/core";
import type { ExtendedCalenderEventProp } from "../features/models";
import { IconMapPin } from "@tabler/icons-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTimelineEvent = (eventInfo: any) => {
  const { timeText, event } = eventInfo;
  const extendProps = event.extendedProps as ExtendedCalenderEventProp;

  const badgeIcon = <IconMapPin size={10} />;
  return (
    <Stack
      style={{ padding: "2px 4px" }}
      align="stretch"
      justify="center"
      gap={4}
    >
      <Group gap={4} justify="space-between">
        <Text size="8px">{timeText}</Text>
        {extendProps.place?.name && (
          <Badge
            leftSection={badgeIcon}
            color="dark"
            size="xs"
            radius="xs"
            p={1}
          >
            {extendProps.place?.name}
          </Badge>
        )}
      </Group>
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
    </Stack>
  );
};

export default CustomTimelineEvent;
