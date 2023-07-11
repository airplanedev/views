// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { HashtagIcon as HeroHashtagIconMini } from "@heroicons/react/20/solid";
import { HashtagIcon as HeroHashtagIconOutline } from "@heroicons/react/24/outline";
import { HashtagIcon as HeroHashtagIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const HashtagIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroHashtagIconOutline />
      </Icon>
    );
  },
);

export const HashtagIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroHashtagIconSolid />
      </Icon>
    );
  },
);

export const HashtagIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroHashtagIconMini />
      </Icon>
    );
  },
);
