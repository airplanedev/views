// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { UserIcon as HeroUserIconMini } from "@heroicons/react/20/solid";
import { UserIcon as HeroUserIconOutline } from "@heroicons/react/24/outline";
import { UserIcon as HeroUserIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const UserIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroUserIconOutline />
      </Icon>
    );
  },
);

export const UserIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroUserIconSolid />
      </Icon>
    );
  },
);

export const UserIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroUserIconMini />
      </Icon>
    );
  },
);
