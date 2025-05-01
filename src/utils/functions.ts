export function isNavItemActive({ path, pathname }: { pathname: string; path: string }): boolean {
  return pathname === path;
}
