/** Only announce a forward major/minor update, not reloads, downgrades, or patches. */
export function shouldOpenReleaseNotes(previous: string | undefined, current: string): boolean {
  const parse = (version: string | undefined) => {
    if (!version || !/^\d+\.\d+(?:\.\d+){0,2}$/.test(version)) return null;
    const [major = 0, minor = 0] = version.split('.').map(Number);
    return { major, minor };
  };
  const from = parse(previous);
  const to = parse(current);
  return Boolean(from && to && (to.major > from.major || (to.major === from.major && to.minor > from.minor)));
}
