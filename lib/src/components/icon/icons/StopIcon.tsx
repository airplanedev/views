// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { StopIcon as HeroStopIconMini } from "@heroicons/react/20/solid";
import { StopIcon as HeroStopIconOutline } from "@heroicons/react/24/outline";
import { StopIcon as HeroStopIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const StopIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroStopIconOutline />
      </Icon>
    );
  },
);

export const StopIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroStopIconSolid />
      </Icon>
    );
  },
);

export const StopIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroStopIconMini />
      </Icon>
    );
  },
);
