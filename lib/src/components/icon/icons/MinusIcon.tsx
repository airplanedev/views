// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { MinusIcon as HeroMinusIconMini } from "@heroicons/react/20/solid";
import { MinusIcon as HeroMinusIconOutline } from "@heroicons/react/24/outline";
import { MinusIcon as HeroMinusIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const MinusIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroMinusIconOutline />
      </Icon>
    );
  },
);

export const MinusIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroMinusIconSolid />
      </Icon>
    );
  },
);

export const MinusIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroMinusIconMini />
      </Icon>
    );
  },
);
