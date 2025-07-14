import { useMemo, useCallback, useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import { useSelector, useDispatch } from "react-redux";
import { getTimeRange, isTimeAfter } from "@mantine/dates";
import { timelineSlice } from "../../../../features/timelines/timelineSlice";
import type { RootState } from "../../../../app/store";
import { npcSample, type TimelineConfig } from "../../../../features/models";
import { configModalValidator } from "./validator";
import { v4 as uuidv4 } from "uuid";
import { useNextSort } from "../../../../features/utils/useNextSort";

export const useTimelineConfig = (opened: boolean, onClose: () => void) => {
  const dispatch = useDispatch();
  const config = useSelector(
    (s: RootState) => s[timelineSlice.reducerPath] as { config: TimelineConfig }
  ).config;

  // 日をまたぐシナリオのフラグ
  const [multiDaysChecked, setMultiDaysChecked] = useState(false);

  const initialValues = useMemo<TimelineConfig>(
    () => ({
      interval: config.interval,
      startTime: config.startTime,
      endTime: config.endTime,
      days: config.days,
      witnesses: config.characters.map((c) => ({ ...c })),
      characters: config.characters.map((c) => ({ ...c })),
      places: config.places.map((p) => ({ ...p })),
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

  // interval に合わせてプリセット生成
  const presets = useMemo(() => {
    const interval = isTimeAfter(form.values.interval, "00:10")
      ? form.values.interval
      : "00:10";

    return getTimeRange({
      startTime: "00:00",
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

  /** 日をまたぐシナリオスイッチの変更 */
  const onChangeMultiDaysCheck = useCallback(
    (checked: boolean) => {
      // 日をまたぐシナリオがfalseということは、daysを1にセット
      if (!checked) form.values.days = 1;

      setMultiDaysChecked(checked);
    },
    [form.values]
  );

  /** 設定更新 */
  const handleSubmit = useCallback(
    (values: TimelineConfig) => {
      // 証言者にはキャラクター+NPCを追加
      values.witnesses = values.characters.concat([npcSample]);
      // <select />のoptionsが文字列しか扱えないので設定反映時にキャストする
      values.days = Number(values.days);
      dispatch(timelineSlice.actions.updateConfig(values));
      onClose();
    },
    [dispatch, onClose]
  );

  return {
    form,
    presets,
    handleSubmit,
    onCharacterInsert,
    onCharacterRemove,
    onPlaceInsert,
    onPlaceRemove,
    multiDaysChecked,
    onChangeMultiDaysCheck,
  };
};
