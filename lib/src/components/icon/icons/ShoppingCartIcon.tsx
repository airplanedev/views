// Code generated via yarn gen:icons. DO NOT EDIT

/* eslint-disable react/display-name */
import { ShoppingCartIcon as HeroShoppingCartIconMini } from "@heroicons/react/20/solid";
import { ShoppingCartIcon as HeroShoppingCartIconOutline } from "@heroicons/react/24/outline";
import { ShoppingCartIcon as HeroShoppingCartIconSolid } from "@heroicons/react/24/solid";
import { forwardRef, Ref } from "react";

import { Icon } from "../Icon";
import { Props } from "../Icon.types";

export const ShoppingCartIconOutline = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroShoppingCartIconOutline />
      </Icon>
    );
  },
);

export const ShoppingCartIconSolid = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroShoppingCartIconSolid />
      </Icon>
    );
  },
);

export const ShoppingCartIconMini = forwardRef(
  (props: Props, ref: Ref<SVGSVGElement>) => {
    return (
      <Icon {...props} ref={ref}>
        <HeroShoppingCartIconMini />
      </Icon>
    );
  },
);
