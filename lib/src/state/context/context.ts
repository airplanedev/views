import { createContext, useContext, useEffect } from "react";

import { DefaultBooleanState, BooleanState } from "../components/boolean/state";
import { DefaultButtonState, ButtonState } from "../components/button/state";
import { DefaultChartState, ChartState } from "../components/chart/state";
import {
  DatePickerState,
  DefaultDatePickerState,
} from "../components/datepicker/state";
import { DialogState, DefaultDialogState } from "../components/dialog/state";
import {
  FileInputState,
  DefaultFileInputState,
} from "../components/file-input/state";
import { DefaultFormState, FormState } from "../components/form/state";
import {
  DefaultMultiSelectState,
  MultiSelectState,
} from "../components/multiselect/state";
import {
  DefaultNumberInputState,
  NumberInputState,
} from "../components/number-input/state";
import {
  DefaultRadioGroupState,
  RadioGroupState,
} from "../components/radio-group/state";
import { DefaultSelectState, SelectState } from "../components/select/state";
import { DefaultTableState, TableState } from "../components/table/state";
import { DefaultTabsState, TabsState } from "../components/tabs/state";
import {
  DefaultTextInputState,
  TextInputState,
} from "../components/text-input/state";

// Human-readable names for all components with state
export enum ComponentType {
  Table = "Table",
  NumberInput = "NumberInput",
  Slider = "Slider",
  TextInput = "TextInput",
  Textarea = "Textarea",
  CodeInput = "CodeInput",
  Select = "Select",
  MultiSelect = "MultiSelect",
  Button = "Button",
  DatePicker = "DatePicker",
  DateTimePicker = "DateTimePicker",
  FileInput = "FileInput",
  Dialog = "Dialog",
  Form = "Form",
  RadioGroup = "RadioGroup",
  Chart = "Chart",
  Tabs = "Tabs",
  Checkbox = "Checkbox",
  Switch = "Switch",
}

export type ComponentState =
  | TableState
  | NumberInputState
  | TextInputState
  | SelectState
  | MultiSelectState
  | BooleanState
  | ButtonState
  | DialogState
  | DatePickerState
  | FileInputState
  | FormState
  | RadioGroupState
  | ChartState
  | TabsState;

export type InputComponentState =
  | SelectState
  | MultiSelectState
  | BooleanState
  | NumberInputState
  | TextInputState
  | DatePickerState
  | FileInputState
  | RadioGroupState;

export const DefaultComponentState = {
  ...DefaultTableState,
  ...DefaultNumberInputState,
  ...DefaultTextInputState,
  ...DefaultSelectState,
  ...DefaultMultiSelectState,
  ...DefaultBooleanState,
  ...DefaultButtonState,
  ...DefaultDatePickerState,
  ...DefaultFileInputState,
  ...DefaultDialogState,
  ...DefaultFormState,
  ...DefaultRadioGroupState,
  ...DefaultChartState,
  ...DefaultTabsState,
};

export type ComponentStateContextType = {
  components: Record<string, ComponentState>;
  updateComponent: <TState extends ComponentState>(
    id: string,
    state: TState,
  ) => void;
  removeComponent: (id: string) => void;
};

const defaultContext: ComponentStateContextType = {
  components: {},
  updateComponent: () => {
    // Unimplemented
  },
  removeComponent: () => {
    // Unimplemented
  },
};

export const ComponentStateContext =
  createContext<ComponentStateContextType>(defaultContext);

/**
 * useSyncComponentState keeps component state in sync with the global component state store
 */
export const useSyncComponentState = <TState extends ComponentState>(
  id: string,
  state: TState,
) => {
  const { updateComponent, removeComponent } = useContext(
    ComponentStateContext,
  );
  useEffect(() => {
    updateComponent<TState>(id, state);
  }, [updateComponent, id, state]);

  useEffect(() => {
    return () => removeComponent(id);
  }, [removeComponent, id]);
};
