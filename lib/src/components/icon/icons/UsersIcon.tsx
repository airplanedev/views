// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { UsersIcon as HeroUsersIconMini } from "@heroicons/react/20/solid";
import { UsersIcon as HeroUsersIconOutline } from "@heroicons/react/24/outline";
import { UsersIcon as HeroUsersIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const UsersIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroUsersIconOutline />
      </Icon>
    );
  },
);

export const UsersIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroUsersIconSolid />
      </Icon>
    );
  },
);

export const UsersIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroUsersIconMini />
      </Icon>
    );
  },
);
