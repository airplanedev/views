// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { ServerIcon as HeroServerIconMini } from "@heroicons/react/20/solid";
import { ServerIcon as HeroServerIconOutline } from "@heroicons/react/24/outline";
import { ServerIcon as HeroServerIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const ServerIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroServerIconOutline />
      </Icon>
    );
  },
);

export const ServerIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroServerIconSolid />
      </Icon>
    );
  },
);

export const ServerIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroServerIconMini />
      </Icon>
    );
  },
);
