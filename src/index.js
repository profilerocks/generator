import { HREF_ASSETS, HREF_HELP, HREF_HOME, HREF_PRIVACY, HREF_REPORT, HREF_TERMS, PLATFORM_NAME, SITE } from "#src/custom";

/**
 * @typedef {Object} DataEntry
 * @property {string} content
 * @property {(number|null)} [embed]
 */

/**
 * @callback EscapeHtml
 * @param {(string|number|boolean|object)} input
 * @returns {string}
 */

/**
 * @callback MarkdownToHtml
 * @param {string} input
 * @returns {string}
 */

/**
 * @typedef {Object} Profile
 * @property {string} name_id
 * @property {string} public_id
 * @property {DataEntry[]} [data]
 * @property {string} [display_name]
 * @property {string} [lang]
 * @property {boolean} [photo]
 * @property {string} [theme]
 *
 * Premium features:
 *
 * @property {boolean} [favicon]
 * @property {string} [meta_description]
 * @property {string} [title]
 * @property {boolean} [watermark]
 */

const HREF_PHOTO = HREF_ASSETS + "/profile/";
const HREF_THEME_ASSETS = HREF_ASSETS + "/theme/";

const HTML_SCRIPT = `<script
src="${HREF_ASSETS}/scripts/client/1.0.0.js"
integrity="sha384-8yhR9hjdV61KvGVOnFd+81yePilp2srVdX/A+VaEXdN+u9QAaGuqG+NcjA2Pksjg"
crossorigin="anonymous"></script>`;

const SITE_WITH_SLASH = SITE + "/";

/**
 * @function renderButtonLink
 * @param {string} href
 * @param {string} display
 * @param {EscapeHtml} escapeHTML
 */
function renderButtonLink(href, display, escapeHTML) {
  return (
    '<div class="link-container">' +
    `<a href="${href}" rel="noopener noreferrer" target="_blank" class="btn-link" title="${display}">` +
    `<span class="btn-link-text">${escapeHTML(display)}</span>` +
    "</a>" +
    "</div>"
  );
}

/**
 * @function renderButtonLinkEmbed
 * @param {string} href
 * @param {string} display
 * @param {EscapeHtml} escapeHTML
 */
function renderButtonLinkEmbed(href, display, escapeHTML) {
  return (
    `<div class="embed-container>` +
    `<a href="${href}" rel="noopener noreferrer" target="_blank" class="btn-link-embed" title="${display}">` +
    `<span class="btn-link-embed-text">${escapeHTML(display)}</span>` +
    "</a>" +
    "</div>"
  );
}

/**
 * @function renderProfile
 * @param {Profile} profile
 * @param {EscapeHtml} escapeHtml
 * @param {MarkdownToHtml} markdownToHtml
 * @return {string} HTML page.
 */
export function renderProfile(profile, escapeHtml, markdownToHtml) {
  profile.lang ??= "en";

  profile.meta_description = profile.meta_description
    ? escapeHtml(profile.meta_description)
    : "The " + PLATFORM_NAME + " of @" + profile.name_id + ".";

  profile.title ??= profile.name_id + " | " + PLATFORM_NAME;

  const canonical = SITE_WITH_SLASH + profile.name_id;

  let html =
    "<!DOCTYPE html>" +
    `<html lang="${profile.lang}">` +
    "<head>" +
    '<meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<meta name="color-scheme" content="dark light">' +
    '<meta name="referrer" content="no-referrer">' +
    '<meta name="theme-color" content="#000">' +
    '<meta name="apple-mobile-web-app-capable" content="yes">' +
    '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">' +
    '<meta name="format-detection" content="telephone=no">' +
    '<meta name="mobile-web-app-capable" content="yes">' +
    '<meta name="MSSmartTagsPreventParsing" content="true">' +
    `<meta name="generator" content="${PLATFORM_NAME}">` +
    `<link rel="canonical" href="${canonical}">` +
    `<link rel="help" href="${HREF_HELP}">` +
    `<link rel="privacy-policy" href="${HREF_PRIVACY}">` +
    `<link rel="terms-of-service" href="${HREF_TERMS}">` +
    `<link rel="icon" href="${HREF_HOME}/favicon-96x96.png" sizes="96x96" type="image/png">` +
    `<link rel="icon" href="${HREF_HOME}/favicon.svg" type="image/svg+xml">` +
    `<link rel="shortcut icon" href="${HREF_HOME}/favicon.ico">` +
    `<link rel="apple-touch-icon" href="${HREF_HOME}/apple-touch-icon.png" sizes="180x180">` +
    // Dynamic tags
    `<meta name="author" content="${profile.name_id}">` +
    `<meta name="description" content="${profile.meta_description}">` +
    `<link rel="stylesheet" href="${HREF_THEME_ASSETS + (profile.theme || "AAAAAAAAAAAAAAAAAAAAAAAA")}.css">` +
    `<title>${profile.title}</title>` +
    `<meta name="apple-mobile-web-app-title" content="${profile.title}">` +
    `<meta property="og:description" content="${profile.meta_description}">` +
    `<meta property="og:site_name" content="${PLATFORM_NAME}">` +
    `<meta property="og:title" content="${profile.name_id}">` +
    '<meta property="og:type" content="website">' +
    `<meta property="og:url" content="${canonical}">`;

  profile.display_name = profile.display_name ? escapeHtml(profile.display_name) : profile.name_id;

  html += "</head>" + "<body>" + '<header class="page-header">' + '<figure class="page-header-figure">';

  if (profile.photo) {
    html += '<img src="' + HREF_PHOTO + profile.public_id + '/photo" alt="photo" draggable="false" class="page-header-img">';
  }

  html +=
    '<figcaption class="page-header-figcaption" title="' +
    profile.display_name +
    '">' +
    profile.display_name +
    "</figcaption>" +
    "</figure>" +
    "</header>" +
    "<main>";

  if (profile.data) {
    for (const dataEntry of profile.data) {
      if (dataEntry.embed == undefined) {
        html += '<div class="md">' + markdownToHtml(dataEntry.content) + "</div>";
      } else {
        /**
         * @type {string}
         */
        let href;

        /**
         * @type {string}
         */
        let display;

        if (dataEntry.content.startsWith("[")) {
          try {
            [href, display] = JSON.parse(dataEntry.content);
          } catch {
            console.error("Error parsing data entry:", JSON.stringify(dataEntry));
            continue;
          }
        } else {
          const url = URL.parse(dataEntry.content);

          if (!url) {
            console.error("Error trying to get URL:", dataEntry.content);
            continue;
          }

          href = url.href;
          display = url.hostname;
        }

        html += dataEntry.embed ? renderButtonLinkEmbed(href, display, escapeHtml) : renderButtonLink(href, display, escapeHtml);
      }
    }
  }

  html +=
    "</main>" +
    '<aside class="privacy-settings" id="privacy-settings-0" hidden>' +
    '<p class="privacy-settings-p">' +
    "This platform uses third-party embeds to display rich media, read more about it in the " +
    '<a href="https://www.profile.rocks/i/privacy" target="_blank" rel="privacy-policy">privacy policy</a> and the ' +
    '<a href="https://www.profile.rocks/i/cookie" target="_blank" rel="noopener noreferrer">cookie policy</a>. By clicking "Accept all", ' +
    "you agree to the loading of any external content, which may use cookies. You can change your mind anytime by selecting " +
    '"Privacy Settings".' +
    "</p>" +
    '<fieldset class="privacy-settings-fieldset">' +
    '<button type="button" class="settings-third-party-option third-party-option third-party-accept">Accept all</button>' +
    '<button type="button" class="settings-third-party-option third-party-option third-party-reject">Reject all</button>' +
    "<button" +
    'type="button"' +
    'class="settings-third-party-option third-party-option third-party-manage"' +
    'command="show-modal"' +
    'commandfor="third-party-dialog-0"' +
    ">" +
    "Manage preferences" +
    "</button>" +
    "</fieldset>" +
    "</aside>" +
    '<footer class="page-footer">' +
    '<ul class="page-footer-ul">' +
    `<li><a href="${HREF_REPORT}?public_id=${profile.public_id}" target="_blank" rel="noopener noreferrer">Report</a></li>` +
    `<li><a href="${HREF_PRIVACY}" target="_blank" rel="privacy-policy">Privacy</a></li>` +
    '<li><button type="button" class="btn-privacy-settings-footer">Privacy Settings</button></li>' +
    "</ul>" +
    '<p class="powered-by">Powered by <a href="' +
    HREF_HOME +
    '" rel="noopener noreferrer" target="_blank">' +
    PLATFORM_NAME +
    "</a></p>" +
    "</footer>" +
    '<dialog class="third-party-dialog" id="third-party-dialog-0">' +
    '<h2 class="third-party-dialog-title">Manage third-party preferences</h2>' +
    '<p class="third-party-dialog-p">You can select which services to load and which not to:</p>' +
    '<form method="dialog" class="third-party-dialog-form" id="third-party-dialog-form-0">' +
    '<fieldset class="third-party-dialog-fieldset">' +
    '<button type="submit" class="dialog-third-party-option third-party-option third-party-reject" value="reject">Reject all</button>' +
    '<button type="submit" class="dialog-third-party-option third-party-option third-party-accept" value="accept">Accept all</button>' +
    '<button type="submit" class="dialog-third-party-option third-party-option third-party-save" value="save">Save</button>' +
    "</fieldset>" +
    "</form>" +
    "</dialog>" +
    HTML_SCRIPT +
    "</body>" +
    "</html>";

  return html;
}

export default renderProfile;
