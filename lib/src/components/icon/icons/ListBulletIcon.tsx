// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { ListBulletIcon as HeroListBulletIconMini } from "@heroicons/react/20/solid";
import { ListBulletIcon as HeroListBulletIconOutline } from "@heroicons/react/24/outline";
import { ListBulletIcon as HeroListBulletIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const ListBulletIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroListBulletIconOutline />
      </Icon>
    );
  },
);

export const ListBulletIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroListBulletIconSolid />
      </Icon>
    );
  },
);

export const ListBulletIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroListBulletIconMini />
      </Icon>
    );
  },
);
