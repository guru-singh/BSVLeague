

const _NORTH = 'North',
    _SOUTH = 'South',
    _EAST = 'East',
    _WEST = 'West';


const isUserLoggedIn = () => {
    let userDetail = JSON.parse(window.localStorage.getItem('userData'));
    console.log(userDetail);
    if (userDetail == null) {
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

$(function () {
    isUserLoggedIn();
});



/* ************************************ My Dashboard ************************************/


function setupMyDashboard() {
    myDashboardChartData();
}




function myDashboardChartData() {
    let userData = JSON.parse(localStorage.getItem("endUserData")),
        param = {
            method: 'admindashboardData'
        };
    axios
        .post("/admin/api", param).then((response) => {
            console.clear();
            // console.log(response.data);
            let records = response.data[0];
            var northPoints = 0,
                southPoints = 0,
                eastPoints = 0,
                westPoints = 0
                ;
            records.filter(rec => {
                switch (rec.zoneName) {
                    case _NORTH:
                        northPoints += rec.pointsEarned
                        break;
                    case _EAST:
                        eastPoints += rec.pointsEarned
                        break;
                    case _SOUTH:
                        southPoints += rec.pointsEarned
                        break;
                    case _WEST:
                        westPoints += rec.pointsEarned
                        break;
                }
            });

            records.sort(function (a, b) {
                let keyA = a.pointsEarned,
                    keyB = b.pointsEarned;
                if (keyA > keyB) return -1;
                if (keyA < keyB) return 1;
                return 0;
            });

            // TOP PERFORMING ZBM
          
            zbmRecords = records.filter(rec => {
                return rec.Designation === 'ZBM'
            });
            console.log('total Points By North team ' + northPoints)
            console.log('total Points By south team ' + southPoints)
            console.log('total Points By East team ' + eastPoints)
            console.log('total Points By West team ' + westPoints)

            // task performed as my collegues
            // TOP PERFORMING ZBM
            console.log('TOP PERFORMING ZBM')
            console.table(zbmRecords)
            // TOP PERFORMING RBM
           let rbmRecords = records.filter(rec => {
                return rec.Designation === 'RBM'
            });
            console.log('TOP PERFORMING RBM')
            console.table(rbmRecords.slice(0,5));   

            // TOP PERFORMING KAM
            console.log('TOP PERFORMING KAM')
           let kamRecords = records.filter(rec => {
            return rec.Designation === 'Sr KAM' || rec.Designation === 'KAM'
        });
        console.table(kamRecords.slice(0,5));  

        // TOTAL TASK PERFORMED
        let unApprovedTaskCount = response.data[1][0].unApprovedTask, 
            approvedTaskCount = response.data[2][0].ApprovedTask,
            totalTask = parseInt(approvedTaskCount + unApprovedTaskCount);
            
        console.log('Total Task ======> '+ totalTask)
        console.log('Approved Task ======> '+ approvedTaskCount)
        console.log('Un Approved Task ======> '+ unApprovedTaskCount)

        // task performed on date wise
        console.log(`task performed on date wise`)
        console.table(response.data[3])


        }).catch((err) => {
            console.log(err);
        });

}

/* ************************************ My Dashboard ************************************/