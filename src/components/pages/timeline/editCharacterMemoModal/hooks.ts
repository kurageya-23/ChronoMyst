import { useCallback, useMemo } from "react";
import type {
  Character,
  EditCharacterMemoFormData,
} from "../../../../features/models";
import { useDispatch } from "react-redux";
import { timelineSlice } from "../../../../features/timelines/timelineSlice";

/**
 * カスタムフック
 * @param selectedCharacter
 */
export const useEditCharacterMemoModal = (
  selectedCharacter: Character | null,
  onClose: () => void
) => {
  // 初期値を設定（基本的に選択されたキャラクターのIDと既存のメモが反映される）
  const initialValues = useMemo<EditCharacterMemoFormData>(
    () => ({
      selectedCharacterId: selectedCharacter?.id ?? "",
      memo: selectedCharacter?.memo ?? "",
    }),
    [selectedCharacter]
  );

  const dispatch = useDispatch();

  /** フォーム登録イベントハンドラ */
  const handleSubmit = useCallback(
    (values: EditCharacterMemoFormData) => {
      // Slicerへキャラクターメモの更新を依頼
      dispatch(timelineSlice.actions.updateCharacterMemo(values));
      // モーダル閉じる
      onClose();
    },
    [dispatch, onClose]
  );

  return { initialValues, handleSubmit };
};
