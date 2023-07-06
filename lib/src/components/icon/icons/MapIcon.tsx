// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { MapIcon as HeroMapIconMini } from "@heroicons/react/20/solid";
import { MapIcon as HeroMapIconOutline } from "@heroicons/react/24/outline";
import { MapIcon as HeroMapIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const MapIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroMapIconOutline />
      </Icon>
    );
  },
);

export const MapIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroMapIconSolid />
      </Icon>
    );
  },
);

export const MapIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroMapIconMini />
      </Icon>
    );
  },
);
