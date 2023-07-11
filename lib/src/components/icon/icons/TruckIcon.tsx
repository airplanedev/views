// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { TruckIcon as HeroTruckIconMini } from "@heroicons/react/20/solid";
import { TruckIcon as HeroTruckIconOutline } from "@heroicons/react/24/outline";
import { TruckIcon as HeroTruckIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const TruckIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroTruckIconOutline />
      </Icon>
    );
  },
);

export const TruckIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroTruckIconSolid />
      </Icon>
    );
  },
);

export const TruckIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroTruckIconMini />
      </Icon>
    );
  },
);
