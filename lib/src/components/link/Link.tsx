import { Anchor } from "@mantine/core";
import { forwardRef, Ref, useEffect, useState } from "react";

import { ComponentErrorBoundary } from "components/errorBoundary/ComponentErrorBoundary";
import { ArrowTopRightOnSquareIconMini } from "components/icon";
import { THEME } from "components/theme/theme";
import { NavigateParams, useRouter } from "routing";

import { Props } from "./Link.types";

/** LinkWithoutRef is exported for documentation purposes. */
export const LinkWithoutRef = ({
  innerRef,
  children,
  newTab,
  href,
  ...props
}: Props & { innerRef: Ref<HTMLAnchorElement> }) => {
  const [linkHref, setLinkHref] = useState(() =>
    typeof href === "string" ? href : "",
  );
  const { getHref } = useRouter();
  useEffect(() => {
    const setNavigationHref = async (navigationHref: NavigateParams) => {
      const rhr = await getHref(navigationHref);
      setLinkHref(rhr);
    };
    if (typeof href === "string") {
      setLinkHref(href);
    } else {
      setNavigationHref(href);
    }
  }, [href, getHref]);
  const target = props.target ?? newTab ? "_blank" : "_top";
  return (
    <Anchor
      {...props}
      target={target}
      ref={innerRef}
      sx={{ display: "inline-flex", alignItems: "center", ...props.sx }}
      href={linkHref || undefined}
    >
      {children}
      {target === "_blank" && (
        <ArrowTopRightOnSquareIconMini
          size={THEME.fontSizes[props.size!] * 0.9}
          style={{ marginLeft: ".1em", flexShrink: 0 }}
        />
      )}
    </Anchor>
  );
};

export const Link = forwardRef(
  (
    { newTab = true, size = "md", ...props }: Props,
    ref: Ref<HTMLAnchorElement>,
  ) => {
    return (
      <ComponentErrorBoundary componentName={DISPLAY_NAME}>
        <LinkWithoutRef {...props} newTab={newTab} size={size} innerRef={ref} />
      </ComponentErrorBoundary>
    );
  },
);
const DISPLAY_NAME = "Link";
Link.displayName = DISPLAY_NAME;
