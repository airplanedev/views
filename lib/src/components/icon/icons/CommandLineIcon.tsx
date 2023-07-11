// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { CommandLineIcon as HeroCommandLineIconMini } from "@heroicons/react/20/solid";
import { CommandLineIcon as HeroCommandLineIconOutline } from "@heroicons/react/24/outline";
import { CommandLineIcon as HeroCommandLineIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const CommandLineIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroCommandLineIconOutline />
      </Icon>
    );
  },
);

export const CommandLineIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroCommandLineIconSolid />
      </Icon>
    );
  },
);

export const CommandLineIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroCommandLineIconMini />
      </Icon>
    );
  },
);
