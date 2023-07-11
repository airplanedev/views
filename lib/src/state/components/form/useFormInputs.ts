import { shallowEqual } from "@mantine/hooks";
import { useContext, useMemo, useRef } from "react";

import {
  ComponentState,
  ComponentStateContext,
  InputComponentState,
} from "state/context/context";

import { FormContext, InputType } from "./FormProvider";
import { InputValues } from "./state";

/**
 * FormInputs is the global component state and type of each form input for the nearest `Form`
 * parent component.
 */
export type FormInputs = Record<
  string,
  { state: InputComponentState; type: InputType }
>;

/**
 * useFormInputStates returns the form's input data (state and type).
 */
export const useFormInputs = (): FormInputs => {
  const memoizedInputComponents = useRef<ComponentState[]>([]);
  const { formTypeByID } = useContext(FormContext);
  const componentState = useContext(ComponentStateContext);
  let inputComponents = Object.keys(formTypeByID).map(
    (id) => componentState.components[id],
  );
  if (shallowEqual(inputComponents, memoizedInputComponents.current)) {
    inputComponents = memoizedInputComponents.current;
  }
  memoizedInputComponents.current = inputComponents;
  return useMemo(() => {
    const formInputs: FormInputs = {};
    for (const component of inputComponents) {
      formInputs[component.id] = {
        state: component as InputComponentState,
        type: formTypeByID[component.id],
      };
    }
    return formInputs;
  }, [formTypeByID, inputComponents]);
};

/**
 * adaptInputDataToValues transforms the form's inputs to more user-friendly values.
 */
export const adaptInputsToValues = (formInputs: FormInputs): InputValues => {
  const values: InputValues = {};
  for (const [id, s] of Object.entries(formInputs)) {
    const { state } = s;
    values[id] = state.value;
  }
  return values;
};
