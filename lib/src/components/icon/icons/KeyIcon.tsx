// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { KeyIcon as HeroKeyIconMini } from "@heroicons/react/20/solid";
import { KeyIcon as HeroKeyIconOutline } from "@heroicons/react/24/outline";
import { KeyIcon as HeroKeyIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const KeyIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroKeyIconOutline />
      </Icon>
    );
  },
);

export const KeyIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroKeyIconSolid />
      </Icon>
    );
  },
);

export const KeyIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroKeyIconMini />
      </Icon>
    );
  },
);
