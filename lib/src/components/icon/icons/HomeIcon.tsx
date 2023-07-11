// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { HomeIcon as HeroHomeIconMini } from "@heroicons/react/20/solid";
import { HomeIcon as HeroHomeIconOutline } from "@heroicons/react/24/outline";
import { HomeIcon as HeroHomeIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const HomeIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroHomeIconOutline />
      </Icon>
    );
  },
);

export const HomeIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroHomeIconSolid />
      </Icon>
    );
  },
);

export const HomeIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroHomeIconMini />
      </Icon>
    );
  },
);
