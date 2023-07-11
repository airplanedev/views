// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { FilmIcon as HeroFilmIconMini } from "@heroicons/react/20/solid";
import { FilmIcon as HeroFilmIconOutline } from "@heroicons/react/24/outline";
import { FilmIcon as HeroFilmIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const FilmIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroFilmIconOutline />
      </Icon>
    );
  },
);

export const FilmIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroFilmIconSolid />
      </Icon>
    );
  },
);

export const FilmIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroFilmIconMini />
      </Icon>
    );
  },
);
