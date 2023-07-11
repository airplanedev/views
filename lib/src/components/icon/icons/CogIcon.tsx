// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { CogIcon as HeroCogIconMini } from "@heroicons/react/20/solid";
import { CogIcon as HeroCogIconOutline } from "@heroicons/react/24/outline";
import { CogIcon as HeroCogIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const CogIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroCogIconOutline />
      </Icon>
    );
  },
);

export const CogIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroCogIconSolid />
      </Icon>
    );
  },
);

export const CogIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroCogIconMini />
      </Icon>
    );
  },
);
