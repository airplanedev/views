// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { UserCircleIcon as HeroUserCircleIconMini } from "@heroicons/react/20/solid";
import { UserCircleIcon as HeroUserCircleIconOutline } from "@heroicons/react/24/outline";
import { UserCircleIcon as HeroUserCircleIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const UserCircleIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroUserCircleIconOutline />
      </Icon>
    );
  },
);

export const UserCircleIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroUserCircleIconSolid />
      </Icon>
    );
  },
);

export const UserCircleIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroUserCircleIconMini />
      </Icon>
    );
  },
);
