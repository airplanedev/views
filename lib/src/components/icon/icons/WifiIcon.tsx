// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { WifiIcon as HeroWifiIconMini } from "@heroicons/react/20/solid";
import { WifiIcon as HeroWifiIconOutline } from "@heroicons/react/24/outline";
import { WifiIcon as HeroWifiIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const WifiIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroWifiIconOutline />
      </Icon>
    );
  },
);

export const WifiIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroWifiIconSolid />
      </Icon>
    );
  },
);

export const WifiIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroWifiIconMini />
      </Icon>
    );
  },
);
