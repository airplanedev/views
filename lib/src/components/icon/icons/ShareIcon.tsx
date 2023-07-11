// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { ShareIcon as HeroShareIconMini } from "@heroicons/react/20/solid";
import { ShareIcon as HeroShareIconOutline } from "@heroicons/react/24/outline";
import { ShareIcon as HeroShareIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const ShareIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroShareIconOutline />
      </Icon>
    );
  },
);

export const ShareIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroShareIconSolid />
      </Icon>
    );
  },
);

export const ShareIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroShareIconMini />
      </Icon>
    );
  },
);
