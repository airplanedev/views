// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { UserPlusIcon as HeroUserPlusIconMini } from "@heroicons/react/20/solid";
import { UserPlusIcon as HeroUserPlusIconOutline } from "@heroicons/react/24/outline";
import { UserPlusIcon as HeroUserPlusIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const UserPlusIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroUserPlusIconOutline />
      </Icon>
    );
  },
);

export const UserPlusIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroUserPlusIconSolid />
      </Icon>
    );
  },
);

export const UserPlusIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroUserPlusIconMini />
      </Icon>
    );
  },
);
