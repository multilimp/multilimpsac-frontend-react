const StorageService = {
  set(key: string, value: string) {
    const duration = 86400; // 1d
    window.document.cookie = `${key}=${value}; path=/; max-age=${duration}; SameSite=Strict`;
  },
  get(key: string) {
    const cookies = window.document.cookie.split('; ');
    const cookie = cookies.find((c) => c.startsWith(key + '='));
    return cookie ? cookie.split('=')[1] : undefined;
  },
  delete(key: string) {
    window.document.cookie = `${key}=; path=/; max-age=0`;
  },
};

export default StorageService;
