/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import type { RootState } from "../../app/store";
import type { Timeline, TimelineJson } from "../../features/models";
import { timelineSlice } from "../../features/timelines/timelineSlice";
import { useDispatch, useSelector } from "react-redux";
import { useDebouncedValue } from "@mantine/hooks";
import { getTodayString, sanitizeFilename } from "../../app/util";
import pkg from "../../../package.json";

export const useLayout = () => {
  const appName = pkg.name;
  const appVersion = pkg.version;
  const timeline = useSelector(
    (state: RootState) => state[timelineSlice.reducerPath]
  ) as Timeline;
  const [scenarioName, setScenarioName] = useState(timeline.scenario.name);
  const [debounced] = useDebouncedValue(scenarioName, 1000);

  const dispatch = useDispatch();

  // インポート後に store も変わるので、ローカル state を常に同期
  useEffect(() => {
    setScenarioName(timeline.scenario.name);
  }, [timeline.scenario.name]);

  /** ファイル(.json)を読み込み */
  const handleImport = () => {
    // 確認ダイアログ
    const ok = window.confirm(
      "現在のデータは上書きされますが、よろしいですか？\n「ファイル(.json)に保存」からデータを保存することができます"
    );
    if (!ok) {
      return; // キャンセルされたら何もしない
    }

    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json";
    input.onchange = async () => {
      if (!input.files || input.files.length === 0) {
        return;
      }
      const file = input.files[0];

      try {
        let text = await file.text();
        // もし BOM が残っていたら取り除く
        if (text.charCodeAt(0) === 0xfeff) {
          text = text.slice(1);
        }
        const parsed = JSON.parse(text);

        // 型チェック
        if (
          typeof parsed !== "object" ||
          parsed === null ||
          parsed.appName !== appName ||
          parsed.version !== appVersion ||
          typeof (parsed as any).data !== "object" ||
          (parsed as any).data === null
        ) {
          throw new Error("ファイルの形式が不正です");
        }

        // 成功 → Reduxへ投入
        const json = parsed as TimelineJson;

        dispatch(timelineSlice.actions.jsonImport(json.data));
      } catch (err: any) {
        alert(`ファイルの読み込みに失敗しました: ${err.message}`);
      }
    };

    input.click();
  };

  /** ファイル(.json)に保存 */
  const handleExport = () => {
    // 1. エクスポート用データ生成
    const exportData = {
      appName,
      version: appVersion,
      data: timeline,
    } as TimelineJson;

    // 2. ファイル名を組み立て
    const dateStr = getTodayString();
    const safeName = sanitizeFilename(timeline.scenario.name);
    const filename = `${dateStr}_${safeName}.json`;

    // 3. JSON 文字列化（インデント付き）
    const jsonString = JSON.stringify(exportData, null, 2);

    // 4. UTF-8 BOM を先頭に付与し、MIME に charset を指定した Blob を作成
    const bom = "\uFEFF";
    const blob = new Blob([bom + jsonString], {
      type: "application/json; charset=utf-8",
    });
    const url = URL.createObjectURL(blob);

    // 5. 仮の <a> でダウンロードをトリガー
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    // 6. 後片付け
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return {
    appVersion,
    timeline,
    scenarioName,
    setScenarioName,
    debounced,
    handleImport,
    handleExport,
  };
};
