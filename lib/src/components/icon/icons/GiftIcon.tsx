// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { GiftIcon as HeroGiftIconMini } from "@heroicons/react/20/solid";
import { GiftIcon as HeroGiftIconOutline } from "@heroicons/react/24/outline";
import { GiftIcon as HeroGiftIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const GiftIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroGiftIconOutline />
      </Icon>
    );
  },
);

export const GiftIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroGiftIconSolid />
      </Icon>
    );
  },
);

export const GiftIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroGiftIconMini />
      </Icon>
    );
  },
);
