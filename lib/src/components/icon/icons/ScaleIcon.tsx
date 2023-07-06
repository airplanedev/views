// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { ScaleIcon as HeroScaleIconMini } from "@heroicons/react/20/solid";
import { ScaleIcon as HeroScaleIconOutline } from "@heroicons/react/24/outline";
import { ScaleIcon as HeroScaleIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const ScaleIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroScaleIconOutline />
      </Icon>
    );
  },
);

export const ScaleIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroScaleIconSolid />
      </Icon>
    );
  },
);

export const ScaleIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroScaleIconMini />
      </Icon>
    );
  },
);
