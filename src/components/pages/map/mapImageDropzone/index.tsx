import { Group, Text } from "@mantine/core";
import {
  type FileWithPath,
  type FileRejection,
  Dropzone,
  IMAGE_MIME_TYPE,
} from "@mantine/dropzone";
import { IconUpload, IconX, IconPhoto } from "@tabler/icons-react";

type MapImageDropZoneProps = {
  onDrop: (files: FileWithPath[]) => void;
  onReject?: (files: FileRejection[]) => void;
  dropzoneOpenRef: React.RefObject<(() => void) | null>;
  display: boolean;
};
/** マップ画像のドロップゾーン */
export const MapImageDropZone: React.FC<MapImageDropZoneProps> = ({
  onDrop,
  onReject,
  dropzoneOpenRef,
  display,
}: MapImageDropZoneProps) => {
  return (
    <Dropzone
      onDrop={onDrop}
      onReject={onReject}
      openRef={dropzoneOpenRef}
      maxSize={10 * 1024 ** 2} // 10MB
      accept={IMAGE_MIME_TYPE}
      multiple={false}
      style={display ? {} : { display: "none" }}
    >
      <Group
        justify="center"
        gap="xl"
        mih={220}
        style={{ pointerEvents: "none" }}
      >
        <Dropzone.Accept>
          <IconUpload
            size={52}
            color="var(--mantine-color-blue-6)"
            stroke={1.5}
          />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <IconX size={52} color="var(--mantine-color-red-6)" stroke={1.5} />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <IconPhoto
            size={52}
            color="var(--mantine-color-dimmed)"
            stroke={1.5}
          />
        </Dropzone.Idle>

        <div>
          <Text size="xl" inline>
            マップの画像をアップロードしてください
          </Text>
          <Text size="sm" c="dimmed" inline mt={7}>
            1ファイル, 最大10MB, 拡張子はpng/jpeg/gif/webpなど
          </Text>
        </div>
      </Group>
    </Dropzone>
  );
};
