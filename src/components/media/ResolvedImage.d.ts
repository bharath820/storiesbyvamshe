import type { ImgHTMLAttributes, ReactElement } from "react";

export type ResolvedImageProps = Pick<
  ImgHTMLAttributes<HTMLImageElement>,
  "alt" | "className" | "loading"
> & {
  src?: string;
  fallbackSrc?: string;
};

export function ResolvedImage(props: ResolvedImageProps): ReactElement | null;
