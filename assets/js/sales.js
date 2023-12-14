window.addEventListener('load', function () {
    d3.csv(chartData).then(function (datapoints) {

        // Calculate the number of transactions per day
        const parseDate = d3.timeParse('%B %e, %Y');
        datapoints.forEach(d => {
            d.Transaction_Date = parseDate(d.Transaction_Date);
        });

        generateLineChart(datapoints);
        generateBarChart(datapoints);
    });
});


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
                    beginAtZero: true,
                    ticks: {
                        callback: function (value, index, values) {
                            return '$' + value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'); // Format as currency
                        }
                    }
                }
            },

            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            let label = context.dataset.label || '';
    
                            if (label) {
                                label += ': $';
                            }
    
                            if (context.parsed.y !== null) {
                                label += context.parsed.y.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'); // Format as currency
                            }
    
                            return label;
                        }
                    }
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
                    beginAtZero: true,
                    ticks: {
                        callback: function (value, index, values) {
                            return '$' + value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'); // Format as currency
                        }
                    }
                }
            },

            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            let label = context.dataset.label || '';
    
                            if (label) {
                                label += ': $';
                            }
    
                            if (context.parsed.y !== null) {
                                label += context.parsed.y.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'); // Format as currency
                            }
    
                            return label;
                        }
                    }
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
            };
        }

        // Add the values to the monthly totals
        monthlyTotals[Month].offlineSpend += parseFloat(Offline_Spend);
        monthlyTotals[Month].onlineSpend += parseFloat(Online_Spend);
    });

    // Filter labels based on the monthOrder
    const labels = monthOrder.filter(month => monthlyTotals[month] ? month : null);


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