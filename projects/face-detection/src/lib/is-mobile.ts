const matchMediaFn = (win: Window, query: string): boolean => win.matchMedia(query).matches;

export const isMobile = (win: Window) => matchMediaFn(win, '(any-pointer:coarse)');
