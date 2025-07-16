/** システム全体の定数 */

import type { Character, Place } from "../features/models";

/** カレンダーの初期日付 */
export const CALENDAR_INIT_DATE = "2025-05-24";

// 今日の日付をよく使うので、静的に生成しておく
const now = new Date();

/** 当日日付の文字列（yyyy-MM-dd） */
export const TODAY_STRING = `${now.getFullYear()}-${String(
  now.getMonth() + 1
).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

/** システム標準のデフォルトカラーセット */
export const COLOR_SET = [
  "#2e2e2e",
  "#868e96",
  "#fa5252",
  "#e64980",
  "#be4bdb",
  "#7950f2",
  "#4c6ef5",
  "#228be6",
  "#15aabf",
  "#12b886",
  "#40c057",
  "#82c91e",
  "#fab005",
  "#fd7e14",
];

/** イベントのデフォルトカラー */
export const COLOR_EVENT_DEFAULT = "#868e96";

/** 最小時間間隔 */
export const INTERVAL_MIN = "00:10";
/** 最大時間間隔 */
export const INTERVAL_MAX = "02:00";

/** 時間間隔のプリセット */
export const INTERVAL_PRESETS = ["00:10", "00:15", "00:30", "01:00", "02:00"];

/** キャラクター名の最大文字数 */
export const CHARACTER_MAX_LENGTH = 20;
/** プレイヤー名の最大文字数 */
export const PLAYER_MAX_LENGTH = 20;
/** 最大キャラクター数 */
export const CHARACTER_MAX_COUNT = 10;
/** 最小キャラクター数 */
export const CHARACTER_MIN_COUNT = 1;
/** 最大場所数 */
export const PLACE_MAX_COUNT = 10;
/** 最小場所数 */
export const PLACE_MIN_COUNT = 0;
/** 場所名の最大文字数 */
export const PLACE_MAX_LENGTH = 30;
/** 場所メモの最大文字数 */
export const PLACE_MEMO_MAX_LENGTH = 100;

/** -------サンプルデータ-------- */
/** デフォルトのシナリオデータ */
export const DEFAULT_SCENARIO = {
  name: "無題",
  memo: "シナリオのあらすじなど",
};

/** デフォルトのキャラクターデータ */
export const DEFAULT_CHARACTERS = [
  {
    id: "1",
    name: "キャラクターA",
    playerName: "プレイヤーA",
    memo: "年齢や性格などの基本情報",
    color: "#fa5252",
    sort: 1,
  } as Character,
  {
    id: "2",
    name: "キャラクターB",
    playerName: "プレイヤーB",
    memo: "年齢や性格などの基本情報",
    color: "#fa5252",
    sort: 2,
  } as Character,
  {
    id: "3",
    name: "キャラクターC",
    playerName: "プレイヤーC",
    memo: "年齢や性格などの基本情報",
    color: "#fa5252",
    sort: 3,
  } as Character,
];

/** デフォルトの場所データ */
export const DEFAULT_PLACES = [
  { id: "1", name: "エントランス", memo: "", sort: 1 } as Place,
  { id: "2", name: "調理室", memo: "", sort: 2 } as Place,
  { id: "3", name: "倉庫", memo: "", sort: 3 } as Place,
];

/** デフォルトのNPCデータ */
export const DEFAULT_NPC = {
  id: "character-npc",
  name: "NPC",
  color: "#868e96",
  sort: 99,
} as Character;

/** デフォルトの証言者データ */
export const DEFAULT_WITNESS = DEFAULT_CHARACTERS.concat(DEFAULT_NPC);
