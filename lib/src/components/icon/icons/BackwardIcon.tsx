// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { BackwardIcon as HeroBackwardIconMini } from "@heroicons/react/20/solid";
import { BackwardIcon as HeroBackwardIconOutline } from "@heroicons/react/24/outline";
import { BackwardIcon as HeroBackwardIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const BackwardIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroBackwardIconOutline />
      </Icon>
    );
  },
);

export const BackwardIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroBackwardIconSolid />
      </Icon>
    );
  },
);

export const BackwardIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroBackwardIconMini />
      </Icon>
    );
  },
);
