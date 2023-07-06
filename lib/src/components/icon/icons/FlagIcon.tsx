// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { FlagIcon as HeroFlagIconMini } from "@heroicons/react/20/solid";
import { FlagIcon as HeroFlagIconOutline } from "@heroicons/react/24/outline";
import { FlagIcon as HeroFlagIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const FlagIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroFlagIconOutline />
      </Icon>
    );
  },
);

export const FlagIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroFlagIconSolid />
      </Icon>
    );
  },
);

export const FlagIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroFlagIconMini />
      </Icon>
    );
  },
);
