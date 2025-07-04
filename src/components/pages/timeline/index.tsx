import "./style.css";
import { ActionIcon, Affix, Grid, Group, Text } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import FullCalendar from "@fullcalendar/react";
import { type EventApi } from "@fullcalendar/core";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useSelector } from "react-redux";
import { useState } from "react";
import type { Timeline } from "../../../features/models";
import { timelineSlice } from "../../../features/timelines/timelineSlice";
import CustomTimelineEvent from "../../CustomTimelineEvent";
import type { RootState } from "../../../app/store";
import EditTimelineEventModal from "./editTimelineEventModal";

function TimelinePage() {
  const { timelineEvents: timelineEvents, config } = useSelector(
    (state: RootState) => state[timelineSlice.reducerPath]
  ) as Timeline;

  const [opened, { open, close }] = useDisclosure(false);
  const handleClose = () => {
    close();
    setSelectedEvent(null);
  };

  const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null);

  return (
    <>
      {/* カレンダーヘッダー */}
      <Grid py={0}>
        <Grid.Col span={1}></Grid.Col>
        {config.characters.map((c) => (
          <Grid.Col span="auto" flex="center" pt={0} px={0} key={c.id}>
            <Group justify="center">
              <Text
                style={{
                  textDecoration: "underline",
                  textDecorationColor: c.color,
                  textDecorationThickness: "2px",
                }}
              >
                {c.name}
              </Text>
            </Group>
            <Group justify="center">
              <Text size="xs" color="dimmed">
                {c.playerName}
              </Text>
            </Group>
          </Grid.Col>
        ))}
      </Grid>

      {/* カレンダーコンテンツ */}
      <Grid mx={12}>
        {/* 時間目盛り表示用 */}
        <Grid.Col span={1} px={0} className="axis-only">
          <FullCalendar
            plugins={[timeGridPlugin]}
            initialView="timeGridDay"
            locale="en"
            allDaySlot={false}
            dayHeaders={false}
            headerToolbar={false}
            dayHeaderContent={() => null}
            contentHeight="auto"
            slotLabelContent={(arg) => {
              const date = arg.date;
              const hour = date.getHours();
              const minute = String(date.getMinutes()).padStart(2, "0");
              return `${hour}:${minute}`;
            }}
            slotMinTime={config.startTime}
            slotMaxTime={config.endTime}
            scrollTime={config.startTime}
            events={[]}
          />
        </Grid.Col>
        {config.characters.map((c) => {
          const filteredEvents = timelineEvents.filter((ev) =>
            ev.extendedProps.characters.some((ch) => ch.id === c.id)
          );

          return (
            <Grid.Col span="auto" px={0} key={c.id}>
              <FullCalendar
                plugins={[timeGridPlugin]}
                initialView="timeGridDay"
                locale="ja"
                allDaySlot={false}
                dayHeaders={false}
                headerToolbar={false}
                dayHeaderContent={() => null}
                contentHeight="auto"
                slotLabelContent={() => null}
                slotMinTime={config.startTime}
                slotMaxTime={config.endTime}
                scrollTime={config.startTime}
                eventContent={CustomTimelineEvent}
                events={filteredEvents}
                eventClick={(info) => {
                  info.jsEvent.preventDefault();
                  setSelectedEvent(info.event);
                  open();
                }}
              />
            </Grid.Col>
          );
        })}
      </Grid>
      <Affix position={{ bottom: 40, right: 40 }}>
        <Group>
          <Text size="sm">イベントの登録</Text>
          <ActionIcon color="blue" radius="xl" size="lg" onClick={open}>
            <IconPlus stroke={1.5} size={32} />
          </ActionIcon>
        </Group>
      </Affix>
      <EditTimelineEventModal
        opened={opened}
        onClose={handleClose}
        selectedEvent={selectedEvent}
      />
    </>
  );
}

export default TimelinePage;
