import { ImageResponse } from "next/og";

import { OgImage, ogContentType, ogSize } from "@/lib/og";

export const alt = "Latte Blooms - A little bloom. A little brew. A whole lot of love.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return new ImageResponse(<OgImage />, { ...size });
}
