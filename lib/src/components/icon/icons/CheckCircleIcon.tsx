// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { CheckCircleIcon as HeroCheckCircleIconMini } from "@heroicons/react/20/solid";
import { CheckCircleIcon as HeroCheckCircleIconOutline } from "@heroicons/react/24/outline";
import { CheckCircleIcon as HeroCheckCircleIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const CheckCircleIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroCheckCircleIconOutline />
      </Icon>
    );
  },
);

export const CheckCircleIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroCheckCircleIconSolid />
      </Icon>
    );
  },
);

export const CheckCircleIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroCheckCircleIconMini />
      </Icon>
    );
  },
);
