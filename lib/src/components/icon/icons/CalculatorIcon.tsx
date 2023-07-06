// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { CalculatorIcon as HeroCalculatorIconMini } from "@heroicons/react/20/solid";
import { CalculatorIcon as HeroCalculatorIconOutline } from "@heroicons/react/24/outline";
import { CalculatorIcon as HeroCalculatorIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const CalculatorIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroCalculatorIconOutline />
      </Icon>
    );
  },
);

export const CalculatorIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroCalculatorIconSolid />
      </Icon>
    );
  },
);

export const CalculatorIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroCalculatorIconMini />
      </Icon>
    );
  },
);
