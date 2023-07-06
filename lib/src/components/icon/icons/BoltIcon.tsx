// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { BoltIcon as HeroBoltIconMini } from "@heroicons/react/20/solid";
import { BoltIcon as HeroBoltIconOutline } from "@heroicons/react/24/outline";
import { BoltIcon as HeroBoltIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const BoltIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroBoltIconOutline />
      </Icon>
    );
  },
);

export const BoltIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroBoltIconSolid />
      </Icon>
    );
  },
);

export const BoltIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroBoltIconMini />
      </Icon>
    );
  },
);
