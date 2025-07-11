import "./style.css";
import { ActionIcon, Affix, Group, Text } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import FullCalendar from "@fullcalendar/react";
import { type EventApi } from "@fullcalendar/core";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useSelector } from "react-redux";
import { useState } from "react";
import { type Timeline } from "../../../features/models";
import { timelineSlice } from "../../../features/timelines/timelineSlice";
import CustomTimelineEvent from "../../CustomTimelineEvent";
import type { RootState } from "../../../app/store";
import EditTimelineEventModal from "./editTimelineEventModal";
import { useTimeline } from "./hooks";

/** タイムラインページ */
function TimelinePage() {
  const { timelineEvents, config } = useSelector(
    (state: RootState) => state[timelineSlice.reducerPath]
  ) as Timeline;

  const [opened, { open, close }] = useDisclosure(false);
  const handleClose = () => {
    close();
    setSelectedEvent(null);
  };

  const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null);

  // colgroup 用に「時間軸＋キャラ列」を定義
  const cols = [
    <col key="time" style={{ width: 50 }} />,
    ...config.characters.map((c) => (
      <col key={c.id} style={{ width: "auto" }} />
    )),
  ];

  // カスタムフックからロジックを取得
  const { handleEventDrop, handleEventResize } = useTimeline(
    selectedEvent,
    config
  );

  return (
    <div className="timeline-container">
      <table className="timeline-table">
        <colgroup>{cols}</colgroup>
        {/* タイムラインヘッダー */}
        <thead>
          <tr>
            <th>Time</th>
            {config.characters.map((c) => (
              <th key={c.id}>
                {/* キャラクター名 */}
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
                {/* プレイヤー名 */}
                <Group justify="center">
                  <Text size="xs" color="dimmed">
                    {c.playerName}
                  </Text>
                </Group>
              </th>
            ))}
          </tr>
        </thead>

        {/* タイムラインコンテンツ */}
        <tbody>
          <tr>
            {/* --- 時間軸だけの FullCalendar --- */}
            <td style={{ height: "100%" }} className="axis-only">
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
            </td>

            {/* --- 各キャラクターごとの FullCalendar --- */}
            {config.characters.map((c) => {
              const filteredEvents = timelineEvents.filter((ev) =>
                ev.extendedProps.characters.some((ch) => ch.id === c.id)
              );
              return (
                <td
                  key={c.id}
                  style={{ height: "100%" }}
                  className="character-timeline"
                >
                  <FullCalendar
                    plugins={[timeGridPlugin, interactionPlugin]}
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
                    editable
                    eventDrop={handleEventDrop}
                    eventResize={handleEventResize}
                    eventMinHeight={50}
                  />
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>

      {/* イベント登録フロートボタン */}
      <Affix position={{ bottom: 40, right: 40 }}>
        <Group>
          <Text size="sm" color="white">
            イベントの登録
          </Text>
          <ActionIcon color="blue" radius="xl" size="lg" onClick={open}>
            <IconPlus stroke={1.5} size={32} />
          </ActionIcon>
        </Group>
      </Affix>

      {/* イベント登録モーダル */}
      <EditTimelineEventModal
        opened={opened}
        onClose={handleClose}
        selectedEvent={selectedEvent}
      />
    </div>
  );
}

export default TimelinePage;
