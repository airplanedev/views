// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { HeartIcon as HeroHeartIconMini } from "@heroicons/react/20/solid";
import { HeartIcon as HeroHeartIconOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeroHeartIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const HeartIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroHeartIconOutline />
      </Icon>
    );
  },
);

export const HeartIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroHeartIconSolid />
      </Icon>
    );
  },
);

export const HeartIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroHeartIconMini />
      </Icon>
    );
  },
);
