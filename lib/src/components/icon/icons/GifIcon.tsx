// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { GifIcon as HeroGifIconMini } from "@heroicons/react/20/solid";
import { GifIcon as HeroGifIconOutline } from "@heroicons/react/24/outline";
import { GifIcon as HeroGifIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const GifIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroGifIconOutline />
      </Icon>
    );
  },
);

export const GifIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroGifIconSolid />
      </Icon>
    );
  },
);

export const GifIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroGifIconMini />
      </Icon>
    );
  },
);
