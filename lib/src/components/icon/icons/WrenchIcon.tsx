// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { WrenchIcon as HeroWrenchIconMini } from "@heroicons/react/20/solid";
import { WrenchIcon as HeroWrenchIconOutline } from "@heroicons/react/24/outline";
import { WrenchIcon as HeroWrenchIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const WrenchIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroWrenchIconOutline />
      </Icon>
    );
  },
);

export const WrenchIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroWrenchIconSolid />
      </Icon>
    );
  },
);

export const WrenchIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroWrenchIconMini />
      </Icon>
    );
  },
);
