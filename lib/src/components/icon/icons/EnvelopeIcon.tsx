// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { EnvelopeIcon as HeroEnvelopeIconMini } from "@heroicons/react/20/solid";
import { EnvelopeIcon as HeroEnvelopeIconOutline } from "@heroicons/react/24/outline";
import { EnvelopeIcon as HeroEnvelopeIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const EnvelopeIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroEnvelopeIconOutline />
      </Icon>
    );
  },
);

export const EnvelopeIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroEnvelopeIconSolid />
      </Icon>
    );
  },
);

export const EnvelopeIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroEnvelopeIconMini />
      </Icon>
    );
  },
);
