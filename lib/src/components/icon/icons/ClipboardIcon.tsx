// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { ClipboardIcon as HeroClipboardIconMini } from "@heroicons/react/20/solid";
import { ClipboardIcon as HeroClipboardIconOutline } from "@heroicons/react/24/outline";
import { ClipboardIcon as HeroClipboardIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const ClipboardIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroClipboardIconOutline />
      </Icon>
    );
  },
);

export const ClipboardIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroClipboardIconSolid />
      </Icon>
    );
  },
);

export const ClipboardIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroClipboardIconMini />
      </Icon>
    );
  },
);
