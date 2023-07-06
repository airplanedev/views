// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { FireIcon as HeroFireIconMini } from "@heroicons/react/20/solid";
import { FireIcon as HeroFireIconOutline } from "@heroicons/react/24/outline";
import { FireIcon as HeroFireIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const FireIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroFireIconOutline />
      </Icon>
    );
  },
);

export const FireIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroFireIconSolid />
      </Icon>
    );
  },
);

export const FireIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroFireIconMini />
      </Icon>
    );
  },
);
