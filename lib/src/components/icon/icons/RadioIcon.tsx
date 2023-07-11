// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { RadioIcon as HeroRadioIconMini } from "@heroicons/react/20/solid";
import { RadioIcon as HeroRadioIconOutline } from "@heroicons/react/24/outline";
import { RadioIcon as HeroRadioIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const RadioIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroRadioIconOutline />
      </Icon>
    );
  },
);

export const RadioIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroRadioIconSolid />
      </Icon>
    );
  },
);

export const RadioIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroRadioIconMini />
      </Icon>
    );
  },
);
