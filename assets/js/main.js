d3.csv(chartData).then(function (datapoints) {
    // BAR CHART
    const locationTotals = {};

    const monthlyTotals = {};

    // Define the desired order of months
    const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Iterate through the datapoints and aggregate the values for each month
    for (let i = 0; i < datapoints.length; i++) {
        // LINE CHART
        let month = datapoints[i].Month;

        // If the month is not in the object, create it
        if (!monthlyTotals[month]) {
            monthlyTotals[month] = {
                offlineSpend: 0,
                onlineSpend: 0
            };
        }

        // Add the values to the monthly totals
        monthlyTotals[month].offlineSpend += parseFloat(datapoints[i].Offline_Spend);
        monthlyTotals[month].onlineSpend += parseFloat(datapoints[i].Online_Spend);


        // BAR CHART

        const location = datapoints[i].Location;
        const onlineSpend = parseFloat(datapoints[i]['Online_Spend']);
        const offlineSpend = parseFloat(datapoints[i]['Offline_Spend']);

        // If the location is not in the object, create it
        if (!locationTotals[location]) {
            locationTotals[location] = {
                onlineSpend: 0,
                offlineSpend: 0
            };
        }

        // Add the spends to the location totals
        locationTotals[location].onlineSpend += onlineSpend;
        locationTotals[location].offlineSpend += offlineSpend;
    }

    // LINE CHART - Extract the labels and aggregated values from the object, ordered by month
    const labels = monthOrder.filter(month => monthlyTotals[month]);
    const offlineSpendData = labels.map(month => monthlyTotals[month].offlineSpend);
    const onlineSpendData = labels.map(month => monthlyTotals[month].onlineSpend);

    // BAR CHART - Extract the locations and total spends for each type
    const locations = Object.keys(locationTotals);
    const onlineSpends = locations.map(location => locationTotals[location].onlineSpend);
    const offlineSpends = locations.map(location => locationTotals[location].offlineSpend);


    const dataLine = {
        labels: labels,
        datasets: [{
            label: 'Offline Spend Sales',
            data: offlineSpendData,
            backgroundColor: 'rgba(255, 26, 104, 0.2)',
            borderColor: 'rgba(255, 26, 104, 1)',
            borderWidth: 1
        },
        {
            label: 'Online Spend Sales',
            data: onlineSpendData,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    };

    // Chart configuration
    const dataBar = {
        labels: locations,
        datasets: [{
            label: 'Online Spend',
            data: onlineSpends,
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        },
        {
            label: 'Offline Spend',
            data: offlineSpends,
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }]
    };

    const configBar = {
        type: 'bar',
        data: dataBar,
        options: {
            aspectRatio: 1,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    };

    // Render the bar chart
    const myChartBar = new Chart(
        document.getElementById('myChartBar'),
        configBar
    );

    // Config for the line chart
    const configLine = {
        type: 'line',
        data: dataLine,
        options: {
            aspectRatio: 1,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    };

    // Render the line chart
    const myChartLine = new Chart(
        document.getElementById('myChartLine'),
        configLine
    );

    // DOUGHNUT CHART
    const couponLabels = ['Clicked', 'Used', 'Not Used'];
    const couponData = couponLabels.map(status => {
        const count = datapoints.filter(item => item["Coupon_Status"] === status).length;
        const percentage = (count / datapoints.length) * 100;
        return percentage.toFixed(2);
    });

    const backgroundColors = ['rgba(255, 99, 132, 0.8)', 'rgba(54, 162, 235, 0.8)', 'rgba(255, 206, 86, 0.8)'];

    // Doughnut chart data
    const dataDoughnut = {
        labels: couponLabels,
        datasets: [{
            data: couponData,
            backgroundColor: backgroundColors,
            borderWidth: 1
        }]
    };

    // Doughnut chart config
    const configDoughnut = {
        type: 'doughnut',
        data: dataDoughnut,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            tooltips: {
                callbacks: {
                    label: function (tooltipItem, data) {
                        var dataset = data.datasets[tooltipItem.datasetIndex];
                        var total = dataset.data.reduce(function (previousValue, currentValue, currentIndex, array) {
                            return previousValue + currentValue;
                        });
                        var currentValue = dataset.data[tooltipItem.index];
                        var percentage = Math.round((currentValue / total) * 100);
                        return percentage + "%";
                    }
                }
            }
        }
    };

    // Render the doughnut chart
    const myChartDoughnut = new Chart(
        document.getElementById('myChartDoughnut'),
        configDoughnut
    );
});




        // setup 
        // const data = {
        //     labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        //     datasets: [{
        //         label: 'Weekly Sales',
        //         data: [18, 12, 6, 9, 12, 3, 9],
        //         backgroundColor: [
        //             'rgba(255, 26, 104, 0.2)',
        //             'rgba(54, 162, 235, 0.2)',
        //             'rgba(255, 206, 86, 0.2)',
        //             'rgba(75, 192, 192, 0.2)',
        //             'rgba(153, 102, 255, 0.2)',
        //             'rgba(255, 159, 64, 0.2)',
        //             'rgba(0, 0, 0, 0.2)'
        //         ],
        //         borderColor: [
        //             'rgba(255, 26, 104, 1)',
        //             'rgba(54, 162, 235, 1)',
        //             'rgba(255, 206, 86, 1)',
        //             'rgba(75, 192, 192, 1)',
        //             'rgba(153, 102, 255, 1)',
        //             'rgba(255, 159, 64, 1)',
        //             'rgba(0, 0, 0, 1)'
        //         ],
        //         borderWidth: 1
        //     }]
        // };

        // // config 
        // const config = {
        //     type: 'bar',
        //     data,
        //     options: {
        //         aspectRatio: 1,
        //         scales: {
        //             y: {
        //                 beginAtZero: true
        //             }
        //         }
        //     }
        // };

        // // render init block
        // const myChart = new Chart(
        //     document.getElementById('myChart'),
        //     config
        // );
        

        // menu toggle
        const toggle = document.querySelector(".toggle");
        const navigation = document.querySelector(".navigation");
        const main = document.querySelector(".main");

        toggle.onclick = function(){
            navigation.classList.toggle("active")
            main.classList.toggle("active")
        }


        // add hovered class in selected list item
        const list = document.querySelectorAll(".navigation li");
        function activeLink(){
            list.forEach((item) =>
            item.classList.remove("hovered"));
            this.classList.add("hovered");
        }
        list.forEach((item) =>
        item.addEventListener("mouseover",activeLink));