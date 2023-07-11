// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { DocumentIcon as HeroDocumentIconMini } from "@heroicons/react/20/solid";
import { DocumentIcon as HeroDocumentIconOutline } from "@heroicons/react/24/outline";
import { DocumentIcon as HeroDocumentIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const DocumentIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroDocumentIconOutline />
      </Icon>
    );
  },
);

export const DocumentIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroDocumentIconSolid />
      </Icon>
    );
  },
);

export const DocumentIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroDocumentIconMini />
      </Icon>
    );
  },
);
