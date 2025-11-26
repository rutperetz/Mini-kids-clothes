if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
}else{
    ready();
}

async function ready() 
{

    updateWelcomeMessage();  
}

// Get user info from token
function getUserFromToken() {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const payload = token.split(".")[1]; 
    const decoded = JSON.parse(atob(payload));  
    return decoded; 
}

// Load cart items from server
function thankyou()
{
    var SignUp = document.getElementById("new").value;
    if (SignUp) {
        
        alert("Thanks For Signing Up");
    } else {
        alert("ERROR");
    }


}

// Go to shop page
function goShopPage(){
    window.location.href = 'shop.html';
}

// Update welcome message based on logged-in user
function updateWelcomeMessage() {
    const user = getUserFromToken();

    if (!user) {
        document.getElementById("welcomeMessage").innerText = "Hello, guest!";
        return;
    }

    document.getElementById("welcomeMessage").innerText = "Hello, " + user.name + "!";
}



