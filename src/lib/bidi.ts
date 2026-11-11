/**
 * Persian text mixes with Latin model numbers and units ("مدل 5530 / 5540", "15 N/25mm", "NANO 4965").
 * In a right-to-left paragraph the browser reorders such runs ("N/25mm 15"). Wrapping every Latin run
 * in a left-to-right isolate (U+2066 ... U+2069) keeps each run intact and readable.
 *
 * Use it only for text shown on the page. Never for <title>, meta tags or JSON-LD, which stay plain.
 * Parentheses are deliberately not part of a run, so "(XPE)" still mirrors correctly in RTL.
 */
const LATIN_RUN = /[A-Za-z0-9](?:[A-Za-z0-9 .,/%°~#+\-µ≥×:&]*[A-Za-z0-9%°#µ])?/g;

export const bidi = (text: string) => text.replace(LATIN_RUN, "⁦$&⁩");

/** True for strings made only of Latin letters, digits and symbols (values, standards, codes). */
export const isLtr = (s: string) => !/[؀-ۿ]/.test(s) && /[A-Za-z0-9]/.test(s);
