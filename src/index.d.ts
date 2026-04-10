/**
 * @function renderProfile
 * @param {Profile} profile
 * @param {EscapeHtml} escapeHtml
 * @param {MarkdownToHtml} markdownToHtml
 * @return {string} HTML page.
 */
export function renderProfile(profile: Profile, escapeHtml: EscapeHtml, markdownToHtml: MarkdownToHtml): string;
export default renderProfile;
export type DataEntry = {
  content: string;
  embed?: number | null | undefined;
};
export type EscapeHtml = (input: string | number | boolean | object) => string;
export type MarkdownToHtml = (input: string) => string;
export type Profile = {
  name_id: string;
  public_id: string;
  data?: DataEntry[] | undefined;
  display_name?: string | undefined;
  lang?: string | undefined;
  photo?: boolean | undefined;
  theme?: string | undefined;
};
