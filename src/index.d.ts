/**
 * @function renderProfile
 * @param {Profile} profile
 * @param {StringTransformer} escapeHtml
 * @param {StringTransformer} markdownToHtml
 * @return {string} HTML page.
 */
export function renderProfile(profile: Profile, escapeHtml: StringTransformer, markdownToHtml: StringTransformer): string;
export default renderProfile;
export type DataEntry = {
    content: string;
    embed?: number | null | undefined;
};
export type StringTransformer = (input: string) => string;
export type Profile = {
    name_id: string;
    public_id: string;
    data?: DataEntry[] | undefined;
    display_name?: string | undefined;
    lang?: string | undefined;
    photo?: boolean | undefined;
    /**
     * Premium features:
     */
    theme?: string | undefined;
    favicon?: boolean | undefined;
    meta_description?: string | undefined;
    title?: string | undefined;
    watermark?: boolean | undefined;
};
