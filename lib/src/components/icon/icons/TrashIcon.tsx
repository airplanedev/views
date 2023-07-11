// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { TrashIcon as HeroTrashIconMini } from "@heroicons/react/20/solid";
import { TrashIcon as HeroTrashIconOutline } from "@heroicons/react/24/outline";
import { TrashIcon as HeroTrashIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const TrashIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroTrashIconOutline />
      </Icon>
    );
  },
);

export const TrashIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroTrashIconSolid />
      </Icon>
    );
  },
);

export const TrashIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroTrashIconMini />
      </Icon>
    );
  },
);
