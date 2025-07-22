import { Drawer } from "@mantine/core";
import { useDebugView } from "./hooks";
import { JSONTree } from "react-json-tree";

export type DebugViewProps = {
  opened: boolean;
  onClose: () => void;
};
/** デバッグビュー */
export default function DebugView({ opened, onClose }: DebugViewProps) {
  const { json } = useDebugView();
  return (
    <Drawer opened={opened} onClose={onClose} size="70%" title="デバッグ情報">
      <JSONTree data={json} shouldExpandNodeInitially={() => true}></JSONTree>
    </Drawer>
  );
}
