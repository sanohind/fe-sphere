export const ensureHashPath = (path: string) => {
  const normalized = (() => {
    if (path.startsWith('#')) return path;
    if (path.startsWith('/')) return `#${path}`;
    return `#/${path}`;
  })();

  if (window.location.hash !== normalized) {
    window.location.hash = normalized;
  }
};

export const ensureSignInHash = () => ensureHashPath('/signin');

type LocationLike = {
  pathname: string;
  hash?: string;
};

export const getHashAwarePathname = (location: LocationLike) => {
  if (location.hash && location.hash.startsWith('#')) {
    const hashPath = location.hash.slice(1);
    if (hashPath.startsWith('/')) {
      return hashPath;
    }
    return `/${hashPath}`;
  }
  return location.pathname;
};

