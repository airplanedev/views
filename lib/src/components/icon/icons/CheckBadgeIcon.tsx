// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { CheckBadgeIcon as HeroCheckBadgeIconMini } from "@heroicons/react/20/solid";
import { CheckBadgeIcon as HeroCheckBadgeIconOutline } from "@heroicons/react/24/outline";
import { CheckBadgeIcon as HeroCheckBadgeIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const CheckBadgeIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroCheckBadgeIconOutline />
      </Icon>
    );
  },
);

export const CheckBadgeIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroCheckBadgeIconSolid />
      </Icon>
    );
  },
);

export const CheckBadgeIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroCheckBadgeIconMini />
      </Icon>
    );
  },
);
