// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { BookmarkIcon as HeroBookmarkIconMini } from "@heroicons/react/20/solid";
import { BookmarkIcon as HeroBookmarkIconOutline } from "@heroicons/react/24/outline";
import { BookmarkIcon as HeroBookmarkIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const BookmarkIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroBookmarkIconOutline />
      </Icon>
    );
  },
);

export const BookmarkIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroBookmarkIconSolid />
      </Icon>
    );
  },
);

export const BookmarkIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroBookmarkIconMini />
      </Icon>
    );
  },
);
