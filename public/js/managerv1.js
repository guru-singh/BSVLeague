const managerLoader = $('.loader-wrapper-login');
const managerBody = $('body');

function setupMyTaskPage() {
    //  console.clear();
    console.log(window.localStorage.getItem('endUserData'))
    if (window.localStorage.getItem('endUserData')) {
        //loadTask();
        loadPerfomedTask();
        // loadMyTeamTask(false);

        // setTimeout(() => {
        //     console.log('Task List', getTaskList);
        // }, 3000);
    } else {

        localStorage.clear();
        window.location.href = '/manager/login';
    }
}

function loadPerfomedTask() {

    let userData = JSON.parse(localStorage.getItem("endUserData")),
        param = {
            method: 'myPerfomedTask',
            empId: userData.empId
        };

    managerLoader.removeClass('none');
    managerBody.addClass('overflow-hidden');

    axios
        .post("/manager/api", param).then((response) => {
            console.log(response.data.recordset);
            let showHtml = '';
            response.data.recordset.forEach((elem, indx, arr) => {
                showHtml += `<tr>
                                <td>${elem.taskName}</td>
                                <td>${elem.taskDescp}</td>
                                <td>${elem.performedOn}</td>
                                <td align='right'>${elem.PointsEarned}</td>
                                <td>${elem.isApproved}</td>
                            </tr>`;
            });
            $('#myPerfomedTask').html(showHtml);
            managerLoader.addClass('none');
            managerBody.removeClass('overflow-hidden');

        }).catch((err) => {
            console.log(err);
        });
};

function ischkBtnVisible() {
    if (getQueryStringValueByPara('approve') === 'true') {
        $('.isapprovepage').addClass('none');
    } else {
        $('.isapprovepage').removeClass('none');
    }
};

function isEnableApproveBtn() {

    const isApproveBtn = $('#isApprove');

    if ($('.selectedchk:checked').length > 0) {
        isApproveBtn.removeAttr('disabled');
    } else {
        isApproveBtn.attr("disabled", true);
    }
};

ischkBtnVisible();

$('#ckbCheckAll').on('click', function () {
    if (this.checked) {
        $('.selectedchk').each(function () {
            this.checked = true;
        });
    } else {
        $('.selectedchk').each(function () {
            this.checked = false;
        });
    }

    isEnableApproveBtn();
});

$('#pendingTaskList').on('click', '.selectedchk', function () {
    //alert('Ram');
    console.log('checked');
    if ($('.selectedchk:checked').length == $('.selectedchk').length) {
        $('#ckbCheckAll').prop('checked', true);
    } else {
        $('#ckbCheckAll').prop('checked', false);
    }
    isEnableApproveBtn();
});

function validatePendingTask() {

    let allSelectedData = [];

    $('.selectedchk:checked').each(function () {
        allSelectedData.push(this.value);
    });

    console.log(allSelectedData);

    let param = {
        checkedId: 0,
        method: 'approvedTask'
    };

    for (let selectedData of allSelectedData) {

        param.checkedId = parseInt(selectedData);
        console.log(param.checkedId);
        axios
            .post("/manager/api", param)
            .then((response) => {
                console.log(response);
            })
            .catch((err) => {
                console.log("inside catch");
                console.log(err);
            });
    }
     window.location.href = '/manager/clear-session';
}

function setupPerformNewTaskPage() {
    if (window.localStorage.getItem('endUserData')) {
        loadTask();
        $('#chkihearby').on('click', function () {
            let checked_status = this.checked;
            const perfomBtn = $('#perfomBtn');
            if (checked_status == true) {
                perfomBtn.removeAttr("disabled");
            } else {
                perfomBtn.attr("disabled", "disabled");
            }
        });

    }
}

function onTaskSelection() {
    let taskId = $("#cmbtaskperfom option:selected").val(),
        selectedTask = getTaskList.find(x => x.taskId == taskId),
        selectedDesc = $('#selectDesc');
    if (selectedTask) {
        selectedDesc.text(selectedTask.taskDescp);
    }
}

function loadTask() {

    let param = {
        method: 'taskList',
        empId: 2,
        showAll: false
    }
        ;

    managerLoader.removeClass('none');
    managerBody.addClass('overflow-hidden');

    axios
        .post("/manager/api", param).then((response) => {
            $('#cmbtaskperfom').append('<option value="">  --- Select Task ---  </option>');

            // console.log(response.data.recordset);

            getTaskList = response.data;
            getTaskList.forEach(function (elem, indx, arr) {
                $('#cmbtaskperfom').append(`<option value="${elem.taskId}">${elem.taskName}</option>`);
            });
            managerLoader.addClass('none');
            managerBody.removeClass('overflow-hidden');

        }).catch((err) => {
            console.log(err);
        });
};

function validatePerform() {

    if ($("#cmbtaskperfom").val() === "") {
        alert("please select task");
        $("#cmbtaskperfom").focus();
        return false;
    }

    let isChecked = false;

    $('#chkihearby:checked').each(function () {
        isChecked = this.checked;
    });

    let userData = JSON.parse(localStorage.getItem("endUserData")),
        param = {
            taskId: $("#cmbtaskperfom option:selected").val(),
            method: 'createPerfomTask',
            empId: userData.empId
        };

    //console.log(param);

    managerLoader.removeClass('none');
    managerBody.addClass('overflow-hidden');

    axios
        .post("/manager/api", param)
        .then((response) => {
            document.location.href = '/manager/my-task';
            managerLoader.addClass('none');
            managerBody.removeClass('overflow-hidden');
            window.location.href = '/manager/my-task';
        })
        .catch((err) => {
            console.log("inside catch");
            console.log(err);
        });

};

/* ************************************ My Dashboard ************************************/
function setupMyDashboard() {
    if (window.localStorage.getItem('endUserData')) {
        loadMyDashboad();

    } else {

        localStorage.clear();
        window.location.href = '/manager/login';
    }
}

function loadMyDashboad() {
    let userData = JSON.parse(localStorage.getItem("endUserData")),
        param = {
            method: 'myDashboard',
            empId: userData.empId
        };

    managerLoader.removeClass('none');
    managerBody.addClass('overflow-hidden');

    axios
        .post("/manager/api", param).then((response) => {
            // console.log(response.data);

            let taskList = response.data,
                totalTask = taskList.length,
                ApprovedTask = taskList.filter(item => {
                    return (item.isApproved)
                }),
                PendingTask = taskList.filter(item => {
                    return (!item.isApproved)
                });
            PointsEarned = ApprovedTask.reduce((total, item) => {
                return parseInt(total + item.PointsEarned);
            }, 0),
                PointsYetToEarn = PendingTask.reduce((total, item) => {
                    return parseInt(total + item.PointsEarned);
                }, 0)
                ;


            console.log('****************************************************')
            console.log('Total Task: ' + totalTask);
            console.log('Approved Task: ' + ApprovedTask.length);
            console.log('Pending Task: ' + PendingTask.length);
            console.log('Points Earned: ' + PointsEarned);
            console.log('Points Yet to Earned: ' + PointsYetToEarn);
            $('#divTotalTask').html('Total Task: ' + totalTask);
            $('#divApprovedTask').html('Approved Task: ' + ApprovedTask.length);
            $('#divPendingTask').html('Pending Task: ' + PendingTask.length);
            $('#divPointsEarned').html('Points Earned: ' + PointsEarned);
            $('#divPointsYetEarned').html('Points Yet to Earn: ' + PointsYetToEarn);
            console.log('****************************************************')


            managerLoader.addClass('none');
            managerBody.removeClass('overflow-hidden');

        }).catch((err) => {
            console.log(err);
        });
    param = {
        method: 'myTeamTask',
        empId: userData.empId
    };

    if (userData.post != 'KAM' || userData.post != 'Sr KAM') {
        axios
            .post("/manager/api", param).then((response) => {
                let taskList = response.data,
                    myTeamApprovedTask = taskList.filter(item => {
                        return item.isApproved;
                    }),
                    myTeamPendingTask = taskList.filter(item => {
                        return !item.isApproved;
                    }),
                    myTeamApprovedTaskEarnedPoints = myTeamApprovedTask.reduce((total, item) => {
                        return parseInt(total + item.PointsEarned);
                    }, 0),
                    myTeamPointsYetToEarn = myTeamPendingTask.reduce((total, item) => {
                        return parseInt(total + item.PointsEarned);
                    }, 0);

                console.log('****************************************************')
                console.log('Total Task Submitted by team: ' + taskList.length);
                console.log('Total Approved Task from the team: ' + myTeamApprovedTask.length);
                console.log('Total Pending Task from the team: ' + myTeamPendingTask.length);
                console.log('Total Points earned by the team: ' + myTeamApprovedTaskEarnedPoints);
                console.log('Total Points Yet to be earned by the team: ' + myTeamPointsYetToEarn);



                $('#divMyTeamTotalTask').html('Total Task: ' + taskList.length);
                $('#divMyTeamApprovedTask').html('Approved Task: ' + myTeamApprovedTask.length);
                $('#divMyTeamPendingTask').html('Pending Task: ' + myTeamPendingTask.length);
                $('#divMyTeamPointsEarned').html('Points Earned: ' + myTeamApprovedTaskEarnedPoints);
                $('#divMyTeamPointsYetEarned').html('Points Yet to Earn: ' + myTeamPointsYetToEarn);
                console.log('****************************************************')


                managerLoader.addClass('none');
                managerBody.removeClass('overflow-hidden');

            }).catch((err) => {
                console.log(err);
            });

    }
    // top user in my category
}

function myDashboardChartData() {
    let userData = JSON.parse(localStorage.getItem("endUserData")),
        param = {
            method: 'dashboardData',
            empId: userData.empId
        };
    axios
        .post("/manager/api", param).then((response) => {
            console.clear();
            console.log(response.data);
            // task performed as my collegues
            console.table(response.data[0])
            console.log('Task Performed Today- ' + response.data[1][0].TaskPerformedToday)
            console.log('Task Performed Yesterday- ' + response.data[2][0].TaskPerformedYesterday)
            console.log('Task Performed last week- ' + response.data[3][0].TaskPerformedLastWeek)
            console.log('Task Performed last 15 days- ' + response.data[4][0].TaskPerformedLast15days)
            console.log('Task Performed last 30 days - ' + response.data[5][0].TaskPerformedLast30days)
            console.log('DAY WISE - not approved')
            console.table(response.data[6].filter((rec) => { return !rec.isApproved }))
            console.log('DAY WISE - approved')
            console.table(response.data[6].filter((rec) => { return rec.isApproved }))
            let chartData = [['Name', 'Points Earned', 'Task Performed']];
            response.data[0].forEach(rec => {
                let tmpArr = []
                tmpArr.push(rec.firstName, rec.pointsEarned, rec.totalTaskPerformed)
                chartData.push(tmpArr);
            })

            var data = google.visualization.arrayToDataTable(chartData);

            var options = {
                title: 'Task performed by my Collegues',
                vAxis: { title: 'Points' },
                hAxis: { title: 'My Collegues' },
                seriesType: 'bars',
                series: { 4: { type: 'line' } },
                height: 250,
                width: 850,
                bar: {groupWidth: "25%"},
                backgroundColor: { fill:'transparent' }
            };

            var chart = new google.visualization.ComboChart(document.getElementById('chart_div'));
            chart.draw(data, options);

        }).catch((err) => {
            console.log(err);
        });

}

/* ************************************ My Dashboard ************************************/

/* ************************************ PENDING TASKS ************************************/
function setupMyPendingTask() {

    console.log(window.localStorage.getItem('endUserData'))
    if (window.localStorage.getItem('endUserData')) {
        let urlSearchParams = new URLSearchParams(window.location.search),
            pageHeading = urlSearchParams.get('approve') ? 'Approved' : 'Pending';

        loadMyPendingTask(urlSearchParams.get('approve') || false);
        $('.task-heading-wrapper h1').text(`${pageHeading} Task - My Team Task`)
        console.log(pageHeading);

    } else {

        localStorage.clear();
        window.location.href = '/manager/login';
    }

}

function loadMyPendingTask(isApproved) {

    let userData = JSON.parse(localStorage.getItem("endUserData")),
        param = {
            method: 'myTeamTask',
            empId: userData.empId
        };

    managerLoader.removeClass('none');
    managerBody.addClass('overflow-hidden');

    axios
        .post("/manager/api", param).then((response) => {
            //console.log(response.data);
            let taskList = response.data.filter(item => {
                if (isApproved) {
                    return item.isApproved;
                } else {
                    return !item.isApproved;
                }
            });
            let showHtml = '';
            taskList.forEach((elem, indx, arr) => {
                showHtml += `<tr>
                <td class="isapprovepage">
                <div class="checkbox disabled">
                    <label><input type="checkbox" value="${elem.empTaskId}" class="selectedchk"></label>
                </div>
            </td>
            <td>${elem.firstName} (${elem.Designation})</td>
            <td>${elem.empNumber}</td>
            <td>${elem.taskName}</td>
            <td align='right'>${elem.PointsEarned}</td>
            <td>${elem.performedOn}</td>
        </tr>`;
            });
            $('#pendingTaskList').html(showHtml);
            managerLoader.addClass('none');
            managerBody.removeClass('overflow-hidden');
            if (isApproved) {
                $('.checkbox').hide();
                $('.isapprovepage').addClass('none');
            }

        }).catch((err) => {
            console.log(err);
        });
}
/* ************************************ PENDING TASKS ************************************/