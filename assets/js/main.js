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


    // LINE CHART
    const dataLine = {
        labels: labels,
        datasets: [{
            label: 'Offline Spend Sales',
            data: offlineSpendData,
            backgroundColor: '#1d3c45',
            borderColor: '#1d3c45',
            borderWidth: 1
        },
        {
            label: 'Online Spend Sales',
            data: onlineSpendData,
            backgroundColor: '#1d3c45',
            borderColor: '#1d3c45',
            borderWidth: 1
        }]
    };

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


    // BAR CHART configuration
    const dataBar = {
        labels: locations,
        datasets: [{
            label: 'Online Spend',
            data: onlineSpends,
            backgroundColor: '#1d3c45',
            borderColor: '#1d3c45',
            borderWidth: 1
        },
        {
            label: 'Offline Spend',
            data: offlineSpends,
            backgroundColor: '#d2601a',
            borderColor: '#d2601a',
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

    // DOUGHNUT CHART
    const couponLabels = ['Clicked', 'Used', 'Not Used'];
    const couponData = couponLabels.map(status => {
        const count = datapoints.filter(item => item["Coupon_Status"] === status).length;
        const percentage = (count / datapoints.length) * 100;
        return percentage.toFixed(2);
    });

    const backgroundColors = ['#1d3c45', '#d2601a', '#fff1e1'];

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