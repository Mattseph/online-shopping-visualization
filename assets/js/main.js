document.addEventListener('DOMContentLoaded', function () {
    d3.csv(chartData).then(function (datapoints) {

        generateLineChart(datapoints);
        // Calculate the number of transactions per day
        generateAverageTransactionsPerDay(datapoints);
        generateBarChart(datapoints);
        generatePieChart(datapoints);
        generateScatterPlot(datapoints);
        doughnutChartCouponPercentage(datapoints);
    });
});

function generateAverageTransactionsPerDay(datapoints) {
    const transactionsPerDay = d3.rollup(
        datapoints,
        v => v.length,
        d => d3.timeDay(d.Transaction_Date)
    );
    
    // Calculate the average transactions per day
    const averageTransactionsPerDay = d3.mean(transactionsPerDay.values()) ?? '';
    
    // Update the content of an HTML element with the result
    const averageTransactionsElement = document.getElementById('average-transaction');
    if (averageTransactionsElement && averageTransactionsPerDay) {
        averageTransactionsElement.innerText = averageTransactionsPerDay.toFixed(2);
    }

}

function generateBarChart(datapoints) {
    const locationTotals = {};
    const categoryTotals = {};
    const monthlyTotals = {};

    // Define the desired order of months
    const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Iterate through the datapoints and aggregate the values for each month
    datapoints.forEach(dataPoint => {
        // LINE CHART
        const { Month, Offline_Spend, Online_Spend } = dataPoint;

        // If the month is not in the object, create it
        if (!monthlyTotals[Month]) {
            monthlyTotals[Month] = {
                offlineSpend: 0,
                onlineSpend: 0,
                totalTransactions: 0,
            };
        }

        // Add the values to the monthly totals
        monthlyTotals[Month].offlineSpend += parseFloat(Offline_Spend);
        monthlyTotals[Month].onlineSpend += parseFloat(Online_Spend);
        monthlyTotals[Month].totalTransactions += 1;

        // BAR CHART
        const { Location, Product_Category, ['Online_Spend']: onlineSpend, ['Offline_Spend']: offlineSpend } = dataPoint;

        // If the location is not in the object, create it
        if (!locationTotals[Location]) {
            locationTotals[Location] = {
                onlineSpend: 0,
                offlineSpend: 0
            };
        }

        if (!categoryTotals[Product_Category]) {
            categoryTotals[Product_Category] = {
                onlineSpend: 0,
                offlineSpend: 0
            };
        }

        // Add the spends to the location totals
        locationTotals[Location].onlineSpend += parseFloat(onlineSpend);
        locationTotals[Location].offlineSpend += parseFloat(offlineSpend);

        categoryTotals[Product_Category].onlineSpend += parseFloat(onlineSpend);
        categoryTotals[Product_Category].offlineSpend += parseFloat(offlineSpend);
    });

    // BAR CHART TOTAL SPEND EVERY CITY
    const locations = Object.keys(locationTotals);
    const cityOnlineSpends = locations.map(location => locationTotals[location].onlineSpend);
    const cityOfflineSpends = locations.map(location => locationTotals[location].offlineSpend);

    const cityDataBar = {
        labels: locations,
        datasets: [{
            label: 'Online Spend',
            data: cityOnlineSpends,
            backgroundColor: '#1d3c45',
            borderColor: '#1d3c45',
            borderWidth: 1
        },
        {
            label: 'Offline Spend',
            data: cityOfflineSpends,
            backgroundColor: '#d2601a',
            borderColor: '#d2601a',
            borderWidth: 1
        }]
    };

    const cityConfigBar = {
        type: 'bar',
        data: cityDataBar,
        options: {
            aspectRatio: 1,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    };

    const cityChartBar = new Chart(
        document.getElementById('cityChartBar'),
        cityConfigBar
    );

    // BAR CHART TOTAL SPEND EVERY CATEGORY
    const categories = Object.keys(categoryTotals);
    const categoryOnlineSpends = categories.map(category => categoryTotals[category].onlineSpend);
    const categoryOfflineSpends = categories.map(category => categoryTotals[category].offlineSpend);

    const categoryDataBar = {
        labels: categories,
        datasets: [{
            label: 'Online Spend',
            data: categoryOnlineSpends,
            backgroundColor: '#1d3c45',
            borderColor: '#1d3c45',
            borderWidth: 1
        },
        {
            label: 'Offline Spend',
            data: categoryOfflineSpends,
            backgroundColor: '#d2601a',
            borderColor: '#d2601a',
            borderWidth: 1
        }]
    };

    const categoryConfigBar = {
        type: 'bar',
        data: categoryDataBar,
        options: {
            aspectRatio: 1,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    };

    const categoryChartBar = new Chart(
        document.getElementById('categoryChartBar'),
        categoryConfigBar
    );
}

function generateLineChart(datapoints) {
    // LINE CHART TOTAL TRANSACTION EVERY MONTH
    const monthlyTotals = {};

    // Define the desired order of months
    const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Iterate through the datapoints and aggregate the values for each month
    datapoints.forEach(dataPoint => {
        const { Month, Offline_Spend, Online_Spend } = dataPoint;

        // If the month is not in the object, create it
        if (!monthlyTotals[Month]) {
            monthlyTotals[Month] = {
                offlineSpend: 0,
                onlineSpend: 0,
                totalTransactions: 0,
            };
        }

        // Add the values to the monthly totals
        monthlyTotals[Month].offlineSpend += parseFloat(Offline_Spend);
        monthlyTotals[Month].onlineSpend += parseFloat(Online_Spend);
        monthlyTotals[Month].totalTransactions += 1;
    });

    // Filter labels based on the monthOrder
    const labels = monthOrder.filter(month => monthlyTotals[month] ? month : null);

    const totalTransactionsData = labels.map(month => monthlyTotals[month].totalTransactions);

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

    const chartTransaction = new Chart(
        document.getElementById('chartTransaction'),
        configTransaction
    );

    // LINE CHART TOTAL SPEND

    const offlineSpendData = labels.map(month => monthlyTotals[month].offlineSpend);
    const onlineSpendData = labels.map(month => monthlyTotals[month].onlineSpend);

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

    const chartLine = new Chart(
        document.getElementById('chartLine'),
        configLine
    );
}


function generatePieChart(datapoints) {
    // PIE chart data
    const genderLabels = ['Male', 'Female'];
    const genderData = genderLabels.map(status => {
        const genderCount = datapoints.filter(item => item["Gender"] === status).length;
        const genderPercentage = (genderCount / datapoints.length) * 100;
        return { count: genderCount, percentage: genderPercentage.toFixed(2) };
    });

    const dataPie = {
        labels: genderLabels,
        datasets: [{
            data: genderData.map(item => item.percentage),
            backgroundColor: ['#1d3c45', '#d2601a'],
            borderWidth: 1
        }]
    };

    const configPie = {
        type: 'pie',
        data: dataPie,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            tooltips: {
                callbacks: {
                    label: function (tooltipItem, data) {
                        const dataset = data.datasets[tooltipItem.datasetIndex];
                        const total = dataset.data.reduce(function (previousValue, currentValue, currentIndex, array) {
                            return previousValue + currentValue;
                        });
                        const currentValue = dataset.data[tooltipItem.index];
                        const genderInfo = genderData[tooltipItem.index];
                        return `${genderLabels[tooltipItem.index]}: ${genderInfo.count} (${genderInfo.percentage}%)`;
                    }
                }
            }
        }
    };

    const chartPie = new Chart(
        document.getElementById('chartPie'),
        configPie
    );
}

function generateScatterPlot(datapoints) {
    // SCATTER PLOT - Extract the values for the scatter plot
    const tenureMonths = datapoints.map(d => parseFloat(d.Tenure_Months));
    const onlineShopping = datapoints.map(d => parseFloat(d.Online_Spend));

    // Scatter plot data
    const scatterData = {
        labels: 'Scatter Plot',
        datasets: [{
            label: 'Customer Tenure vs Online Shopping',
            data: tenureMonths.map((val, index) => ({ x: val, y: onlineShopping[index] })),
            backgroundColor: '#1d3c45' // color of the data points
        }]
    };

    // Scatter plot configuration
    const scatterConfig = {
        type: 'scatter',
        data: scatterData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Customer Tenure (months)'
                    }
                },
                y: {
                    type: 'linear',
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Online Shopping Behavior'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                title: {
                    display: true,
                    text: 'Customer Tenure vs Online Shopping'
                }
            }
        }
    };

    // Create the scatter plot
    const scatterChart = new Chart(
        document.getElementById('chartScatter'),
        scatterConfig
    );
}


function doughnutChartCouponPercentage (datapoints) {
     // DOUGHNUT CHART COUPON PERCENTAGE
     const couponLabels = ['Clicked', 'Used', 'Not Used'];
     const couponData = couponLabels.map(status => {
         const count = datapoints.filter(item => item["Coupon_Status"] === status).length;
         const percentage = (count / datapoints.length) * 100;
         return percentage.toFixed(2);
     });

     // Doughnut chart data
     const dataDoughnut = {
         labels: couponLabels,
         datasets: [{
             data: couponData,
             backgroundColor: ['#1d3c45', '#d2601a', '#fff1e1'],
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

     
     const chartDoughnut = new Chart(
         document.getElementById('chartDoughnut'),
         configDoughnut
     );
}


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