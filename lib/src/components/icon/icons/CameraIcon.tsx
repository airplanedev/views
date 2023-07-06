// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { CameraIcon as HeroCameraIconMini } from "@heroicons/react/20/solid";
import { CameraIcon as HeroCameraIconOutline } from "@heroicons/react/24/outline";
import { CameraIcon as HeroCameraIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const CameraIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroCameraIconOutline />
      </Icon>
    );
  },
);

export const CameraIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroCameraIconSolid />
      </Icon>
    );
  },
);

export const CameraIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroCameraIconMini />
      </Icon>
    );
  },
);
