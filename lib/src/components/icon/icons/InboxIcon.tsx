// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { InboxIcon as HeroInboxIconMini } from "@heroicons/react/20/solid";
import { InboxIcon as HeroInboxIconOutline } from "@heroicons/react/24/outline";
import { InboxIcon as HeroInboxIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const InboxIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroInboxIconOutline />
      </Icon>
    );
  },
);

export const InboxIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroInboxIconSolid />
      </Icon>
    );
  },
);

export const InboxIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroInboxIconMini />
      </Icon>
    );
  },
);
