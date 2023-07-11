// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { ForwardIcon as HeroForwardIconMini } from "@heroicons/react/20/solid";
import { ForwardIcon as HeroForwardIconOutline } from "@heroicons/react/24/outline";
import { ForwardIcon as HeroForwardIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const ForwardIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroForwardIconOutline />
      </Icon>
    );
  },
);

export const ForwardIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroForwardIconSolid />
      </Icon>
    );
  },
);

export const ForwardIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroForwardIconMini />
      </Icon>
    );
  },
);
