
const _POSTLOGINURL = '/task-list';

const loginLoader = $('.loader-wrapper-login');
const loginBody = $('body');

const loadNavigation = () => {
    $('#frondHeader').load('includes/header.html');
};

const loadFooter = () => {
    $('#frondFooter').load('includes/footer.html');
};

const loadAdminNavigation = () => {
    $('#adminHeader').load('/includes/adminHeader.html');
};


const loadAdminFooter = () => {
    $('#adminFooter').load('/includes/adminFooter.html');
};

const loadManagerHeader = () => {
    $('#managerHeader').load('/includes/managerHeader.html');
};

const getCurrentId = () => {
    const baseUrl = window.location.href;
    const id = baseUrl.substring(baseUrl.lastIndexOf('/') + 1);
    return parseInt(id);
};

const validateAdminUserDetails = () => {

    if ($("#username").val() === "") {
        alert("please enter your username");
        $("#username").focus();
        return false;
    }

    if ($("#password").val() === "") {
        alert("please enter your password");
        $("#password").focus();
        return false;
    }

    let param = {
        username: $("#username").val(),
        password: $("#password").val(),
        method: 'login'
    };

    loginLoader.removeClass('none');
    loginBody.addClass('overflow-hidden');

    axios
        .post("/admin/api", param)
        .then((response) => {
            console.log(response.data.success);
            console.log(response.data);
            localStorage.setItem("userData", JSON.stringify(response.data.userDetiails));
            (response.data.success === true) ? (document.location.href = _POSTLOGINURL) : $('#lblmsg').text(response.data.msg)
        })
        .catch((err) => {
            console.log("inside catch");
            console.log(err);
        });
}

const getQueryStringValueByPara = (param) => {
    if(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }
};

const getDescendingDataByDateTime = (arrObj) => {

    return arrObj.sort((a, b) => {
        const aDate = new Date(a.createdDate.date + ' ' + a.createdDate.time);
        const bDate = new Date(b.createdDate.date + ' ' + b.createdDate.time);
        return bDate.getTime() - aDate.getTime();
    }); 
}

$(function(){
    loadNavigation();
    loadFooter();
    loadAdminNavigation();
    loadAdminFooter();
    loadManagerHeader();
});