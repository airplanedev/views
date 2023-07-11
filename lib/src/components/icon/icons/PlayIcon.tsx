// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { PlayIcon as HeroPlayIconMini } from "@heroicons/react/20/solid";
import { PlayIcon as HeroPlayIconOutline } from "@heroicons/react/24/outline";
import { PlayIcon as HeroPlayIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const PlayIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroPlayIconOutline />
      </Icon>
    );
  },
);

export const PlayIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroPlayIconSolid />
      </Icon>
    );
  },
);

export const PlayIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroPlayIconMini />
      </Icon>
    );
  },
);
