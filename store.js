if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
}else{
    ready();
}

async function ready() 
{

    updateWelcomeMessage();  // ← כאן!

    var cartItems = document.getElementsByClassName('cart-items')[0];
    var storedCart = localStorage.getItem("cart")
    if (storedCart !=null)
        cartItems.innerHTML = storedCart; 

    await loadProductsFromServer();

    updateCartTotal()
    

    var removeCartItemButtons = document.getElementsByClassName('btn-danger')
    for (var i = 0; i < removeCartItemButtons.length; i++) {
        var button = removeCartItemButtons[i]
        button.addEventListener('click', removeCartItem)
    }

    var quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i]
       
        input.addEventListener('change', quantityChanged)
    }

    var addToCartButtons = document.getElementsByClassName('shop-item-button')
    
    for (var i = 0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
    }

    if (document.getElementsByClassName('btn-purchase').length > 0)
        document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)

}

async function loadProductsFromServer() {
    try {
        // קריאת כל המוצרים מהשרת
        const res = await fetch("http://localhost:3000/api/products");
        if (!res.ok) {
            console.error("בעיה בקריאת מוצרים מהשרת", res.status);
            return;
        }

        const products = await res.json(); // מערך של מוצרים ממונגו
        console.log("מוצרים מהשרת:", products);

        // מוצאים את הקונטיינר של המוצרים בדף
        const shopItemsContainer = document.querySelector(".shop-items");
        shopItemsContainer.innerHTML = ""; // לוודא שהקונטיינר ריק

        // עבור כל מוצר – ניצור HTML כמו שהיה קודם
        products.forEach((product) => {
            // product.title, product.price, product.imageUrl, product.description

            const itemDiv = document.createElement("div");
            itemDiv.classList.add("shop-item");

            itemDiv.innerHTML = `
                <img class="shop-item-image" src="${product.imageUrl}">
                <span class="shop-item-title">${product.title}</span>
                <span class="shop-item-d">${product.description || ""}</span>
                <div class="shop-item-details">
                    <span class="shop-item-price">$${product.price}</span>
                    <button class="btn btn-primary shop-item-button" type="button">ADD TO CART</button>
                </div>
            `;

            shopItemsContainer.appendChild(itemDiv);
        });

        const user = getUserFromToken();



    } catch (err) {
        console.error("שגיאה בטעינת מוצרים מהשרת:", err);
    }

}



function getUserFromToken() {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const payload = token.split(".")[1]; 
    const decoded = JSON.parse(atob(payload));  
    return decoded; 
}




function purchaseClicked() {
    var ok =confirm("Continue to purchase?");
    if(ok)
    {
    var credit =prompt("ENTER CREDIT:");
    alert('Thank you for your purchase')/*הודעת רכישה בהצלחה */
    var cartItems = document.getElementsByClassName('cart-items')[0]
    while (cartItems.hasChildNodes()) {/*מסיר פריטים מהעגלה לאחר הרכישה */
        cartItems.removeChild(cartItems.firstChild)
    }
    updateCartTotal()/*יעדכן את הסכום הכולל בהתאם */
}
}

function removeCartItem(event) {
    var buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove()/*מוחק את הפריט -DIV גדול */
    updateCartTotal()
}

function quantityChanged(event) {
    
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }

    updateCartTotal()
}


function addToCartClicked(event) {
   
    var button = event.target
    var shopItem = button.parentElement.parentElement
    var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
    var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText
    var imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src
    addItemToCart(title, price,imageSrc )
    updateCartTotal()
}

function addItemToCart(title, price, imageSrc) {
    
    var cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    var cartItems = document.getElementsByClassName('cart-items')[0]
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title')
    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == title) {
            alert('This item is already added to the cart')
            return
        }
    }
    var cartRowContents = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn btn-danger" type="button">REMOVE</button>
        </div>`
    cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)
    //localStorage.setItem("cart",cartItems.innerHTML)
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
} 

function updateCartTotal() {
    var obj = document.getElementsByClassName('cart-items').length
    if (obj <= 0)
        return;

    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    var total = 0
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        var price = parseFloat(priceElement.innerText.replace('$', ''))
        var quantity = quantityElement.value
        cartRow.getElementsByClassName('cart-quantity-input')[0].setAttribute('value', `${quantity}`)
        total = total + (price * quantity)
    }
    total = Math.round(total * 100) / 100
    document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total
    

    var cartItems = document.getElementsByClassName('cart-items')[0]
    localStorage.setItem("cart",cartItems.innerHTML)
}


function thankyou()/*new.....*/
{
    var SignUp = document.getElementById("new").value;
    if (SignUp) {
        
        alert("Thanks For Signing Up");
    } else {
        alert("ERROR");
    }


}

function goShopPage(){
    window.location.href = 'shop.html';
}


/*var storedItem = localStorage.getItem("storedItem"); /*defines a localSotrage named storedItem

function save(){

    //event.preventDefault(); // מניעת העדכון האוטומטי של הטופס
    var Item = document.getElementById("Username").value; /*מושך את השם משתמש בהלוג*/
   // localStorage.setItem("storedItem", Item); /*מאחסן את השם המשוך במאגר הלוקלי שקראנו לו בשם סטוראיטם

   // if (Item != "" )
    //{
    //    document.getElementById("Username").value = ""; // temp patch

     //   window.location.href = "store.html"; // מעבר לדף home.html
        //window.URL = "store.html";
   // }
//}

//function printWelcomeMessage() {

   // const storedItems = localStorage.getItem("storedItem"); // משיכת הערך מהמאגר הנתונים הלוקלי

    // אם קיים ערך שמור
    //if (storedItems) {
        // הדפסת הערך עם המילה "ברוך הבא"
     //   document.getElementById("welcomeMessage").innerText = "welcome " + storedItems + "!";
    //} else {
        // אם אין ערך שמור, הדפס הודעת שגיאה
    //    document.getElementById("welcomeMessage").innerText ="Hello, guest!";
   // }
//}

function updateWelcomeMessage() {
    const user = getUserFromToken();

    if (!user) {
        document.getElementById("welcomeMessage").innerText = "Hello, guest!";
        return;
    }

    // חשוב — השם האמיתי מגיע מהשרת והוא שמור ב-token
    document.getElementById("welcomeMessage").innerText = "Hello, " + user.name + "!";
}



