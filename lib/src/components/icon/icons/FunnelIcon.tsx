// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { FunnelIcon as HeroFunnelIconMini } from "@heroicons/react/20/solid";
import { FunnelIcon as HeroFunnelIconOutline } from "@heroicons/react/24/outline";
import { FunnelIcon as HeroFunnelIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const FunnelIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroFunnelIconOutline />
      </Icon>
    );
  },
);

export const FunnelIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroFunnelIconSolid />
      </Icon>
    );
  },
);

export const FunnelIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroFunnelIconMini />
      </Icon>
    );
  },
);
