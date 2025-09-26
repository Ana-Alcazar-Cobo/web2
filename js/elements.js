document.addEventListener('DOMContentLoaded', () => {
    class customSpace extends HTMLElement{
        static get observedAttributes() {
            return ['height', 'width', 'background-color', 'display'];
        }
        constructor(){
            super();
        }
        connectedCallback() {
            this.updateStyle();
        }
        attributeChangedCallback(name, oldValue, newValue) {
            this.updateStyle();
        }
        updateStyle() {
            const height = this.getAttribute('height') || 'auto';
            const width = this.getAttribute('width') || 'auto';
            const backgroundColor = this.getAttribute('background-color') || 'transparent';
            const display = this.getAttribute('display') || 'block'; // default block

            this.style.height = height;
            this.style.width = width;
            this.style.backgroundColor = backgroundColor;
            this.style.display = display;

            // If parent is a flex container, grow to fill available space
            if ((this.parentElement && getComputedStyle(this.parentElement).display === 'flex') && display === 'flex') {
                this.style.flexGrow = '1';
                this.style.flexShrink = '1';
                this.style.flexBasis = 'auto';
            } else {
                // Reset flex-grow if parent is not flex
                this.style.flexGrow = '0';
                this.style.flexShrink = '0';
                this.style.flexBasis = 'auto';
            }
        }
    }
    customElements.define('custom-space', customSpace);
});