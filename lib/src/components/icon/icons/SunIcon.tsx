// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { SunIcon as HeroSunIconMini } from "@heroicons/react/20/solid";
import { SunIcon as HeroSunIconOutline } from "@heroicons/react/24/outline";
import { SunIcon as HeroSunIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const SunIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroSunIconOutline />
      </Icon>
    );
  },
);

export const SunIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroSunIconSolid />
      </Icon>
    );
  },
);

export const SunIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroSunIconMini />
      </Icon>
    );
  },
);
