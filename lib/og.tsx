import type { ReactElement } from "react";

// Shared 1200x630 social-card artwork used by both opengraph-image and
// twitter-image. Pure inline styles (ImageResponse only supports flexbox + a
// CSS subset), brand colors hard-coded since CSS variables aren't available here.
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

export function OgImage(): ReactElement {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        backgroundColor: "#fbf8f1",
        padding: "80px",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 24,
          fontWeight: 700,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "#70735a",
          marginBottom: 28,
        }}
      >
        Flowers &bull; Coffee &bull; Thoughtful delivery
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 88,
          fontWeight: 500,
          lineHeight: 1.05,
          color: "#51301f",
        }}
      >
        <span>A little bloom. A little brew.</span>
        <span style={{ color: "#9c6653", fontStyle: "italic" }}>
          A whole lot of love.
        </span>
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 36,
          fontSize: 32,
          color: "#766455",
        }}
      >
        Latte Blooms &middot; (330) 201-8614
      </div>
    </div>
  );
}
