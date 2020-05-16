const search_url="http://search.unbxd.io/fb853e3332f2645fac9d71dc63e09ec1/demo-unbxd700181503576558/search?&q=";

window.onload= function() {
  fetchProductDetails("*");
};

function fetchProductDetails(searchTerm){
    let searchParam = searchTerm ? searchTerm : '*';
    let searchUrl=search_url+searchParam
    fetch(searchUrl).then((resp) => resp.json()).then(function(data) {
        displayProducts(data.response.products);
        displayProductCount(data.response.numberOfProducts);
        displayFilters(data.facets)
    })
    .catch(function(err) {console.log(err)})
}

const throttle = (fn, limit) => {
  let flag = true;
  return function(){
    let context = this;
    let args = arguments;
    if(flag){
      fn.apply(context, args);
      flag = false;
      setTimeout(() => {
        flag=true;
      }, limit);
    }
  }
}

function onSubmitSearch (){
    let inputValue=document.getElementById('unbxd-search').value;
    if(inputValue){
        fetchProductDetails(inputValue);
    }
}

function displayProductCount(count) {
    document.getElementById("product-count").innerHTML=`Search -  ${count} `;
}

function generateFilterComponent(facetName,facetCount) {
    return `<li>
                <input type="checkbox" id="${facetName}">
                <label>${facetName} (${facetCount})</label>
            </li>`
}

function generateFilterList(facetValues){
    let facetValue='';
        facetValues && facetValues.forEach((facet,index)=>{
            if(index%2===0){
                facetValue=facetValue.concat(this.generateFilterComponent(facet,facetValues[index+1]));
            }
        })
    return facetValue;
}

function generateFilterFragment(facet) {
    return `<div class="facet-container">
                <div class="facet-title">${facet.displayName}</div>
                <ul class="facet-list">
                    ${(generateFilterList(facet.values))}
                </ul>
            </div>`
}

function generateProductComponent(product){
    return `<a href="http://demo-unbxd.unbxdapi.com/product?pid=${product.productId}" target="_blank">
                <div class="product-column" >
                    <img class="productImage" src="${product.productImage}">
                    <div class="name">${product.name}</div>
                    <div class="price">${product.displayPrice}</div>
                </div>
            </a>`
}

function displayProducts(products){
    var productHTML='';
    products.forEach((product)=>{
        productHTML=productHTML.concat(this.generateProductComponent(product));
    })
    document.getElementById('product-row').innerHTML=productHTML;
}

function displayFilters(facets){
    var facetHTML='';
    Object.keys(facets).forEach(function(key) {
        if(facets[key] && facets[key].values &&facets[key].values.length >0){
          facetHTML=facetHTML.concat(generateFilterFragment(facets[key]))
       }
    });
    document.getElementById('filter').innerHTML=facetHTML;
}

throttle(fetchProductDetails,300);