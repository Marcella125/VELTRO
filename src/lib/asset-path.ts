const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function assetPath(path: string) {
  if (!path) return path;
  if (/^(?:https?:)?\/\//.test(path)) return path;
  if (!path.startsWith("/")) return `${basePath}/${path}`;
  return `${basePath}${path}`;
}
