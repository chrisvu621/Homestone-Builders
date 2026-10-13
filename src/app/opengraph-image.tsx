import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name}, licensed general contractor in Orange County`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "linear-gradient(135deg, #2f2c28 0%, #1f1d1a 100%)",
          color: "#f7f4ee",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 6, textTransform: "uppercase", color: "#e9d5c4" }}>
          {`Licensed General Contractor · CSLB #${site.licenseNumber}`}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.05 }}>{site.name}</div>
          <div style={{ fontSize: 38, color: "#ece6db" }}>
            Kitchens · Bathrooms · ADUs · New Homes · Windows & Doors
          </div>
        </div>
        <div style={{ fontSize: 36, color: "#c98a5f" }}>{`Orange County, CA · ${site.phone.display}`}</div>
      </div>
    ),
    size,
  );
}
