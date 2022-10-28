

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
                westPoints = 0;
                
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

            console.log('total Points By North team ' + northPoints);
            console.log('total Points By south team ' + southPoints);
            console.log('total Points By East team ' + eastPoints);
            console.log('total Points By West team ' + westPoints);

            // $('#southPoints').text(southPoints);
            // $('#eastPoints').text(eastPoints);
            // $('#northPoints').text(northPoints);
            // $('#westPoints').text(westPoints);

            let zoneData = [
                {zone:'south', order:0, value:southPoints},
                {zone:'east', order:0, value:eastPoints},
                {zone:'north', order:0, value:northPoints},
                {zone:'west', order:0, value:westPoints}
            ];

            let sortedZoneData = zoneData.sort(function (a, b) {
                return b.value - a.value;
              });

            console.log('sortedZoneData', sortedZoneData);

            let zoneFilteredData = [];
            let zoneIndx = 0;
            for(let zone of zoneData) {
                zoneIndx = zoneIndx + 1;
                zoneFilteredData.push({zone: zone.zone, order:'order-' + zoneIndx, value:zone.value});
            }

            console.log(zoneFilteredData);
            let totalPoints = 0;

            for(let z of zoneFilteredData) {
                totalPoints = totalPoints + z.value;
                $(`.${z.zone}`).find('span').text(z.value);
                $(`.${z.zone}`).addClass(`${z.order}`);
            }

            $('#toppzbm').text(totalPoints);

            // task performed as my collegues
            // TOP PERFORMING ZBM
            console.log('TOP PERFORMING ZBM')
            console.table(zbmRecords)
            // TOP PERFORMING RBM
            let rbmRecords = records.filter(rec => {
                return rec.Designation === 'RBM'
            });
            console.log('TOP PERFORMING RBM')
            console.table(rbmRecords.slice(0, 5));

            // TOP PERFORMING KAM
            console.log('TOP PERFORMING KAM')
            let kamRecords = records.filter(rec => {
                return rec.Designation === 'Sr KAM' || rec.Designation === 'KAM'
            });

            const topKamName = kamRecords.reduce(function(prev, current) {
                return (prev.pointsEarned > current.pointsEarned) ? prev : current
            });
            
            const topRbmName = rbmRecords.reduce(function(prev, current) {
                return (prev.pointsEarned > current.pointsEarned) ? prev : current
            });

            $('#toppkam').text(topRbmName.firstName);
            $('#toprbmname').text(topRbmName.firstName);

            console.table(kamRecords.slice(0, 5));

            function getKamTotalPotentialEarned() {
                var total = 0;
                for (var i = 0; i < kamRecords.slice(0, 5).length; i++) {
                    total = total + kamRecords.slice(0, 5)[i].pointsEarned;
                }
                return total;
            }

            function getRbmTotalPotentialEarned() {
                var total = 0;
                for (var i = 0; i < rbmRecords.slice(0, 5).length; i++) {
                    total = total + rbmRecords.slice(0, 5)[i].pointsEarned;
                }
                return total;
            }

            $('#toppkam').text(getKamTotalPotentialEarned());
            $('#topprbm').text(getRbmTotalPotentialEarned());
            
            // TOTAL TASK PERFORMED
            let unApprovedTaskCount = response.data[1][0].unApprovedTask,
                approvedTaskCount = response.data[2][0].ApprovedTask,
                totalTask = parseInt(approvedTaskCount + unApprovedTaskCount);

            console.log('Total Task ======> ' + totalTask)
            console.log('Approved Task ======> ' + approvedTaskCount)
            console.log('Un Approved Task ======> ' + unApprovedTaskCount)

            // task performed on date wise

           // console.clear();
            console.log(`task performed on date wise`)
            console.table(response.data[3]);
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Month');
            data.addColumn('number', "Approved Task");
            data.addColumn('number', "Un-Approved Task");
            let chartData = [],
                filterData = [];
            response.data[3].forEach(rec => {
                let obj = filterData.find(x => x.dt === rec.dt),
                    o;
                if (obj) {
                    if (rec.isApproved) {
                        obj.approveCount = rec.count;
                    } else {
                        obj.unApproveCount = rec.count;
                    }
                }
                else {
                    o = {
                        dt: rec.dt,
                        approveCount: rec.isApproved ? rec.count : 0,
                        unApproveCount: !rec.isApproved ? rec.count : 0,
                    }
                    filterData.push(o)
                }
            });

            console.table(filterData);
            filterData.forEach(rec => {
                // console.log(rec)
                let tmpArr = [];
                tmpArr.push(rec.dt, rec.approveCount, rec.unApproveCount)
                chartData.push(tmpArr);

            });


            console.log(chartData);
            data.addRows(chartData);

            var options = {
                title: 'Task Performed by the team',
                width: 1500,
                height: 700,
                // Gives each series an axis that matches the vAxes number below.
                series: {
                    0: { targetAxisIndex: 0 },
                    1: { targetAxisIndex: 1 }
                },
                vAxes: {
                    // Adds titles to each axis.
                    0: { title: 'Total No of Task' },
                   // 1: { title: 'Daylight' }
                },
                vAxis: {
                    viewWindow: {
                        max: 30
                    }
                }
            };

            var chart = new google.visualization.ComboChart(document.getElementById('chart_div'));
            chart.draw(data, options);


        }).catch((err) => {
            console.log(err);
        });

}

// function drawDailyTaskChart() {
//     // Some raw data (not necessarily accurate)
//     var data = new google.visualization.DataTable();
//     data.addColumn('date', 'Month');
//     data.addColumn('number', "Average Temperature");
//     data.addColumn('number', "Average Hours of Daylight");

//     data.addRows([
//         [new Date(2014, 0), -.5, 5.7],
//         [new Date(2014, 1), .4, 8.7],
//         [new Date(2014, 2), .5, 12],
//         [new Date(2014, 3), 2.9, 15.3],
//         [new Date(2014, 4), 6.3, 18.6],
//         [new Date(2014, 5), 9, 20.9],
//         [new Date(2014, 6), 10.6, 19.8],
//         [new Date(2014, 7), 10.3, 16.6],
//         [new Date(2014, 8), 7.4, 13.3],
//         [new Date(2014, 9), 4.4, 9.9],
//         [new Date(2014, 10), 1.1, 6.6],
//         [new Date(2014, 11), -.2, 4.5]
//     ]);

//     var options = {
//         title: 'Average Temperatures and Daylight in Iceland Throughout the Year',
//         width: 1500,
//         height: 700,
//         // Gives each series an axis that matches the vAxes number below.
//         series: {
//             0: { targetAxisIndex: 0 },
//             1: { targetAxisIndex: 1 }
//         },
//         vAxes: {
//             // Adds titles to each axis.
//             0: { title: 'Temps (Celsius)' },
//             1: { title: 'Daylight' }
//         },
//         vAxis: {
//             viewWindow: {
//                 max: 30
//             }
//         }
//     };

//     var chart = new google.visualization.ComboChart(document.getElementById('chart_div'));
//     chart.draw(data, options);
// }

/* ************************************ My Dashboard ************************************/