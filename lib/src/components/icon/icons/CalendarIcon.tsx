// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { CalendarIcon as HeroCalendarIconMini } from "@heroicons/react/20/solid";
import { CalendarIcon as HeroCalendarIconOutline } from "@heroicons/react/24/outline";
import { CalendarIcon as HeroCalendarIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const CalendarIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroCalendarIconOutline />
      </Icon>
    );
  },
);

export const CalendarIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroCalendarIconSolid />
      </Icon>
    );
  },
);

export const CalendarIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroCalendarIconMini />
      </Icon>
    );
  },
);
