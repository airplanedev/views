// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { StarIcon as HeroStarIconMini } from "@heroicons/react/20/solid";
import { StarIcon as HeroStarIconOutline } from "@heroicons/react/24/outline";
import { StarIcon as HeroStarIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const StarIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroStarIconOutline />
      </Icon>
    );
  },
);

export const StarIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroStarIconSolid />
      </Icon>
    );
  },
);

export const StarIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroStarIconMini />
      </Icon>
    );
  },
);
