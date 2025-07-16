import { useMemo, useCallback, useEffect } from "react";
import { useForm } from "@mantine/form";
import { useSelector, useDispatch } from "react-redux";
import { getTimeRange, isTimeAfter } from "@mantine/dates";
import { timelineSlice } from "../../../../features/timelines/timelineSlice";
import type { RootState } from "../../../../app/store";
import { type TimelineConfig } from "../../../../features/models";
import { configModalValidator } from "./validator";
import { v4 as uuidv4 } from "uuid";
import { useNextSort } from "../../../../features/utils/useNextSort";
import { DEFAULT_NPC, INTERVAL_MIN } from "../../../../app/appConstants";
import { computeEndTime } from "../../../../app/util";

export const useTimelineConfig = (opened: boolean, onClose: () => void) => {
  const dispatch = useDispatch();
  const config = useSelector(
    (s: RootState) => s[timelineSlice.reducerPath] as { config: TimelineConfig }
  ).config;

  const initialValues = useMemo<TimelineConfig>(
    () => ({
      interval: config.interval,
      timeAmount: config.timeAmount,
      timelineStartTime: config.timelineStartTime,
      timelineEndTime: config.timelineEndTime,
      witnesses: config.characters.map((c) => ({ ...c })),
      characters: config.characters.map((c) => ({ ...c })),
      places: config.places.map((p) => ({ ...p })),
      prologue: config.prologue,
    }),
    [config]
  );

  const form = useForm<TimelineConfig>({
    mode: "controlled",
    initialValues,
    validate: configModalValidator,
  });

  // opened フラグが true に変わった瞬間だけ、フォーム値を初期値に上書きする
  useEffect(() => {
    if (opened) {
      form.setValues(initialValues);
    }
  }, [opened]);

  /** 行動開始時間のプリセット */
  const startTimePresets = useMemo(() => {
    const interval = isTimeAfter(form.values.interval, "00:10")
      ? form.values.interval
      : "00:10";

    return getTimeRange({
      startTime: "00:00",
      endTime: "24:00",
      interval,
    });
  }, [form.values.interval]);

  /** 行動時間量のプリセット */
  const timeAmountPresets = useMemo(() => {
    // インターバルの最小値は10分
    const interval = isTimeAfter(form.values.interval, INTERVAL_MIN)
      ? form.values.interval
      : INTERVAL_MIN;

    return getTimeRange({
      startTime: form.values.interval,
      endTime: "24:00",
      interval,
    });
  }, [form.values.interval]);

  const nextCharacterSort = useNextSort(form.values.characters);
  /** キャラクター追加 */
  const onCharacterInsert = useCallback(() => {
    form.insertListItem("characters", {
      id: uuidv4(),
      name: "",
      playerName: "",
      color: "#228be6",
      memo: "",
      sort: nextCharacterSort,
    });
  }, [form]);

  /** キャラクター削除 */
  const onCharacterRemove = useCallback(
    (idx: number) => {
      form.removeListItem("characters", idx);
    },
    [form]
  );

  const nextPlaceSort = useNextSort(form.values.places);
  /** 場所追加 */
  const onPlaceInsert = useCallback(() => {
    form.insertListItem("places", {
      id: uuidv4(),
      name: "",
      memo: "",
      sort: nextPlaceSort,
    });
  }, [form]);

  /** 場所削除 */
  const onPlaceRemove = useCallback(
    (idx: number) => {
      form.removeListItem("places", idx);
    },
    [form]
  );

  /** 設定更新 */
  const handleSubmit = useCallback(
    (values: TimelineConfig) => {
      // 証言者にはキャラクター+NPCを追加
      values.witnesses = values.characters.concat([DEFAULT_NPC]);

      // endTimeにstartTime + timeAmountをセット
      values.timelineEndTime = computeEndTime(
        values.timelineStartTime,
        values.timeAmount
      );

      dispatch(timelineSlice.actions.updateConfig(values));
      onClose();
    },
    [dispatch, onClose]
  );

  return {
    form,
    startTimePresets,
    timeAmountPresets,
    handleSubmit,
    onCharacterInsert,
    onCharacterRemove,
    onPlaceInsert,
    onPlaceRemove,
  };
};
