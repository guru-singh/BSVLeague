
const isUserLoggedIn = () => {
    let userDetail = JSON.parse(window.localStorage.getItem('userData'));
    console.log(userDetail);
    if(userDetail == null) {
        window.location.href = '/admin';
    } else {
      $('#username').text(userDetail.name);
      console.log(userDetail);
    }
};

const logOut = () => {
    localStorage.clear();
    window.location.href = '/admin';
};

$(function() {
    isUserLoggedIn();
});