// for toggle button
let login = document.getElementById("login");
let register = document.getElementById("register");
let toggleBtn = document.getElementById("btn");

function toggleRegister(){
    login.style.left = "-400px";
    register.style.left = "50px";
    toggleBtn.style.left = "110px";
}

function toggleLogin(){
    login.style.left = "50px";
    register.style.left = "450px";
    toggleBtn.style.left = "0px";
}
//

//for registration
register.addEventListener("submit" , async(e) => {
    e.preventDefault();
    const username = document.getElementById("regUsername").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPass").value;
    
    try{
        const response = await fetch('http://localhost:3000/auth/register' ,{
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username,email,password}),
        });

        if(!response.ok){
            const errorData = await response.json();
            alert(errorData.error);
        }
        else{
            const successMessage = await response.json();
            alert(successMessage.message);
            window.location.href = '/';
        }
    }catch(error){
        console.error('Register failed: ', error.message);
    }
});
//

//for login
login.addEventListener("submit", async(e) => {
    e.preventDefault();
    const username = document.getElementById('loginUser').value;
    const password = document.getElementById('loginPass').value;

    try{
        const response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username,password}),
        });

        if(!response.ok){
            const errorData = await response.json();
            alert(errorData.error);
        }
        else{
            const userData = await response.json();
            alert('Login successful');
            window.location.href = '/home';
        }
    }catch(error){
        console.log('Login failed: ', error.message);
    }
});


