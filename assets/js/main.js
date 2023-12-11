document.addEventListener('DOMContentLoaded', function () {
    d3.csv(chartData).then(function (datapoints) {

        // Calculate the number of transactions per day
        const transactionsPerDay = d3.rollup(
            datapoints,
            v => v.length,
            d => d3.timeDay(d.Transaction_Date)
        );
        
        // Calculate the average transactions per day
        const averageTransactionsPerDay = d3.mean(transactionsPerDay.values());
        
        // Update the content of an HTML element with the result
        const averageTransactionsElement = document.getElementById('average-transaction');
        averageTransactionsElement.innerText = averageTransactionsPerDay.toFixed(2); // Adjust the number of decimal places as needed
        
        // BAR CHART
        const locationTotals = {};
        const categoryTotals = {};
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
            const category = datapoints[i].Product_Category;
            const onlineSpend = parseFloat(datapoints[i]['Online_Spend']);
            const offlineSpend = parseFloat(datapoints[i]['Offline_Spend']);

            // If the location is not in the object, create it
            if (!locationTotals[location]) {
                locationTotals[location] = {
                    onlineSpend: 0,
                    offlineSpend: 0
                };
            }

            if (!categoryTotals[category]) {
                categoryTotals[category] = {
                    onlineSpend: 0,
                    offlineSpend: 0
                };
            }

            // Add the spends to the location totals
            locationTotals[location].onlineSpend += onlineSpend;
            locationTotals[location].offlineSpend += offlineSpend;

            categoryTotals[category].onlineSpend += onlineSpend;
            categoryTotals[category].offlineSpend += offlineSpend;


        }

        // LINE CHART
        const labels = monthOrder.filter(month => monthlyTotals[month]);
        const offlineSpendData = labels.map(month => monthlyTotals[month].offlineSpend);
        const onlineSpendData = labels.map(month => monthlyTotals[month].onlineSpend);

        // BAR CHART - Extract the locations and total spends for each type
        const locations = Object.keys(locationTotals);
        const cityOnlineSpends = locations.map(location => locationTotals[location].onlineSpend);
        const cityOfflineSpends = locations.map(location => locationTotals[location].offlineSpend);


        const categories = Object.keys(categoryTotals);
        const categoryOnlineSpends = categories.map(category => categoryTotals[category].onlineSpend);
        const categoryOfflineSpends = categories.map(category => categoryTotals[category].offlineSpend);


        // LINE CHART TOTAL TRANSCATION EVERY MONTH
        const totalTransactionsData = labels.map(month => monthlyTotals[month].totalTransactions);

        //PIE CHART

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


        // BAR CHART TOTAL SPEND EVERY CITY
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

        
        const ChartDoughnut = new Chart(
            document.getElementById('ChartDoughnut'),
            configDoughnut
        );

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
    
        const ChartPie = new Chart(
            document.getElementById('ChartPie'),
            configPie
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
    });
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