// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { MoonIcon as HeroMoonIconMini } from "@heroicons/react/20/solid";
import { MoonIcon as HeroMoonIconOutline } from "@heroicons/react/24/outline";
import { MoonIcon as HeroMoonIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const MoonIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroMoonIconOutline />
      </Icon>
    );
  },
);

export const MoonIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroMoonIconSolid />
      </Icon>
    );
  },
);

export const MoonIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroMoonIconMini />
      </Icon>
    );
  },
);
