// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { HandRaisedIcon as HeroHandRaisedIconMini } from "@heroicons/react/20/solid";
import { HandRaisedIcon as HeroHandRaisedIconOutline } from "@heroicons/react/24/outline";
import { HandRaisedIcon as HeroHandRaisedIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const HandRaisedIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroHandRaisedIconOutline />
      </Icon>
    );
  },
);

export const HandRaisedIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroHandRaisedIconSolid />
      </Icon>
    );
  },
);

export const HandRaisedIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroHandRaisedIconMini />
      </Icon>
    );
  },
);
