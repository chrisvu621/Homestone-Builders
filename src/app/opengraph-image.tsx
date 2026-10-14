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
          background: "#242625",
          color: "#faf9f6",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 6, textTransform: "uppercase", color: "#a08a72" }}>
          {`Licensed General Contractor · CSLB #${site.licenseNumber}`}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 84, fontWeight: 400, lineHeight: 1.05 }}>{site.name}</div>
          <div style={{ fontSize: 38, color: "#eae7e1" }}>
            Kitchens · Bathrooms · ADUs · New Homes · Windows & Doors
          </div>
        </div>
        <div style={{ fontSize: 36, color: "#a08a72" }}>{`Orange County, CA · ${site.phone.display}`}</div>
      </div>
    ),
    size,
  );
}
