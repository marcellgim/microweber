import {ObjectService} from "./object.service.js";



    var MWElement = function(options, root){
        var scope = this;

        this.isMWElement = true;

        this.focus = function () {
            this._active().focus();
            return this;
        }
        this.toggle = function () {
            this.css('display', this.css('display') === 'none' ? 'block' : 'none');
            return this;
        };

        this._active = function () {
            return this.nodes[this.nodes.length - 1];
        };

        this.getDocument = function () {
            return this._active().ownerDocument;
        }

        this.getWindow = function () {
            return this.getDocument().defaultView;;
        }

        this.get = function(selector, scope){
            this.nodes = (scope || document).querySelectorAll(selector);
        };

        this.each = function(cb){
            if(this.nodes) {
                for (var i = 0; i < this.nodes.length; i++) {
                    cb.call(this.nodes[i], i);
                }
            } else if(this.node) {
                cb.call(this.node, 0);
            }
            return this;
        };

        this.encapsulate = function () {

        };

        var contentManage = function (content, scope) {
            if (content) {
                if (Array.isArray(content)) {
                    content.forEach(function (el){
                        contentManage(el, scope);
                    });
                } else if (content instanceof MWElement) {
                    scope.append(content);
                } else if (typeof content === 'object') {
                    scope.append(new MWElement(content));
                }
            }
        };

        this.create = function() {
            var el = this.document.createElement(this.settings.tag);
            this.node = el;

            if (this.settings.encapsulate === true) {
                var mode = this.settings.encapsulate === true ? 'open' : this.settings.encapsulate;
                el.attachShadow({
                    mode: mode
                });
            }
            this.nodes = [el];

            if (this.settings.content) {
                contentManage(this.settings.content, this)
            }
        };

        this._specialProps = function(dt, val){
            if(dt === 'tooltip') {
                this.node.dataset[dt] = val;
                return true;
            }
        };

        this.setProps = function(){
            for(var i in this.settings.props) {
                if (i === 'dataset') {
                    for(var dt in this.settings.props[i]) {
                        this.node.dataset[dt] = this.settings.props[i][dt];
                    }
                } else if (i === 'style') {
                    for(var st in this.settings.props[i]) {
                        this.node.style[st] = this.settings.props[i][st];
                    }
                } else {
                    var val = this.settings.props[i];
                    if(!this._specialProps(i, val)) {
                        this.node[i] = val;
                    }
                }
            }
        };

        this.__ = {
            cssNumber: [
                'animationIterationCount',
                'columnCount',
                'fillOpacity',
                'flexGrow',
                'flexShrink',
                'fontWeight',
                'gridArea',
                'gridColumn',
                'gridColumnEnd',
                'gridColumnStart',
                'gridRow',
                'gridRowEnd',
                'gridRowStart',
                'lineHeight',
                'opacity',
                'order',
                'orphans',
                'widows',
                'zIndex',
                'zoom'
            ]
        };

        this._normalizeCSSValue = function (prop, val) {
            if(typeof val === 'number') {
                if(this.__.cssNumber.indexOf(prop) === -1) {
                    val = val + 'px';
                }
            }
            return val;
        };

        this.css = function(css, val){
            if(typeof css === 'string') {
                if(typeof val !== 'undefined'){
                    var nval =  this._normalizeCSSValue(css, val);
                    this.each(function (){
                        this.style[css] = nval;
                    });
                } else {
                    return this.document.defaultView.getComputedStyle(this.node)[css];
                }
            }
            if(typeof css === 'object') {
                for (var i in css) {

                    this.each(function (){
                        this.style[i] = scope._normalizeCSSValue(i, css[i]);
                    });
                }
            }
            return this;
        };

        this.dataset = function(prop, val){
            if(typeof val === 'undefined') {
                return this._active()[prop];
            }
            this.each(function (){
                this.dataset[prop] = val;
            });
            return this;
        };

        this.attr = function(prop, val){
            if(typeof val === 'undefined') {
                return this._active()[prop];
            }
            this.each(function (){
                this.setAttribute(prop, val);
            });
            return this;
        };

        this.val = function(val){
            if(typeof val === 'undefined') {
                return this._active().value;
            }
            this.each(function (){
                this.value = val;
            });
            return this;
        };

        this.prop = function(prop, val){
            var active = this._active();
            if(typeof val === 'undefined') {
                return active[prop];
            }
            if(active[prop] !== val){
                active[prop] = val;
                this.trigger('propChange', [prop, val]);
            }
            return this;
        };

        this.hide = function () {
            return this.each(function (){
                this.style.display = 'none';
            });
        };
        this.show = function () {
            return this.each(function (){
                this.style.display = '';
            });
        };

        this.find = function (sel) {
            var el = mw.element('#r' + new Date().getTime());
            this.each(function (){
                var all = this.querySelectorAll(sel);
                for(var i = 0; i < all.length; i++) {
                    if(el.nodes.indexOf(all[i]) === -1) {
                        el.nodes.push(all[i]);
                    }
                }
            });
            return el;
        };

        this.addClass = function (cls) {
            cls = cls.trim().split(' ');
            return this.each(function (){
                var node = this;
                cls.forEach(function (singleClass){
                    node.classList.add(singleClass);
                });

            });
        };

        this.toggleClass = function (cls) {
            return this.each(function (){
                this.classList.toggle(cls.trim());
            });
        };

        this.removeClass = function (cls) {
            var isArray = Array.isArray(cls);
            if(!isArray) {
                cls = cls.trim();
                var isMultiple = cls.split(' ');
                if(isMultiple.length > 1) {
                    return this.removeClass(isMultiple)
                }
                return this.each(function (){
                    this.classList.remove(cls);
                });
            } else {
                return this.each(function (){
                    var i = 0, l = cls.length;
                    for ( ; i < l; i++) {
                        this.classList.remove(cls[i]);
                    }
                });
            }
        };

        this.remove = function () {
            return this.each(function (){
                this.remove();
            });
        };

        this.empty = function () {
            return this.html('');
        };

        this.html = function (val) {
            if (typeof val === 'undefined') {
                return this._active().innerHTML;
            }
            return this.each(function (){
                this.innerHTML = val;
            });
        };
        this.text = function (val, clean) {
            if(typeof val === 'undefined') {
                return this.node.textContent;
            }
            if(typeof clean === 'undefined') {
                clean = true;
            }
            if (clean) {
                val = this.document.createRange().createContextualFragment(val).textContent;
            }
            this.node.innerHTML = val;
        };

        this._asdom = function (obj) {
            if (typeof obj === 'string') {
                return this.document.createRange().createContextualFragment(obj);
            } else if (obj.node){
                return obj.node;
            }
            else if (obj.nodes){
                return obj.nodes[obj.nodes.length - 1];
            } else {
                return obj;
            }
        };

        this.offset = function () {
            var curr = this._active();
            var win = this.getWindow();
            var rect = curr.getBoundingClientRect();
            rect.offsetTop = rect.top + win.pageYOffset;
            rect.offsetBottom = rect.bottom + win.pageYOffset;
            rect.offsetLeft = rect.left + win.pageXOffset;
            return rect;
        };


        this.width = function (val) {
            if(val) {
                return this.css('width', val);
            }
            return this._active().offsetWidth;
        };

        this.height = function (val) {
            if(val) {
                return this.css('height', val);
            }
            return this._active().offsetHeight;
        };

        this.parent = function () {
            return mw.element(this._active().parentNode);
        };
        this.parents = function (selector) {
            selector = selector || '*';
            var el = this._active();
            var curr = el.parentElement;
            var res = mw.element();
            res.nodes = []
            while (curr) {
                if(curr.matches(selector)) {
                    res.nodes.push(curr);
                }
                curr = curr.parentElement;
            }
            return res;
        };
        this.append = function (el) {

            if (el) {
                this.each(function (){
                    this.append(scope._asdom(el));
                });
            }
            return this;
        };

        this.before = function (el) {
            if (el) {
                this.each(function (){
                    if(this.parentNode){
                        this.parentNode.insertBefore(scope._asdom(el), this);
                    }
                });
            }
            return this;
        };

        this.after = function (el) {
            if (el) {
                this.each(function (){
                    if(this.parentNode) {
                        this.parentNode.insertBefore(scope._asdom(el), this.nextSibling);
                    }
                });
            }
        };

        this.prepend = function (el) {
            if (el) {
                this.each(function (){
                    this.prepend(scope._asdom(el));
                });
            }
            return this;
        };
        this._disabled = false;

        Object.defineProperty(this, "disabled", {
            get : function () { return this._disabled; },
            set : function (value) {
                this._disabled = value;
                this.node.disabled = this._disabled;
                this.node.dataset.disabled = this._disabled;
            }
        });

        this.trigger = function(event, data){
            data = data || {};
            this.each(function (){
                this.dispatchEvent(new CustomEvent(event, {
                    detail: data,
                    cancelable: true,
                    bubbles: true
                }));
                if(scope._on[event]) {
                    scope._on[event].forEach(function(cb){
                        cb.call(this, event, data);
                    });
                }
            });
            return this;
        };

        this.get = function (i) {
            return this.nodes[i];
        };

        this.wrap = function (what) {
            var newEl = DomQuery(what);
            this.before(newEl)
            newEl.append(this)
        }

        this._on = {};
        this.on = function(events, cb){
            events = events.trim().split(' ');
            events.forEach(function (ev) {
                if(!scope._on[ev]) {  scope._on[ev] = []; }
                scope._on[ev].push(cb);
                scope.each(function (){
                    /*this.addEventListener(ev, function(e) {
                        cb.call(scope, e, e.detail, this);
                    }, false);*/
                    this.addEventListener(ev, cb, false);
                });
            });
            return this;
        };
        this.init = function(){
            this.nodes = [];
            this.root = root || document;
            if(this.root instanceof MWElement) {
                this.root = this.root.get(0)
            }
            this._asElement = false;
            this.document =  (this.root.body ? this.root : this.root.ownerDocument);

            options = options || {};

            if(options.nodeName && options.nodeType) {
                this.nodes.push(options);
                this.node = (options);
                options = {};
                this._asElement = true;
            } else if(typeof options === 'string') {
                if(options.indexOf('<') === -1) {

                    this.nodes = Array.prototype.slice.call(this.root.querySelectorAll(options));
                    options = {};
                    this._asElement = true;
                } else if(this.settings && this.settings.content instanceof MWElement) {
                    this.append(this.settings.content);
                }  else if(this.settings && typeof this.settings.content === 'object') {
                    this.append(new MWElement(this.settings.content));
                }else {
                    var el = this._asdom(options);

                    this.nodes = [].slice.call(el.children);
                    this._asElement = true;
                }
            }

            options = options || {};

            var defaults = {
                tag: 'div',
                props: {}
            };

            this.settings = ObjectService.extend({}, defaults, options);

            if(this._asElement) return;
            this.create();
            this.setProps();
        };
        this.init();
    };
const DomQuery = function(options, root){
    return new MWElement(options, root);
};
DomQuery.module = function (name, func) {
    MWElement.prototype[name] = func;
};




const nodeName = 'mw-le-element';
if (window.customElements && !customElements.get(nodeName)) {
    customElements.define( nodeName,
        class extends HTMLElement {
            constructor() {
                super();
            }
        }
    );
}
export const ElementManager = (config, root) => {
    if (config instanceof Object && !config.nodeType) {
        config = ObjectService.extend({}, config || {}, { tag: config.tag || nodeName });
    }
    return DomQuery(config, root)
}
