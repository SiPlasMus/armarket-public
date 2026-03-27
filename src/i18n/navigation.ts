import { createElement, forwardRef } from 'react';
import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

const navigation = createNavigation(routing);
const BaseLink = navigation.Link;

export const redirect = navigation.redirect;
export const usePathname = navigation.usePathname;
export const useRouter = navigation.useRouter;

type LinkProps = React.ComponentProps<typeof BaseLink>;

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(props, ref) {
  return createElement(BaseLink, { ...props, ref, prefetch: false });
});
