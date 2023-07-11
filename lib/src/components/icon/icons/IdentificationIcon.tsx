// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { IdentificationIcon as HeroIdentificationIconMini } from "@heroicons/react/20/solid";
import { IdentificationIcon as HeroIdentificationIconOutline } from "@heroicons/react/24/outline";
import { IdentificationIcon as HeroIdentificationIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const IdentificationIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroIdentificationIconOutline />
      </Icon>
    );
  },
);

export const IdentificationIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroIdentificationIconSolid />
      </Icon>
    );
  },
);

export const IdentificationIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroIdentificationIconMini />
      </Icon>
    );
  },
);
