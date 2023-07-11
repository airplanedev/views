import { Avatar as MantineAvatar } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";

import { USERS_GET } from "client/endpoints";
import { Fetcher } from "client/fetcher";
import { User } from "client/types";
import { ComponentErrorBoundary } from "components/errorBoundary/ComponentErrorBoundary";

import { AvatarProps } from "./Avatar.types";

export const getInitials = (displayName?: string) => {
  if (!displayName) {
    return undefined;
  }
  const nameParts = displayName.split(" ");
  if (nameParts.length === 1) {
    if (nameParts[0].length === 0) {
      return undefined;
    } else {
      return nameParts[0][0].toUpperCase();
    }
  }
  return (
    nameParts[0][0].toUpperCase() +
    nameParts[nameParts.length - 1][0].toUpperCase()
  );
};

export const AvatarComponent = ({
  color = "primary",
  size = "md",
  radius = 9999,
  email,
  userID,
  src,
  children,
  ...props
}: AvatarProps) => {
  const emailOrUserID = email || userID;
  const { data } = useQuery(
    [USERS_GET, emailOrUserID],
    async () => {
      const fetcher = new Fetcher();
      return await fetcher.get<{ user: User }>(
        USERS_GET,
        email ? { email } : { userID },
      );
    },
    { enabled: !!emailOrUserID },
  );

  // avatarURL might be an empty string here, in which case we want to make it undefined.
  const imageSrc = src || data?.user?.avatarURL || undefined;
  let avatarChildren = children;

  // If there's no image or children but there's a user query param is set, use initials as placeholder.
  if (
    imageSrc === undefined &&
    children === undefined &&
    emailOrUserID !== undefined
  ) {
    const nameInitials = getInitials(data?.user?.name);
    const emailInitials = email?.[0]?.toUpperCase();
    avatarChildren = nameInitials || emailInitials;
  }

  return (
    <MantineAvatar
      color={color}
      radius={radius}
      size={size}
      variant="light"
      src={imageSrc}
      {...props}
    >
      {avatarChildren}
    </MantineAvatar>
  );
};

export const Avatar = (props: AvatarProps) => (
  <ComponentErrorBoundary componentName={Avatar.displayName}>
    <AvatarComponent {...props} />
  </ComponentErrorBoundary>
);

Avatar.displayName = "Avatar";
