import { Avatar as MantineAvatar } from '@mantine/core';
interface AvatarProps {
  user: { name: string; picture?: string };
}

function getInitials(fullName: string): string {
  const nameParts = fullName.trim().split(' ');
  return nameParts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

export const Avatar = ({ user }: AvatarProps) => {
  const initials = getInitials(user.name);
  return (
    <MantineAvatar size={'md'} variant="filled" color="dark" src={user.picture} alt={user.name}>
      {initials}
    </MantineAvatar>
  );
};
