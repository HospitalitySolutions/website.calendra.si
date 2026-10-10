import { Code2, Mail, Video } from "lucide-react";

/** Local marks avoid third-party image requests in the integration preview. */
const IntegrationMark = ({ index }: { index: number }) => {
  if (index === 0) return <span className="integration-mark integration-calendar" aria-hidden="true"><span>31</span></span>;
  if (index === 1) return <span className="integration-mark integration-zoom" aria-hidden="true"><Video fill="currentColor" /></span>;
  if (index === 2) return <span className="integration-mark integration-stripe" aria-hidden="true">S</span>;
  if (index === 3) return <span className="integration-mark integration-outline" aria-hidden="true"><Video /></span>;
  if (index === 4) return <span className="integration-mark integration-outline" aria-hidden="true"><Mail /></span>;
  return <span className="integration-mark integration-outline" aria-hidden="true"><Code2 /></span>;
};

export default IntegrationMark;
