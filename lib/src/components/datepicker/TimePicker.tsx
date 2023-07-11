import { createStyles } from "@mantine/core";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

import { Button } from "components/button/Button";
import { ChevronDownIconSolid, ChevronUpIconSolid } from "components/icon";
import { Stack } from "components/stack/Stack";
import { Text } from "components/text/Text";
import { TextInput } from "components/textinput/TextInput";

export const useStyles = createStyles((theme) => ({
  AMPMButton: {
    border: theme.other.borderStyles.default,
    "&:disabled": {
      backgroundColor: theme.colors.gray[1],
      color: theme.colors.gray[4],
      border: theme.other.borderStyles.light,
    },
  },
}));

const IncDec = (props: {
  disabled?: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isInc: boolean;
  compact?: boolean;
  byFive?: boolean;
}) => (
  <Button
    variant="subtle"
    compact={props.compact}
    disabled={props.disabled}
    onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) => e.preventDefault()}
    onClick={props.onClick}
  >
    {props.isInc ? (
      props.compact ? (
        props.byFive ? (
          <Text color="gray.4" size="sm" disableMarkdown>
            +5
          </Text>
        ) : (
          <Text color="gray.4" size="lg" disableMarkdown>
            +
          </Text>
        )
      ) : (
        <ChevronUpIconSolid color="gray" />
      )
    ) : props.compact ? (
      props.byFive ? (
        <Text color="gray.4" size="sm" disableMarkdown>
          -5
        </Text>
      ) : (
        <Text color="gray.4" size="lg" disableMarkdown>
          -
        </Text>
      )
    ) : (
      <ChevronDownIconSolid color="gray" />
    )}
  </Button>
);

const mod = (n: number, m: number) => ((n % m) + m) % m;

/**
 * TimeInput is a component that:
 * 1. Accepts user input in the form of a numeric value of: [min, max] | ""
 * 2. Can be incremented/decremented via buttons.
 * 3. Increment and decrement operations can cause the value to "cycle" around.
 * 4. The number is always "capped" to the range.
 * 5. The value from #1 is passed up through onChange when valid.
 * 6. If the parent value changes, the local value is updated.
 * 7. As the users types, len(input) is capped to digits by dropping leading digits.
 * 8. On blur, pad digits.
 */
const TimeInput = ({
  readOnly,
  min,
  max,
  preventFocus,
  ...props
}: {
  value: number | undefined;
  readOnly?: boolean;
  min: number;
  max: number;
  incByFive?: boolean;
  preventFocus: boolean;
  onChange: (value: number) => void;
}) => {
  const base = max - min + 1; // number of valid digits
  const def = mod(-min, base) + min; // the default value after the input is cleared
  const digits = 2; // hardcoded for now, since we only support hours/minutes
  const increment = props.incByFive ? 5 : 1;

  const pad = (n: number) => String(n).padStart(digits, "0");

  const [value, setValue] = useState(props.value);
  const [raw, setRaw] = useState(pad(value ?? def));

  useEffect(() => {
    if (props.value !== value) {
      setRaw(pad(props.value ?? min));
      setValue(props.value);
    }
  }, [props.value, value, min]);

  const onChange = (value: number | undefined) => {
    setValue(value);
    if (value !== undefined && value >= min && value <= max) {
      props.onChange(value);
    }
  };

  const onBlur = () => {
    let v = value;
    if (v === undefined) {
      v = def;
    } else if (v < min) {
      v = min;
    } else if (v > max) {
      v = max;
    }
    setRaw(pad(v));
    onChange(v);
  };

  return (
    <Stack spacing={preventFocus ? 0 : "xs"} align="center">
      <IncDec
        isInc
        disabled={readOnly}
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          const v =
            mod((value === undefined ? def : value) - min + increment, base) +
            min;
          setRaw(pad(v));
          onChange(v);
        }}
        byFive={props.incByFive}
        compact={preventFocus}
      />
      {preventFocus ? (
        <Text
          size="xl"
          onMouseDown={preventFocus ? (e) => e.preventDefault() : undefined}
          sx={{ margin: 10, minWidth: "3ch", textAlign: "center" }}
          weight="bold"
        >
          {raw}
        </Text>
      ) : (
        <TextInput
          value={raw}
          disabled={readOnly}
          size="lg"
          sx={{ width: 60 }}
          onBlur={onBlur}
          onMouseDown={preventFocus ? (e) => e.preventDefault() : undefined}
          onChange={(e) => {
            // Only allow numbers
            let v = e.target.value.replace(/[^0-9]/g, "");
            // As a user types in numbers, replace the current numbers
            v = v.substring(Math.max(0, v.length - digits));

            setRaw(v);
            onChange(v == "" ? undefined : Number(v));
          }}
        />
      )}
      <IncDec
        isInc={false}
        disabled={readOnly}
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          const v =
            mod((value === undefined ? def : value) - min - increment, base) +
            min;
          setRaw(pad(v));
          onChange(v);
        }}
        byFive={props.incByFive}
        compact={preventFocus}
      />
    </Stack>
  );
};

export const TimePicker = (props: {
  renderText: string;
  value: dayjs.Dayjs | undefined;
  onChange: (d: dayjs.Dayjs | undefined) => void;
  readOnly?: boolean;
}) => {
  const hour = props.value ? mod(props.value.hour() - 1, 12) + 1 : undefined;
  const isAM = props.value && props.value.hour() < 12;
  const readOnly = props.readOnly;

  const { classes } = useStyles();

  return (
    <Stack direction="row" spacing="sm" align="center">
      <TimeInput
        value={hour}
        readOnly={readOnly}
        onChange={(value) => {
          props.onChange(
            props.value?.set("hours", (isAM ? 0 : 12) + mod(value, 12)),
          );
        }}
        preventFocus
        min={1}
        max={12}
      />
      <Text size="xl">:</Text>
      <TimeInput
        value={props.value?.minute()}
        readOnly={readOnly}
        onChange={(value) => {
          props.onChange(props.value?.set("minutes", mod(value, 60)));
        }}
        preventFocus
        incByFive
        min={0}
        max={59}
      />
      <Button
        size="xs"
        variant="outline"
        color="gray"
        disabled={readOnly}
        onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) =>
          e.preventDefault()
        }
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          props.onChange(
            props.value?.set(
              "hours",
              isAM ? props.value.hour() + 12 : props.value.hour() - 12,
            ),
          );
        }}
        className={classes.AMPMButton}
      >
        {isAM ? "AM" : "PM"}
      </Button>
    </Stack>
  );
};
