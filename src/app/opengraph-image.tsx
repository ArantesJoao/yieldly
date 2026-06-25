import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

// Route segment config
export const runtime = "nodejs";

// Image metadata
export const alt = "Yieldly - Personal Investment Tracker";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

// Brand palette (from globals.css)
const BRAND = "#0E1F34";
const BRAND_LIGHT = "#2F5071";
const LINEN = "#F9F1DF";
const LINEN_MUTED = "#E4CF9E";

export default async function Image() {
  // Inline the brand mark as a data URI so Satori can render it
  const logo = readFileSync(
    join(process.cwd(), "public", "brand-logos", "logo-linen.svg"),
  ).toString("base64");
  const logoSrc = `data:image/svg+xml;base64,${logo}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: BRAND,
          backgroundImage: `radial-gradient(circle at 50% 0%, ${BRAND_LIGHT}55 0%, ${BRAND} 60%)`,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 40,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 200,
              height: 200,
              borderRadius: 44,
              backgroundColor: `${LINEN}14`,
              border: `2px solid ${LINEN}33`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoSrc} width={132} height={132} alt="Yieldly" />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 128,
                fontWeight: 700,
                color: LINEN,
                lineHeight: 1,
                letterSpacing: "-0.04em",
              }}
            >
              Yieldly
            </div>
            <div
              style={{
                fontSize: 40,
                fontWeight: 400,
                color: LINEN_MUTED,
                marginTop: 16,
              }}
            >
              Personal Investment Tracker
            </div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 56,
            fontSize: 28,
            color: `${LINEN}99`,
            letterSpacing: "0.02em",
          }}
        >
          Track your investments and yields with ease
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
