// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { QrCodeIcon as HeroQrCodeIconMini } from "@heroicons/react/20/solid";
import { QrCodeIcon as HeroQrCodeIconOutline } from "@heroicons/react/24/outline";
import { QrCodeIcon as HeroQrCodeIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const QrCodeIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroQrCodeIconOutline />
      </Icon>
    );
  },
);

export const QrCodeIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroQrCodeIconSolid />
      </Icon>
    );
  },
);

export const QrCodeIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroQrCodeIconMini />
      </Icon>
    );
  },
);
