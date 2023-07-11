// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { PrinterIcon as HeroPrinterIconMini } from "@heroicons/react/20/solid";
import { PrinterIcon as HeroPrinterIconOutline } from "@heroicons/react/24/outline";
import { PrinterIcon as HeroPrinterIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const PrinterIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroPrinterIconOutline />
      </Icon>
    );
  },
);

export const PrinterIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroPrinterIconSolid />
      </Icon>
    );
  },
);

export const PrinterIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroPrinterIconMini />
      </Icon>
    );
  },
);
