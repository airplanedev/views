// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { SwatchIcon as HeroSwatchIconMini } from "@heroicons/react/20/solid";
import { SwatchIcon as HeroSwatchIconOutline } from "@heroicons/react/24/outline";
import { SwatchIcon as HeroSwatchIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const SwatchIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroSwatchIconOutline />
      </Icon>
    );
  },
);

export const SwatchIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroSwatchIconSolid />
      </Icon>
    );
  },
);

export const SwatchIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroSwatchIconMini />
      </Icon>
    );
  },
);
