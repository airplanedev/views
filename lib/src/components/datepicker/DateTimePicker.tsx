import { createStyles } from "@mantine/core";
import { Calendar, DatePickerBase } from "@mantine/dates";
import { useUncontrolled } from "@mantine/hooks";
import dayjs from "dayjs";
import { forwardRef, Ref, useEffect, useState } from "react";

import { Divider } from "components/divider/Divider";
import { ComponentErrorBoundary } from "components/errorBoundary/ComponentErrorBoundary";
import { useCommonLayoutStyle } from "components/layout/useCommonLayoutStyle";
import { Stack } from "components/stack/Stack";
import { useDateTimePickerState } from "state/components/datepicker/useDatePickerState";
import { useRegisterFormInput } from "state/components/form/useRegisterFormInput";
import { useInput } from "state/components/input/useInput";
import { useComponentId } from "state/components/useId";

import {
  DateTimePickerProps,
  DateTimePickerComponentProps,
} from "./DatePicker.types";
import { TimePicker } from "./TimePicker";

const useStyles = createStyles((theme) => {
  return {
    weekend: {
      color: `${theme.colors.dark[6]} !important`,
    },
    selected: {
      background: `${theme.colors.primary[5]} !important`,
    },
  };
});

export const DateTimePickerComponent = forwardRef(
  (
    {
      value,
      size = "sm",
      onChange,
      width,
      height,
      grow,
      className,
      style,
      initiallyOpened = false,
      excludeDate,
      clearable = false,
      onDropdownClose,
      ...props
    }: DateTimePickerComponentProps,
    ref: Ref<HTMLInputElement>
  ) => {
    // Logic adapted from Mantine, and modified to include TimePicker.
    const { classes, cx } = useStyles();
    const { classes: layoutClasses } = useCommonLayoutStyle({
      width,
      height,
      grow,
    });
    const [opened, setOpened] = useState(initiallyOpened);
    const onChangeWrapper =
      onChange &&
      ((d: Date | null) => {
        if (d === null) {
          onChange(undefined);
        } else {
          onChange(d);
        }
      });
    const [_value, setValue] = useUncontrolled<Date | null>({
      value: value || null,
      finalValue: null,
      onChange: onChangeWrapper,
    });
    const [calendarMonth, setCalendarMonth] = useState(_value || new Date());
    const [focused, setFocused] = useState(false);
    const [inputState, setInputState] = useState(
      _value ? formatDatetime(_value) : ""
    );
    const closeDropdown = () => {
      setOpened(false);
      onDropdownClose?.();
    };

    // Needed for useComponentState to work. However, we don't apply
    // the change if there is focus in order to ensure free input works.
    useEffect(() => {
      if (!focused) {
        setInputState(value ? formatDatetime(value) : "");
      }
    }, [value, focused]);

    const onChangeCalendar = (date: Date) => {
      if (value) {
        date.setHours(value.getHours());
        date.setMinutes(value.getMinutes());
      }
      setValue(date);
      setInputState(formatDatetime(date));
    };

    const onChangeTimePicker = (dj: dayjs.Dayjs | undefined) => {
      if (dj === undefined) {
        onChange?.(undefined);
      } else {
        const d = dj.toDate();
        setInputState(formatDatetime(d));
        onChange?.(d);
      }
    };

    const setDateFromInput = () => {
      const date =
        typeof inputState === "string" ? parseDate(inputState) : inputState;

      if (dayjs(date).isValid()) {
        setValue(date);
        setCalendarMonth(date as Date);
      }
    };

    return (
      <DatePickerBase
        ref={ref}
        allowFreeInput
        className={cx(layoutClasses.style, className)}
        style={style}
        dropdownOpened={opened}
        setDropdownOpened={(b) => {
          if (b) {
            setOpened(true);
          } else {
            closeDropdown();
          }
        }}
        onChange={(e) => {
          setOpened(true);
          const date = parseDate(e.target.value);
          if (dayjs(date).isValid()) {
            setValue(date);
            setCalendarMonth(date);
          }
          setInputState(e.target.value);
        }}
        onClear={() => {
          setValue(null);
          setInputState("");
        }}
        onBlur={(e) => {
          setFocused(false);
          setDateFromInput();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            closeDropdown();
            setDateFromInput();
          }
        }}
        onFocus={(e) => {
          setFocused(true);
        }}
        inputLabel={inputState}
        clearButtonLabel="clear"
        clearable={clearable}
        size={size}
        {...props}
      >
        <Stack direction="row" align="center">
          <Calendar
            month={calendarMonth}
            onMonthChange={setCalendarMonth}
            value={_value || dayjs().toDate()}
            onChange={onChangeCalendar}
            size={size === "lg" || size === "xl" ? "md" : "sm"}
            excludeDate={excludeDate}
            preventFocus
            dayClassName={(date, modifiers) =>
              cx({
                [classes.weekend]:
                  modifiers.weekend &&
                  !modifiers.outside &&
                  !modifiers.selected &&
                  !modifiers.disabled,
                [classes.selected]: modifiers.selected,
              })
            }
          />
          <Divider
            orientation="vertical"
            color="gray.3"
            sx={{ height: "300px" }}
          />
          <TimePicker
            renderText="pick"
            value={value ? dayjs(value) : dayjs().startOf("d")}
            onChange={onChangeTimePicker}
          />
        </Stack>
      </DatePickerBase>
    );
  }
);
DateTimePickerComponent.displayName = "DateTimePickerComponent";

export const DateTimePicker = forwardRef(
  (props: DateTimePickerProps, ref: Ref<HTMLInputElement>) => {
    return (
      <ComponentErrorBoundary componentName={DISPLAY_NAME}>
        <DateTimePickerWithoutRef {...props} innerRef={ref} />
      </ComponentErrorBoundary>
    );
  }
);
const DISPLAY_NAME = "DateTimePicker";
DateTimePicker.displayName = DISPLAY_NAME;

export const DateTimePickerWithoutRef = (
  props: DateTimePickerProps & { innerRef: Ref<HTMLInputElement> }
) => {
  const id = useComponentId(props.id);
  const { state, dispatch } = useDateTimePickerState(id, {
    initialState: {
      disabled: props.disabled ?? props.defaultDisabled,
      value: props.value ?? props.defaultValue,
    },
  });
  const { inputProps } = useInput(props, state, dispatch, (v) => v);
  useRegisterFormInput(id, "date-picker");

  const {
    innerRef,
    validate: _,
    onChange: __,
    defaultDisabled: ___,
    defaultValue: ____,
    ...restProps
  } = props;
  return (
    <DateTimePickerComponent ref={innerRef} {...inputProps} {...restProps} />
  );
};

const DATETIME_FORMAT = "MMM D, YYYY h:mm A";

export const formatDatetime = (date: Date | string): string => {
  return dayjs(date).format(DATETIME_FORMAT);
};

const parseDate = (date: string) => dayjs(date, DATETIME_FORMAT).toDate();
