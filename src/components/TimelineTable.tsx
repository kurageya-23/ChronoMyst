import React, { useMemo } from "react";
import { Box, ScrollArea, Table, useMantineTheme, Text } from "@mantine/core";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import {
  timelineSlice,
  type Timeline,
} from "../features/timelines/timelineSlice";

const TimelineTable: React.FC = () => {
  const theme = useMantineTheme();
  const { times, characters, events } = useSelector(
    (state: RootState) => state[timelineSlice.reducerPath]
  ) as Timeline;

  // 事前に、各キャラ×時間インデックスごとに rowSpan 情報を作る
  // spanMap[charName][timeIndex] = n (>1: この行から n 行結合, 1: 通常セル, 0: スキップ)
  const spanMap = useMemo(() => {
    const map: Record<string, number[]> = {};
    characters.forEach((c) => {
      map[c.name] = times.map(() => 1);
    });

    events.forEach((ev) => {
      if (!ev.endTime || !ev.characters) return;
      const start = times.indexOf(ev.startTime);
      const end = times.indexOf(ev.endTime);
      if (start < 0 || end < 0 || end < start) return;

      const span = end - start + 1;
      ev.characters.forEach((c) => {
        map[c.name][start] = span; // 開始行に結合数をセット
        for (let i = start + 1; i <= end; i++) {
          map[c.name][i] = 0; // 結合された行はスキップマーク
        }
      });
    });

    return map;
  }, [characters, times, events]);

  return (
    <ScrollArea>
      <Table horizontalSpacing="md" verticalSpacing="xs" border={1}>
        <thead>
          <tr>
            <th></th>
            {characters.map((char) => (
              <th key={char.name}>
                <Text maw={200}>{char.name}</Text>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {times.map((time, rowIndex) => (
            <tr key={time}>
              {/* 時間ラベル */}
              <th style={{ verticalAlign: "top" }}>
                <Text maw={200}>{time}</Text>
              </th>

              {/* 各キャラ列 */}
              {characters.map((char) => {
                const span = spanMap[char.name][rowIndex];
                if (span === 0) {
                  // すでに上のセルで縦結合されている部分なので何も描かない
                  return null;
                }

                // 開始時刻と一致するイベントを探す
                const ev = events.find(
                  (e) =>
                    e.startTime === time &&
                    e.characters?.map((c) => c.name).includes(char.name)
                );

                return (
                  <td
                    key={char.name}
                    rowSpan={span}
                    style={{ minWidth: 120, verticalAlign: "top" }}
                  >
                    {ev ? (
                      <Box
                        style={{
                          padding: theme.spacing.xs,
                          backgroundColor: ev.color ?? theme.colors.dark[0],
                          borderRadius: theme.radius.sm,
                        }}
                      >
                        <Text size="xs" color="dimmed">
                          {ev.startTime} - {ev.endTime}
                        </Text>
                        <Text size="sm" maw={300}>
                          {ev.detail}
                        </Text>
                        <Text size="xs" color="dimmed">
                          {ev.place.name}
                        </Text>
                      </Box>
                    ) : null}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </Table>
    </ScrollArea>
  );
};

export default TimelineTable;
