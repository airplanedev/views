import {
  Slider as MantineSlider,
  createStyles,
  Input as MantineInput,
} from "@mantine/core";
import { forwardRef } from "react";

import { ComponentErrorBoundary } from "components/errorBoundary/ComponentErrorBoundary";
import { useCommonLayoutStyle } from "components/layout/useCommonLayoutStyle";
import { useRegisterFormInput } from "state/components/form/useRegisterFormInput";
import { useInput } from "state/components/input/useInput";
import { useSliderState } from "state/components/number-input";
import { useComponentId } from "state/components/useId";

import { SliderComponentProps, SliderProps } from "./Slider.types";

const DEFAULT_MIN = 0;
const DEFAULT_MAX = 100;
const DEFAULT_STEP = 1;
const DEFAULT_SIZE = "md";

type StyleParams = {
  hasMarks: boolean;
  hasLabel: boolean;
};

export const useStyles = createStyles((theme, params: StyleParams) => ({
  // TODO: replace with new spacing scale
  slider: {
    height: 36,
    paddingTop: 12,
    paddingBottom: params.hasMarks ? 24 : params.hasLabel ? 18 : 12,
  },
  markLabel: { fontSize: theme.fontSizes.xs },
  label: {
    paddingLeft: theme.spacing.xs,
    paddingRight: theme.spacing.xs,
    // TODO: replace with new spacing scale
    top: params.hasMarks ? -32 : -34,
  },
}));

/** Presentational slider component */
export const SliderComponent = forwardRef(
  (
    {
      valueLabelDisplay = "auto",
      min = DEFAULT_MIN,
      max = DEFAULT_MAX,
      step = DEFAULT_STEP,
      size = DEFAULT_SIZE,
      label,
      error,
      valueLabel,
      className,
      style,
      width,
      height,
      grow,
      ...props
    }: SliderComponentProps & {
      required?: boolean;
    },
    ref: React.Ref<HTMLInputElement>
  ) => {
    const { classes } = useStyles({
      hasMarks: props.marks !== undefined,
      hasLabel: label !== undefined,
    });
    const { classes: layoutClasses, cx } = useCommonLayoutStyle({
      width,
      height,
      grow,
    });

    return (
      <MantineInput.Wrapper
        id="slider"
        label={label}
        withAsterisk={props.required}
        error={error}
        className={layoutClasses.style}
      >
        <MantineSlider
          className={cx(classes.slider, className)}
          style={style}
          classNames={{ markLabel: classes.markLabel, label: classes.label }}
          min={min}
          max={max}
          step={step}
          size={size}
          label={valueLabelDisplay === "off" ? null : valueLabel}
          labelAlwaysOn={valueLabelDisplay === "on"}
          {...props}
          ref={ref}
        />
      </MantineInput.Wrapper>
    );
  }
);

export const Slider = forwardRef(
  (props: SliderProps, ref: React.Ref<HTMLInputElement>) => (
    <ComponentErrorBoundary componentName={DISPLAY_NAME}>
      <SliderWithoutRef {...props} innerRef={ref} />
    </ComponentErrorBoundary>
  )
);

export const SliderWithoutRef = (
  props: SliderProps & { innerRef: React.Ref<HTMLInputElement> }
) => {
  const id = useComponentId(props.id);
  const { state, dispatch } = useSliderState(id, {
    initialState: {
      disabled: props.disabled ?? props.defaultDisabled,
      // Default the initial value to the minimum if no default value is provided so reset works
      value: props.value ?? props.defaultValue ?? props.min ?? DEFAULT_MIN,
    },
    focus,
    min: props.min ?? DEFAULT_MIN,
    max: props.max ?? DEFAULT_MAX,
  });
  const { inputProps } = useInput(props, state, dispatch, (v) => v);

  useRegisterFormInput(id, "slider");

  const {
    innerRef: _,
    validate: __,
    onChange: ___,
    defaultDisabled: ____,
    defaultValue: _____,
    ...restProps
  } = props;
  return (
    <SliderComponent ref={props.innerRef} {...inputProps} {...restProps} />
  );
};

SliderComponent.displayName = "SliderComponent";
const DISPLAY_NAME = "Slider";
Slider.displayName = DISPLAY_NAME;
