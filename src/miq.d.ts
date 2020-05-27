// Type definitions for miq v1.15.0
// Project: https://bitstorm.org/javascript/miq/
// Definitions by: Edwin Martin <https://bitstorm.org>
// Definitions:


/**
 * AJAX options object
 * options: {
 *    method: HTTP method like 'GET' or 'POST'
 *    data: the data to send
 *    dataType: content type of the data
 *    headers: add extra HTTP headers like cookies
 * }
 */
interface IMiqAjaxConfig {
    method?: string;
    data?: any;
    dataType?: string;
    headers?: any;
}

/**
 * Miq is a lightweight jQuery-like DOM library.
 * See https://bitstorm.org/javascript/miq/
 */
interface IMiqStatic {
    /**
     * Runs function on DOM content loaded event
     * @param callback
     */
    (ready: () => any): void;
    /**
     * Creates a miq collection from one DOM element
     * @param element
     */
    (element: Element): IMiq;
    /**
     * Creates a miq collection from an array of DOM elements
     * @param elementArray
     */
    (elementArray: Element[]): IMiq;
    /**
     * Creates a new miq collection
     * @param object
     */
    (collection: IMiq): IMiq;
    /**
     * Creates a new element like ('<div>')
     * @param html
     * @param ownerDocument
     */
    (html: string, ownerDocument?: Document): IMiq;
    /**
     * Create an empty lightweight DocumentFragment
     */
    (): DocumentFragment;
    /**
     * Fetch url with options and return a promise
     * Older browsers don't support Promise, use a polyfill instead
     * options: {
     *    method: HTTP method like 'GET' or 'POST'
     *    data: the data to send
     *    dataType: content type of the data
     *    headers: add extra HTTP headers like cookies
     * }
     * @param url
     * @param options
     */
    ajax(url: string, options?: IMiqAjaxConfig): Promise<any>;
    /**
     * Fetch the url, like ajax(), but Promise support not required
     * options: {
     *    method: HTTP method like 'GET' or 'POST'
     *    data: the data to send
     *    dataType: content type of the data
     *    headers: add extra HTTP headers like cookies
     * }
     * @param url
     * @param resolve
     * @param reject
     * @param options
     */
    ajaxCallback(url: string, resolve: (data: any) => any, reject: (error: string) => any, options?: IMiqAjaxConfig): void;
    /**
     * Get the version of miq
     */
    miq: string;
}

/**
 * Miq is a lightweight jQuery-like DOM library.
 * See https://bitstorm.org/javascript/miq/
 */
interface IMiq extends Array<any> {
    /**
     * Get the first DOM element from the collection
     */
    first: Element;

    /**
     * Get the DOM element at this index
     */
    [index: number]: Element;

    /**
     * Get a property of an element
     * @param propName Name of property
     */
    prop(propName: string): string;
    /**
     * Set a property of an element
     * @param propName Name of property
     * @param value Value of property
     */
    prop(propName: string, value: string|number): IMiq;

    /**
     * Get the value of an attribute
     * @param attributeName
     */
    attr(attributeName: string): string;
    /**
     * Set the attribute to value
     * @param attributeName
     * @param value
     */
    attr(attributeName: string, value: string|number): IMiq;
    /**
     * Remove this attribute from the element
     * @param attributeName
     */
    removeAttr(attributeName: string): IMiq;

    /**
     * Add a class
     * @param className
     */
    addClass(className: string): IMiq;
    /**
     * Remove a class
     * @param className
     */
    removeClass(className: string): IMiq;
    /**
     * Does the element has this class
     * @param className
     */
    hasClass(className: string): boolean;

    /**
     * Get the HTML code of this element
     */
    html(): string;
    /**
     * Sets the inner HTML, take care of XSS attacks
     * @param html
     */
    html(html: string|number): IMiq;

    /**
     * Get the text inside the element
     */
    text(): string;
    /**
     * Sets the content of this element to this text
     * @param text
     */
    text(text: string|number): IMiq;

    /**
     * Add element as child
     * @param el Element to add
     */
    append(el: Element): IMiq;
    /**
     * Add elements as children
     * @param el Elements to add
     */
    append(el: IMiq): IMiq;

    /**
     * Add an element just before this element
     * @param el Element to add
     */
    before(el: Element): IMiq;
    /**
     * Add elements just before this element
     * @param el Elements to add
     */
    before(el: IMiq): IMiq;

    /**
     * Make a clone of the element
     */
    clone(): IMiq;

    /**
     * Find the closest ancestor element matching the selector
     * @param selector
     */
    closest(selector: string): IMiq|null;

    /**
     * Gets the value of the CSS property
     * @param property
     */
    css(property: string): string;
    /**
     * Sets the value of the CSS property
     * @param property
     * @param value
     */
    css(property: string, value: string|number): IMiq;

    /**
     * Get the element at this index as a new miq collection
     * @param index
     */
    eq(index: number): IMiq;

    /**
     * Find new elements inside the current element matching the selector
     * @param selector
     */
    findx(selector: string): IMiq|null;

    /**
     * Filter elements matching the selector
     * @param selector
     */
    is(selector: string): IMiq;

    /**
     * Get the parent element
     * @param selector
     */
    parent(selector: string): IMiq;

    /**
     * Remove this element from the document
     */
    remove(): IMiq;

    /**
     * Get the value of a form element
     */
    val(): string;
    /**
     * Sets the value of a form element
     * @param value
     */
    val(value: string|number): IMiq;

    /**
     * Add an event listener for event
     * @param event Event like 'click'
     * @param handler Function to call when event occurs
     */
    on(event: string, handler: (event?: Event) => any);
    /**
     * Removes a previously added event listener
     * @param event
     * @param handler
     */
    off(event: string, handler: () => any);

    /**
     * Get the number of DOM elements in the collection
     */
    length: number;
}

declare var miqx: IMiqStatic;
declare var $: IMiqStatic;
