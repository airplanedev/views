// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { TicketIcon as HeroTicketIconMini } from "@heroicons/react/20/solid";
import { TicketIcon as HeroTicketIconOutline } from "@heroicons/react/24/outline";
import { TicketIcon as HeroTicketIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const TicketIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroTicketIconOutline />
      </Icon>
    );
  },
);

export const TicketIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroTicketIconSolid />
      </Icon>
    );
  },
);

export const TicketIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroTicketIconMini />
      </Icon>
    );
  },
);
