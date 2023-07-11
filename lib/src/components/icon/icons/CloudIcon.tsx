// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { CloudIcon as HeroCloudIconMini } from "@heroicons/react/20/solid";
import { CloudIcon as HeroCloudIconOutline } from "@heroicons/react/24/outline";
import { CloudIcon as HeroCloudIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const CloudIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroCloudIconOutline />
      </Icon>
    );
  },
);

export const CloudIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroCloudIconSolid />
      </Icon>
    );
  },
);

export const CloudIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroCloudIconMini />
      </Icon>
    );
  },
);
