// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { PhoneIcon as HeroPhoneIconMini } from "@heroicons/react/20/solid";
import { PhoneIcon as HeroPhoneIconOutline } from "@heroicons/react/24/outline";
import { PhoneIcon as HeroPhoneIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const PhoneIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroPhoneIconOutline />
      </Icon>
    );
  },
);

export const PhoneIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroPhoneIconSolid />
      </Icon>
    );
  },
);

export const PhoneIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroPhoneIconMini />
      </Icon>
    );
  },
);
