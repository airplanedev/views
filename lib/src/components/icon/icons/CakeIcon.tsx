// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { CakeIcon as HeroCakeIconMini } from "@heroicons/react/20/solid";
import { CakeIcon as HeroCakeIconOutline } from "@heroicons/react/24/outline";
import { CakeIcon as HeroCakeIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const CakeIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroCakeIconOutline />
      </Icon>
    );
  },
);

export const CakeIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroCakeIconSolid />
      </Icon>
    );
  },
);

export const CakeIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroCakeIconMini />
      </Icon>
    );
  },
);
