
const isUserLoggedIn = () => {
   
    let userDetail = JSON.parse(localStorage.getItem('endUserData'));
  // console.log(userDetail);
    if(userDetail == null) {
         window.location.href = '/manager/login';
    } else {
      $('#userName').text(userDetail.name);
     // console.log(userDetail);
    }
};

const logOut = () => {
    localStorage.clear();
    window.location.href = '/manager/login';
};

$(function(){
    isUserLoggedIn();
});