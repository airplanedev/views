// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { FolderIcon as HeroFolderIconMini } from "@heroicons/react/20/solid";
import { FolderIcon as HeroFolderIconOutline } from "@heroicons/react/24/outline";
import { FolderIcon as HeroFolderIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const FolderIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroFolderIconOutline />
      </Icon>
    );
  },
);

export const FolderIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroFolderIconSolid />
      </Icon>
    );
  },
);

export const FolderIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroFolderIconMini />
      </Icon>
    );
  },
);
