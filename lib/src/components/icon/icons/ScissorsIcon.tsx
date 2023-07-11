// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { ScissorsIcon as HeroScissorsIconMini } from "@heroicons/react/20/solid";
import { ScissorsIcon as HeroScissorsIconOutline } from "@heroicons/react/24/outline";
import { ScissorsIcon as HeroScissorsIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const ScissorsIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroScissorsIconOutline />
      </Icon>
    );
  },
);

export const ScissorsIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroScissorsIconSolid />
      </Icon>
    );
  },
);

export const ScissorsIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroScissorsIconMini />
      </Icon>
    );
  },
);
