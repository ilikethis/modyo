export class Module {
  constructor() {
    this.PREFIX_ = 'data-';
  }

  toSelectorCase(str) {
    return String(str).replace(/([A-Z])/g, '-$1').toLowerCase();
  }

  /**
   * Gets a custom data attribute from an element. The key should be
   * in camelCase format (e.g "keyName" for the "data-key-name" attribute).
   * @param {Element} element DOM node to get the custom data attribute from.
   * @param {string} key Key for the custom data attribute
   * @return {?string} The attribute value, if it exists.
   */
  getAttribute(element, key) {
    let attribute = element.getAttribute(
    this.PREFIX_ + this.toSelectorCase(key));

    // To deal with null
    if (attribute) {
      attribute = attribute.trim();
    }
    if (attribute == "true" || attribute == "True" || attribute == "") {
      return true;
    }
    if (attribute == "false" || attribute == "False") {
      return false;
    }
    return attribute;
  }

  hasAttribute(element, key) {
    return element.hasAttribute(
      this.PREFIX_ + this.toSelectorCase(key)
    );
  }

  setAttribute(element, key, value) {
    element.setAttribute(this.PREFIX_ + this.toSelectorCase(key), value);
  }

  removeAttribute(element, key) {
    element.removeAttribute(this.PREFIX_ + this.toSelectorCase(key));
  }
}
