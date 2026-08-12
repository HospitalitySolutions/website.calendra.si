export type MarketingImage = {
  src: string;
  srcSet: string;
  sizes: string;
  width: number;
  height: number;
};

const screenshot = (
  base: string,
  widths: readonly number[],
  width: number,
  height: number,
  sizes = "(min-width: 1024px) 960px, 100vw",
): MarketingImage => ({
  src: `/screenshots/${base}.webp`,
  srcSet: widths.map((item) => `/screenshots/${base}-${item}.webp ${item}w`).join(", "),
  sizes,
  width,
  height,
});

export const MARKETING_IMAGES = {
  calendar: screenshot("calendar-week-overview", [800, 1280, 1600], 1600, 798),
  invoicing: screenshot("invoice-billing-workflow", [640, 960], 960, 944, "(min-width: 1024px) 820px, 100vw"),
  clientProfile: screenshot("client-profile-appointments", [480, 612], 612, 858, "(min-width: 1024px) 560px, 92vw"),
  reminders: screenshot("notification-templates", [640, 960, 1200], 1200, 998),
  materialManagement: screenshot("material-management", [800, 1280, 1600, 2048], 2048, 782),
  membership: screenshot("membership-visit-pass", [480, 608], 608, 734, "(min-width: 1024px) 500px, 92vw"),
  groupParticipants: screenshot("group-capacity-participants", [640, 784], 784, 625, "(min-width: 1024px) 720px, 100vw"),
  bookingService: screenshot("booking-service-selection", [640, 960, 1200], 1200, 987),
  bookingTime: screenshot("booking-group-time-selection", [640, 960, 1200], 1200, 911),
  bookingReview: screenshot("booking-payment-review", [640, 960, 1200], 1200, 950),
} as const;
