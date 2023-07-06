// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { BellIcon as HeroBellIconMini } from "@heroicons/react/20/solid";
import { BellIcon as HeroBellIconOutline } from "@heroicons/react/24/outline";
import { BellIcon as HeroBellIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const BellIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroBellIconOutline />
      </Icon>
    );
  },
);

export const BellIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroBellIconSolid />
      </Icon>
    );
  },
);

export const BellIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroBellIconMini />
      </Icon>
    );
  },
);
