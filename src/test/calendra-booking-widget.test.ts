import { createCalendraBookingWidget } from "@/lib/calendra-booking-widget";

describe("createCalendraBookingWidget", () => {
  it("creates a directory booking widget with the tenant and locale", () => {
    const widget = createCalendraBookingWidget({
      tenant: "TENANT-ABC",
      baseUrl: "https://app.calendra.si/",
      locale: "sl",
      presentation: "directory",
    });

    expect(widget.tagName.toLowerCase()).toBe("calendra-booking-widget");
    expect(widget.getAttribute("tenant")).toBe("TENANT-ABC");
    expect(widget.getAttribute("base-url")).toBe("https://app.calendra.si");
    expect(widget.getAttribute("locale")).toBe("sl");
    expect(widget.getAttribute("presentation")).toBe("directory");
  });
});
