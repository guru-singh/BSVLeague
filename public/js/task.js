const loader = $('.loader-wrapper');
const body = $('body');

const taskList = () => {

    let param = {
        method: 'taskList',
        empId: 2
    };

    loader.removeClass('none');
    body.addClass('overflow-hidden');

    axios
        .post("/admin/api", param).then((response) => {
            
            console.log(response.data[0]);

            let showHTml = '';
            response.data[0].forEach((elem, indx, arr) => {
                showHTml += `
                            <tr>
                                <td>${elem.taskName}</td>
                                <td>${elem.taskPoint ? elem.taskPoint : '---'}</td>
                                <td>${elem.taskDescp}</td>
                                <td>${elem.isDisable ? `Yes`: `No`}</td>
                                <td>${elem.createdDate}</td>
                                <td>
                                    <a class="edit-delete" href="/task-edit/${elem.taskId}">
                                        <img src="../img/edit.png" alt="edit" class="img-responsive" />
                                    </a> 
                                    <a class="edit-delete" href="javascript:void(0);" onclick="deleteTask(${elem.taskId},'${elem.taskName}', '${elem.taskDescp}', ${elem.taskPoint})">
                                        <img src="../img/delete.png" alt="edit" class="img-responsive" />
                                    </a> 
                                </td>
                            </tr>
                            `;
            });
            $('#kamList').html(showHTml);
            loader.addClass('none');
            body.removeClass('overflow-hidden');

        }).catch((err) => {
            console.log(err);
        });
};

const createTask = () => {

    if ($("#tastName").val() === "") {
        alert("please enter Task Name");
        $("#tastName").focus();
        return false;
    }

    if ($("#tastDescription").val() === "") {
        alert("please enter Task Description");
        $("#tastDescription").focus();
        return false;
    }

    if ($("#taskPoint").val() === "") {
        alert("please enter Task Description");
        $("#taskPoint").focus();
        return false;
    }

    loader.removeClass('none');
    body.addClass('overflow-hidden');

    let param = {
        taskName : $("#tastName").val(),
        tastDescription: $("#tastDescription").val(),
        taskPoint: $("#taskPoint").val(),
        isDisabled : $('#isDisabled').prop("checked"),
        method: 'taskcreate'
    };

    axios
    .post("/admin/api", param)
    .then((response) => {
        console.log(response.data.success);
        $("#tastName").val(' ');
        $("#tastDescription").val(' ')
        $('#success').removeClass('none');
        window.location = '/task-list';
    })
    .catch((err) => {
        console.log("inside catch");
        console.log(err);
    });
};

const getTaskById = () => {

    if(getCurrentId()) {
        let param = {
            id : getCurrentId(),
            method: 'taskGetById'
        };
    
        axios
        .post("/admin/api", param)
        .then((response) => {
            const resultData = response.data.recordset[0];
            console.log(resultData);
            $('#tastName').val(resultData.taskName);
            $('#taskPoint').val(resultData.taskPoint);
            $('#tastDescription').val(resultData.taskDescp);
            $('#taskId').val(getCurrentId());
    
            if(resultData.isDisable) {
                $('#isDisabled').prop( "checked", true );
            } else {
                $('#isDisabled').prop( "checked", false );
            }
            
        })
        .catch((err) => {
            console.log("inside catch");
            console.log(err);
        });
    }
};

const updateTask = () => {
    if ($("#tastName").val() === "") {
        alert("please enter Task Name");
        $("#tastName").focus();
        return false;
    }

    if ($("#taskPoint").val() === "") {
        alert("please select Task Point");
        $("#taskPoint").focus();
        return false;
    }

    if ($("#tastDescription").val() === "") {
        alert("please enter Task Description");
        $("#tastDescription").focus();
        return false;
    }

    loader.removeClass('none');
    body.addClass('overflow-hidden');

    let param = {
        id: getCurrentId(),
        taskName : $("#tastName").val(),
        taskPoint : $('#taskPoint').val(),
        tastDescription: $("#tastDescription").val(),
        isDisabled : $('#isDisabled').prop("checked"),
        method: 'taskupdate'
    };

    axios
    .post("/admin/api", param)
    .then((response) => {
        console.log(response.data.success);
        window.location = '/task-list';
    })
    .catch((err) => {
        console.log("inside catch");
        console.log(err);
    });
};

const deleteTask = (id, name, descp, taskPoint) => {
    
    const confirmToDelete = confirm('Are you sure want to delete?');
    if(confirmToDelete) {

        loader.removeClass('none');
        body.addClass('overflow-hidden');

        let param = {
            id: parseInt(id),
            taskName : name,
            tastDescription: descp,
            isDisabled : true,
            taskPoint: taskPoint,
            method: 'taskdelete'
        };

        axios
        .post("/admin/api", param)
        .then((response) => {
            console.log(response.data.success);
            taskList();
            loader.removeClass('none');
            body.addClass('overflow-hidden');
        })
        .catch((err) => {
            console.log("inside catch");
            console.log(err);
        });
    }
};

$(function(){
    taskList();
    getTaskById();
});