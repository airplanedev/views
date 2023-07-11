// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { PauseIcon as HeroPauseIconMini } from "@heroicons/react/20/solid";
import { PauseIcon as HeroPauseIconOutline } from "@heroicons/react/24/outline";
import { PauseIcon as HeroPauseIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const PauseIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroPauseIconOutline />
      </Icon>
    );
  },
);

export const PauseIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroPauseIconSolid />
      </Icon>
    );
  },
);

export const PauseIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroPauseIconMini />
      </Icon>
    );
  },
);
