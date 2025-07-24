import { Select, Tooltip } from "@mantine/core";

type SizeSelectorProps = {
  label?: string;
  value: string;
  tooltip?: string;
  onChange: (value: string | null) => void;
};

export const SizeSelector: React.FC<SizeSelectorProps> = ({
  label,
  value = "xs",
  tooltip,
  onChange,
}) => {
  const dataset = [
    { label: "大", value: "xl" },
    { label: "中", value: "md" },
    { label: "小", value: "xs" },
  ];

  return (
    <>
      {tooltip ? (
        <Tooltip label={tooltip}>
          <Select
            w={70}
            label={label}
            value={value}
            data={dataset}
            onChange={onChange}
          />
        </Tooltip>
      ) : (
        <Select
          w={70}
          label={label}
          value={value}
          data={dataset}
          onChange={onChange}
        />
      )}
    </>
  );
};
