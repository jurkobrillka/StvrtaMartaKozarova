class HeaderTitleDiv extends HTMLElement {

    constructor() {
        super();

        this.attachShadow({mode: "open"});

        this.block = document.createElement("div");
        this.block.id = "block";

        this.titleBlock = document.createElement("div");
        this.titleBlock.id = "titleBlock";

        this.titleText = document.createElement("p");
        this.titleText.id = "titleText";
        this.titleText.textContent = this.getAttribute("titleText") || "UF Čo to?"

        this.infoBlock = document.createElement("div");
        this.infoBlock.id = "infoBlock";


        this.infoText = document.createElement("p");
        this.infoText.id = "infoText";
        this.infoText.innerHTML = this.getAttribute("infoText") || "Niečo sa muselo pokaziť,<br /> <i>sorry</i>";
        //this.infoText.innerHTML = "Ako som s kamošmi prešiel Európu,<br /> <i>stopom</i>"


        this.titleBlock.appendChild(this.titleText);
        this.infoBlock.appendChild(this.infoText);

        this.block.appendChild(this.titleBlock);
        this.block.appendChild(this.infoBlock);

        this.shadowRoot.appendChild(this.block);

        const lookCss = document.createElement("style");
        lookCss.innerHTML = `


#block{
    color: #f2f2f2;
    display: flex;
    flex-direction: row;
    padding: 2rem;
    margin: 2rem;
    background-color: #26547C;
    
    border-bottom-right-radius: 3rem;
    border-top-left-radius: 3rem;
}

#infoBlock{
    align-items: center; /* Add this line to center vertically */
    justify-content: flex-start;
    display: flex;
    flex: 4;
    border-left: #f2f2f2 2px solid;
}
#titleBlock{
    align-items: center; /* Add this line to center vertically */
    justify-content: flex-start;
    display: flex;
    flex: 1;
    border-right: black 1.5px solid;
}


#infoText{
    margin-left: 1rem;
    font-size: 1rem;
    display: inline-block;
}

#titleText{
font-size: 1.5rem;
}
        `


        this.shadowRoot.appendChild(lookCss);
    }

    static get observedAttributes() {
        return ["titleText", "infoText"];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "titleText" && this.titleText) {
            this.titleText.textContent = newValue || "NAZOV";
        } else if (name === "infoText" && this.infoText) {
            this.infoText.innerHTML = newValue || "Ako som s kamošmi prešiel Európu,<br /> <i>stopom</i>";
        }
    }

}

customElements.define("header-title", HeaderTitleDiv);