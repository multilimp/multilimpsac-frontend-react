export function isNavItemActive({ path, pathname }: { pathname: string; path: string }): boolean {
  return pathname === path;
}

export const removeAccents = (str: string): string => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

export const filterOptions = (inputValue: string, option: any) => {
  const title = removeAccents(String(option?.title ?? option?.children).toLowerCase());
  return title.includes(inputValue.toLowerCase());
};

export const sleep = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
