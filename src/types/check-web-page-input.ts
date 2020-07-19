export interface CheckWebPageInput {
  /**
   * URL of the Web Page to check
   */
  webPageUrl: string;
  /**
   * Optional query string selector to extract data from the web page
   */
  querySelector?: string
}
