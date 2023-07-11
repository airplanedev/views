// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { TagIcon as HeroTagIconMini } from "@heroicons/react/20/solid";
import { TagIcon as HeroTagIconOutline } from "@heroicons/react/24/outline";
import { TagIcon as HeroTagIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const TagIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroTagIconOutline />
      </Icon>
    );
  },
);

export const TagIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroTagIconSolid />
      </Icon>
    );
  },
);

export const TagIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroTagIconMini />
      </Icon>
    );
  },
);
