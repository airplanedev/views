// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { ClockIcon as HeroClockIconMini } from "@heroicons/react/20/solid";
import { ClockIcon as HeroClockIconOutline } from "@heroicons/react/24/outline";
import { ClockIcon as HeroClockIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const ClockIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroClockIconOutline />
      </Icon>
    );
  },
);

export const ClockIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroClockIconSolid />
      </Icon>
    );
  },
);

export const ClockIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroClockIconMini />
      </Icon>
    );
  },
);
