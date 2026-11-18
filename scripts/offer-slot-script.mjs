// While the build snapshot carries an offer, prerendered pages reserve empty slots for
// the offer banner (.site-notice) and the /cenik offer block (.pricing-offer). This tiny
// render-blocking script hides those slots before the first paint when the visitor has
// closed the banner or the offer has already ended, so they never open and then collapse.
// It only sets attributes on <html> (outside the React root), so hydration is unaffected.
// Served from /assets/ with a content hash: same-origin for the CSP and cached as immutable.
import { createHash } from 'node:crypto';

export const buildOfferSlotScript = ({ dismissKey, validUntil }) => {
  const end = Date.parse(validUntil);
  if (!dismissKey || !Number.isFinite(end)) throw new Error('Offer slot script needs the dismissal key and a valid end.');
  const source = `(function(){var d=document.documentElement;try{if(Number(localStorage.getItem(${JSON.stringify(dismissKey)}))>Date.now())d.setAttribute("data-notice-closed","")}catch(e){}if(Date.now()>=${end})d.setAttribute("data-offer-ended","")})();\n`;
  const hash = createHash('sha256').update(source).digest('hex').slice(0, 10);
  return { source, fileName: `assets/offer-slots-${hash}.js` };
};
