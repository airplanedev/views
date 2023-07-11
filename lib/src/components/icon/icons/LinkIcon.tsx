// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { LinkIcon as HeroLinkIconMini } from "@heroicons/react/20/solid";
import { LinkIcon as HeroLinkIconOutline } from "@heroicons/react/24/outline";
import { LinkIcon as HeroLinkIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const LinkIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroLinkIconOutline />
      </Icon>
    );
  },
);

export const LinkIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroLinkIconSolid />
      </Icon>
    );
  },
);

export const LinkIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroLinkIconMini />
      </Icon>
    );
  },
);
