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
                onlineSpend: 0,
                totalTransactions: 0,
            };
        }

        // Add the values to the monthly totals
        monthlyTotals[month].offlineSpend += parseFloat(datapoints[i].Offline_Spend);
        monthlyTotals[month].onlineSpend += parseFloat(datapoints[i].Online_Spend);
        monthlyTotals[month].totalTransactions += 1;


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

    // LINE CHART
    const labels = monthOrder.filter(month => monthlyTotals[month]);
    const offlineSpendData = labels.map(month => monthlyTotals[month].offlineSpend);
    const onlineSpendData = labels.map(month => monthlyTotals[month].onlineSpend);

    // BAR CHART - Extract the locations and total spends for each type
    const locations = Object.keys(locationTotals);
    const onlineSpends = locations.map(location => locationTotals[location].onlineSpend);
    const offlineSpends = locations.map(location => locationTotals[location].offlineSpend);

    // LINE CHART TOTAL TRANSCATION EVERY MONTH
    const totalTransactionsData = labels.map(month => monthlyTotals[month].totalTransactions);


    // LINE CHART TOTAL SPEND
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
            backgroundColor: '#d2601a',
            borderColor: '#d2601a',
            borderWidth: 1
        }]
    };

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

    const ChartLine = new Chart(
        document.getElementById('ChartLine'),
        configLine
    );


    // BAR CHART TOTAL SPEND EVERY COUNTRY
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

    const ChartBar = new Chart(
        document.getElementById('ChartBar'),
        configBar
    );

    // DOUGHNUT CHART COUPON PERCENTAGE
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

    
    const ChartDoughnut = new Chart(
        document.getElementById('ChartDoughnut'),
        configDoughnut
    );

     // LINE CHART TOTAL TRANSACTION
     const dataTransaction = {
        labels: labels,
        datasets: [{
            label: 'Total Transactions',
            data: totalTransactionsData,
            backgroundColor: '#d2601a',
            borderColor: '#d2601a',
            borderWidth: 1,
        }]
    };

    const configTransaction = {
        type: 'line',
        data: dataTransaction,
        options: {
            aspectRatio: 1,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    };

    const ChartTransaction = new Chart(
        document.getElementById('ChartTransaction'),
        configTransaction
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