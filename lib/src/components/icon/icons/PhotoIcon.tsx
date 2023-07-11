// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { PhotoIcon as HeroPhotoIconMini } from "@heroicons/react/20/solid";
import { PhotoIcon as HeroPhotoIconOutline } from "@heroicons/react/24/outline";
import { PhotoIcon as HeroPhotoIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const PhotoIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroPhotoIconOutline />
      </Icon>
    );
  },
);

export const PhotoIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroPhotoIconSolid />
      </Icon>
    );
  },
);

export const PhotoIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroPhotoIconMini />
      </Icon>
    );
  },
);
