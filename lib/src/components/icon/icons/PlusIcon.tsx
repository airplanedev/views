// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { PlusIcon as HeroPlusIconMini } from "@heroicons/react/20/solid";
import { PlusIcon as HeroPlusIconOutline } from "@heroicons/react/24/outline";
import { PlusIcon as HeroPlusIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const PlusIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroPlusIconOutline />
      </Icon>
    );
  },
);

export const PlusIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroPlusIconSolid />
      </Icon>
    );
  },
);

export const PlusIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroPlusIconMini />
      </Icon>
    );
  },
);
