// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { CubeIcon as HeroCubeIconMini } from "@heroicons/react/20/solid";
import { CubeIcon as HeroCubeIconOutline } from "@heroicons/react/24/outline";
import { CubeIcon as HeroCubeIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const CubeIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroCubeIconOutline />
      </Icon>
    );
  },
);

export const CubeIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroCubeIconSolid />
      </Icon>
    );
  },
);

export const CubeIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroCubeIconMini />
      </Icon>
    );
  },
);
