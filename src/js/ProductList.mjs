const productCartTemplate = (product) => {
    return `<li class="product-card">
            <a href="product_pages/?product">
              <img
                src=""
                alt=""
              />
              <h3 class="card__brand"></h3>
              <h2 class="card__name"></h2>
              <p class="product-card__price">$</p>
            </a>
          </li>`;
}

class ProductList{
    constructor(category, dataSource, listElement){
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = listElement;
    }

    async init(){
        const list = await this.dataSource.getData();
        this.renderList(list);
    }

    renderList(list){
        list.forEach(product => {
            const productTemplate = productCartTemplate(product);
            this.listElement.appendChild(productTemplate);
        });
    }
}

export default ProductList;