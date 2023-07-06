// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { SignalIcon as HeroSignalIconMini } from "@heroicons/react/20/solid";
import { SignalIcon as HeroSignalIconOutline } from "@heroicons/react/24/outline";
import { SignalIcon as HeroSignalIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const SignalIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroSignalIconOutline />
      </Icon>
    );
  },
);

export const SignalIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroSignalIconSolid />
      </Icon>
    );
  },
);

export const SignalIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroSignalIconMini />
      </Icon>
    );
  },
);
