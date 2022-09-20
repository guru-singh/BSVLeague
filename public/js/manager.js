
const managerLoader = $('.loader-wrapper-login');
const managerBody = $('body');
const _DESIGNATION_KAM = ['KAM', 'Sr KAM', 'ZBM'];
const _POSTMANAGERLOGINURL = '/manager/my-dashboard'

function getSelectedPendingTask(id) {
    console.log(id);
    isEnableApproveBtn();
}

const isEnableApproveBtn = () => {

    const isApproveBtn = $('#isApprove');

    if($('.selectedchk:checked').length > 0) {
        isApproveBtn.removeAttr('disabled');
    } else {
        isApproveBtn.attr("disabled", true);
    }
};

const ischkBtnVisible = () => {
    if(getQueryStringValueByPara('approve') === 'true') {
        $('.isapprovepage').addClass('none');
        setTimeout(() => {
            $('#pendingTaskList .isapprovepage').addClass('none');
        }, 1000);
    } else {
        $('.isapprovepage').removeClass('none');
        setTimeout(() => {
            $('#pendingTaskList .isapprovepage').removeClass('none');
        }, 1000);
    }
};

const isPendingHeading = () => {
    const headingElem = $('#taskHeadingTxt');
    if(getQueryStringValueByPara('approve') === 'true') {
        headingElem.text('Approved Task');
    } else {
        headingElem.text('Pending Task');
    }
};

let getTaskList = [];





const loadMyTeamTask = (isApproved) => {

    let param = {
        method: 'myTeamTask',
    }, 
    approvedData;

    axios
        .post("/manager/api", param).then((response) => {
            
            
            const pendingTaskList = $('#pendingTaskList');
            let showHtml = [];
            let approvedData = response.data;
            approvedData = approvedData.filter(tast => tast.isApproved === isApproved);
            console.log(approvedData);

            approvedData.forEach((elem, indx, arr) => {
                showHtml.push(`
                        <tr>
                        <td class="isapprovepage">
                            <div class="checkbox disabled">
                                <label><input type="checkbox" value="${elem.taskId}" class="selectedchk" onclick="getSelectedPendingTask(${elem.taskId})"></label>
                            </div>
                        </td>
                        <td>${elem.firstName}</td>
                        <td>${elem.taskName}</td>
                        <td>${elem.performedOn}</td>
                    </tr>
                `);
            });

            pendingTaskList.html(showHtml.join(''));
           
        }).catch((err) => {
            console.log(err);
        });
};




const validatePendingTask = () => {

    let allSelectedData = [];

    $('.selectedchk:checked').each(function() {
        //console.log(this.value);
        allSelectedData.push(this.value);
     });

     console.log(allSelectedData);

     let param = {
        checkedId: 0,
        method: 'pendingTask'
     };

     for(let selectedData of allSelectedData) {

        param.checkedId = parseInt(selectedData);
        console.log(param.checkedId);

        axios
        .post("/manager/api", param)
        .then((response) => {
        })
        .catch((err) => {
            console.log("inside catch");
            console.log(err);
        });

     }
}

const validateManagerUserDetails = () => {

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
        method: 'managerLogin'
    };

    console.log(param);

    managerLoader.removeClass('none');
    managerBody.addClass('overflow-hidden');

    axios
        .post("/manager/api", param)
        .then((response) => {
            //console.log(response.data);
            //console.log(response.data.userDetiails);
            localStorage.setItem("endUserData", JSON.stringify(response.data.userDetiails));
            (response.data.success === true) ? (document.location.href = _POSTMANAGERLOGINURL) : $('#lblmsg').text(response.data.msg)
        })
        .catch((err) => {
            console.log("inside catch");
            console.log(err);
        });
}

$(function () {

    ischkBtnVisible();
    isPendingHeading();
    onTaskSelection();

    if(window.localStorage.getItem('userData')) {
        loadTask();
        loadPerfomedTask();
        loadMyTeamTask(false);
        
        setTimeout(() => {
            console.log('Task List', getTaskList);
        }, 3000);
    } 


    
$('#ckbCheckAll').on('click', function(){
    if(this.checked) {
        $('.selectedchk').each(function(){
            this.checked = true;
        });
    } else {
        $('.selectedchk').each(function(){
            this.checked = false;
        });
    }

    isEnableApproveBtn();
});

// $('.selectedchk').on('click',function() {
//     console.log('checked');
//     // if($('.selectedchk:checked').length == $('.selectedchk').length){
//     //     $('#ckbCheckAll').prop('checked',true);
//     // }else{
//     //     $('#ckbCheckAll').prop('checked',false);
//     // }
//     // isEnableApproveBtn();
// });

});


function setupNavLinks() {
    let userData = JSON.parse(localStorage.getItem("userData")),
        designation = userData.post;
        console.clear();
        console.log('===========================')
        console.log('HTIS IS GETTTING CALLED')
        console.log('===========================')
    if (_DESIGNATION_KAM.includes(designation)) {
        // LOGGEDIN USER IS A KAM
        $('.manager').each((i, e) => {
            $(e).hide();
        })
    }
}

