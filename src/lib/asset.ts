/** Images can live on another host (the preview reads them from GitHub Pages). */
const BASE = process.env.NEXT_PUBLIC_ASSET_BASE ?? "";
export const asset = (p: string) => (BASE ? BASE.replace(/\/$/, "") + "/" + p.replace(/^\//, "") : p);
