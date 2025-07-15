import { TODAY_STRING } from "./appConstants";

/** 日付文字列を「yyyyMMdd」形式で返すヘルパー関数 */
export const getTodayString = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}${mm}${dd}`;
};

/** ファイル名に使えない文字を _ に置換 */
export const sanitizeFilename = (name: string) =>
  name.replace(/[/\\?%*:|"<> ]/g, "_");

/** "hh:ss"から分を算出（検証なし） */
export const toMinute = (timeStr: string) => {
  const [ih, im] = timeStr.split(":").map(Number);
  return ih * 60 + im;
};

/** 日付に分を足し合わせる */
export const addMinutes = (date: Date, min: number): Date => {
  return new Date(date.getTime() + min * 60 * 1000);
};

/**
 * ISO 文字列の「yyyy-MM-dd」部分を本日の日付に置き換えて返す
 * @param isoString - 置き換えたい ISO 文字列（例: "2025-07-14T09:15:00.000Z"）
 * @returns 新しい ISO 文字列（例: "2025-07-15T09:15:00.000Z"）
 */
export const replaceDateWithToday = (isoString: string): string => {
  // 2. 元の文字列を 'T' で分割し、時刻以降を取得
  const [, timeAndZone] = isoString.split("T");

  // 3. 今日の日付 + 時刻以降 を結合して返却
  return `${TODAY_STRING}T${timeAndZone}`;
};
