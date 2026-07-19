import { ImageResponse } from "next/og";

// Apple Touch Icon (iOS applies its own rounded mask). Generated at build time
// from the FIG brand colors — no external image tooling required.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0d9488, #115e59)",
          color: "#F2B33D",
          fontSize: 82,
          fontWeight: 800,
          letterSpacing: -6,
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        FIG
      </div>
    ),
    { ...size },
  );
}
