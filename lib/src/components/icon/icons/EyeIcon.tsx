// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { EyeIcon as HeroEyeIconMini } from "@heroicons/react/20/solid";
import { EyeIcon as HeroEyeIconOutline } from "@heroicons/react/24/outline";
import { EyeIcon as HeroEyeIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const EyeIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroEyeIconOutline />
      </Icon>
    );
  },
);

export const EyeIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroEyeIconSolid />
      </Icon>
    );
  },
);

export const EyeIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroEyeIconMini />
      </Icon>
    );
  },
);
