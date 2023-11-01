export const SUPPORTED_CASES = ['uppercase', 'lowercase'] as const;
export type SupportedCase = (typeof SUPPORTED_CASES)[number];

export function isSupportedCase(whichCase: string): whichCase is SupportedCase {
  return SUPPORTED_CASES.includes(whichCase as SupportedCase);
}
