// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { AtSymbolIcon as HeroAtSymbolIconMini } from "@heroicons/react/20/solid";
import { AtSymbolIcon as HeroAtSymbolIconOutline } from "@heroicons/react/24/outline";
import { AtSymbolIcon as HeroAtSymbolIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const AtSymbolIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroAtSymbolIconOutline />
      </Icon>
    );
  },
);

export const AtSymbolIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroAtSymbolIconSolid />
      </Icon>
    );
  },
);

export const AtSymbolIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroAtSymbolIconMini />
      </Icon>
    );
  },
);
