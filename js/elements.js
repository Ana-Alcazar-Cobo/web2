export class customSpace extends HTMLElement{
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
};

export class customTag extends HTMLElement {
    static get observedAttributes() {
      return ['tag', 'active', 'blocked'];
    }
  
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
  
      // Crear botón
      this.button = document.createElement('button');
  
      // Crear estilos
      const style = document.createElement('style');
      style.textContent = `
        button {
          border-radius: 15px;
          background-color: #ccc;
          border: none;
          padding: 6px 12px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        button.active {
          background-color: #4caf50;
          color: white;
        }
        button.blocked {
          cursor: not-allowed;
        }
      `;
  
      this.shadowRoot.append(style, this.button);
    }
  
    connectedCallback() {
      this.button.addEventListener('click', () => {
        if (this.blocked) return; // bloqueado, no hacer nada
  
        // Alternar atributo "active"
        if (this.active) {
          this.removeAttribute('active');
        } else {
          this.setAttribute('active', '');
        }
  
        // Emitir evento personalizado
        this.dispatchEvent(new CustomEvent('tag-toggle', {
          detail: {
            tag: this.tag,
            selected: this.active,
          },
          bubbles: true,
        }));
      });
  
      // Inicializar estado del botón
      this._updateButton();
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      this._updateButton();
    }
  
    _updateButton() {
      this.button.textContent = this.tag || 'Etiqueta';
      this.button.disabled = this.blocked;
      
      // Actualizar clases
      this.button.classList.toggle('active', this.active);
      this.button.classList.toggle('blocked', this.blocked);
    }
  
    // Getter para atributo "tag"
    get tag() {
      return this.getAttribute('tag');
    }
  
    // Getter booleano para "active"
    get active() {
      return this.hasAttribute('active');
    }
  
    // Getter booleano para "blocked"
    get blocked() {
      return this.hasAttribute('blocked');
    }
  }  