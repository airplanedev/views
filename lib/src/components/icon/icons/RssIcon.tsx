// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { RssIcon as HeroRssIconMini } from "@heroicons/react/20/solid";
import { RssIcon as HeroRssIconOutline } from "@heroicons/react/24/outline";
import { RssIcon as HeroRssIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const RssIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroRssIconOutline />
      </Icon>
    );
  },
);

export const RssIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroRssIconSolid />
      </Icon>
    );
  },
);

export const RssIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroRssIconMini />
      </Icon>
    );
  },
);
