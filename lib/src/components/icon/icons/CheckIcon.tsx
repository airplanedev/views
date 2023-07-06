// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { CheckIcon as HeroCheckIconMini } from "@heroicons/react/20/solid";
import { CheckIcon as HeroCheckIconOutline } from "@heroicons/react/24/outline";
import { CheckIcon as HeroCheckIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const CheckIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroCheckIconOutline />
      </Icon>
    );
  },
);

export const CheckIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroCheckIconSolid />
      </Icon>
    );
  },
);

export const CheckIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroCheckIconMini />
      </Icon>
    );
  },
);
