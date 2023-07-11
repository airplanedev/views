// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { LanguageIcon as HeroLanguageIconMini } from "@heroicons/react/20/solid";
import { LanguageIcon as HeroLanguageIconOutline } from "@heroicons/react/24/outline";
import { LanguageIcon as HeroLanguageIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const LanguageIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroLanguageIconOutline />
      </Icon>
    );
  },
);

export const LanguageIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroLanguageIconSolid />
      </Icon>
    );
  },
);

export const LanguageIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroLanguageIconMini />
      </Icon>
    );
  },
);
