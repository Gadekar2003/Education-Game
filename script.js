function signup(){
  const username=document.getElementById('signup-username').value;
  const password=document.getElementById('signup-password').value;
  const role=document.getElementById('signup-role').value;
  if(!username||!password){
    document.getElementById('signup-msg').innerText
    ="All fileds are required";
    return;
  }
  const users=JSON.parse(localStorage.getItem("users")||[]);
  //chech if username already exists
  const exiciting=users.find(user=>user.username==username);
  if(exiciting){
    document.getElementById('signup-msg').innerText="Username already exists!";
    return;
  }
  //add new user
  users.push({username,password,role});
  localStorage.setItem("users",JSON.stringify(users));
  document.getElementById('signup-msg').innerText="Signup successful! Redirecting to login...";
  setTimeout(()=>{
    window.location.href="login.html";
  },1500);
}
