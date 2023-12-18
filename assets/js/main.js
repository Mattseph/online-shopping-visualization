document.addEventListener('DOMContentLoaded', function () {
    const fileInput = document.getElementById('fileInput');
    const uploadButton = document.getElementById('uploadButton');
    const reUploadButton = document.getElementById('reUploadButton');

    let db;

    // Open (or create) the database
    const openRequest = indexedDB.open('datasetDB', 1);

    openRequest.onerror = function (event) {
        console.error('Error opening IndexedDB:', event);
    };

    openRequest.onupgradeneeded = function (event) {
        // Create the object store if it doesn't exist
        const db = event.target.result;
        if (!db.objectStoreNames.contains('datasetStore')) {
            db.createObjectStore('datasetStore', { keyPath: 'id' });
        }
    };

    openRequest.onsuccess = function (event) {
        db = event.target.result;

        // Check for an existing dataset in IndexedDB
        const transaction = db.transaction('datasetStore', 'readonly');
        const objectStore = transaction.objectStore('datasetStore');
        const getRequest = objectStore.get(1);

        getRequest.onsuccess = function () {
            const dataset = getRequest.result;

            if (dataset && dataset.filePath) {
                // Dataset found, hide upload container and show dashboard container
                if (document.querySelector('.upload-container')) {
                    document.querySelector('.upload-container').style.display = 'none';
                }
                if (document.querySelector('.dashboard-container')) {
                    document.querySelector('.dashboard-container').style.display = 'block';
                }

                // Load the data from the server and generate charts
                fetch(dataset.filePath)
                    .then(response => response.text())
                    .then(loadedData => {
                        const datapoints = d3.csvParse(loadedData);
                        console.log(datapoints);
                        generateCharts(datapoints);
                    });
            } else {
                // Dataset not found, show upload container
                if (document.querySelector('.upload-container')) {
                    document.querySelector('.upload-container').removeAttribute("style");
                }
                if (document.querySelector('.dashboard-container')) {
                    document.querySelector('.dashboard-container').style.display = 'none';
                }
            }
        };

        transaction.oncomplete = function () {
            // Close the transaction
            // db.close(); // Commenting out this line
        };
    };

    if (uploadButton) {
        uploadButton.addEventListener('click', handleFile);
    }

    reUploadButton.addEventListener('click', reUploadFile);

    function handleFile() {
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const formData = new FormData();
            formData.append('file', file);

            // Make an AJAX request to the PHP script
            fetch('server/server.php', {
                method: 'POST',
                body: formData,
            })
            .then(response => response.json())
            .then(data => {
                // Hide the upload container and show the dashboard container
                if (document.querySelector('.upload-container')) {
                    document.querySelector('.upload-container').style.display = 'none';
                }
                if (document.querySelector('.dashboard-container')) {
                    document.querySelector('.dashboard-container').style.display = 'block';
                }

                // Store the dataset path in IndexedDB
                const storeTransaction = db.transaction('datasetStore', 'readwrite');
                const storeObjectStore = storeTransaction.objectStore('datasetStore');
                storeObjectStore.put({ id: 1, filePath: data.filePath });

                // Load the data from the server and generate charts
                fetch(data.filePath)
                    .then(response => response.text())
                    .then(loadedData => {
                        const datapoints = d3.csvParse(loadedData);
                        console.log(datapoints);
                        generateCharts(datapoints);
                    });
            })
            .catch(error => {
                console.error('Error uploading file:', error);
                alert('Error uploading file. Please try again.');
            });
        } else {
            alert('Please select a file.');
        }
    }

    function reUploadFile() {
        // Show the upload container and hide the dashboard container
        if (document.querySelector('.upload-container')) {
            document.querySelector('.upload-container').removeAttribute("style");
        }
        if (document.querySelector('.dashboard-container')) {
            document.querySelector('.dashboard-container').style.display = 'none';
        }
    
        // Delete the dataset from indexedDB
        const deleteTransaction = db.transaction('datasetStore', 'readwrite');
        const deleteObjectStore = deleteTransaction.objectStore('datasetStore');
        const getRequest = deleteObjectStore.get(1);
    
        getRequest.onsuccess = function () {
            const dataset = getRequest.result;
    
            if (dataset && dataset.filePath) {
                // Make a DELETE request to delete the file on the server
                fetch('server/server.php', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ filePath: dataset.filePath }),
                })
                .then(response => {
                    if (response.ok) {
                        console.log('File deleted successfully.');
                    } else {
                        console.error('Error deleting file:', response.statusText);
                    }
                })
                .catch(error => {
                    console.error('Error deleting file:', error);
                });
            }
        };
    
        // Clear IndexedDB and reset UI as needed
        deleteObjectStore.clear();

    }

    function generateCharts(datapoints) {
        // Your existing function to generate charts
        generateAverageTransactionsPerDay(datapoints);
        generateAverageOfflineSpendPerDay(datapoints);
        generateAverageOnlineSpendPerDay(datapoints);
        totalSales(datapoints);
        generateScatterPlot(datapoints);
        generatePieChart(datapoints);
        doughnutChartCouponPercentage(datapoints);
        generateLineChart(datapoints);
    }
});



function generateAverageTransactionsPerDay(datapoints) {
    // Use d3.timeParse to parse the date strings
    const parseDate = d3.timeParse("%B %e, %Y");

    // Group transactions by day
    const transactionsPerDay = d3.rollup(
        datapoints,
        v => v.length,
        d => d3.timeDay(parseDate(d.Transaction_Date))
    );

    // Extract values to calculate the average
    const transactionCounts = Array.from(transactionsPerDay.values());

    // Calculate the total number of unique days with at least one transaction
    const daysWithTransactions = transactionCounts.filter(count => count > 0).length ?? 0;

    // Calculate the total number of transactions
    const totalTransactions = d3.sum(transactionCounts);

    // Calculate the average transactions per day
    const averageTransactionsPerDay = daysWithTransactions > 0 ? totalTransactions / daysWithTransactions : 0;

    // Update the content of an HTML element with the result (as an integer)
    const averageTransactionsElement = document.getElementById('average-transaction');
    if (averageTransactionsElement) {
        averageTransactionsElement.innerText = parseInt(averageTransactionsPerDay, 10) ?? '';
    }
}

function generateAverageOfflineSpendPerDay(datapoints) {
    // Group transactions by day and calculate the average offline spend
    const offlineSpendPerDay = d3.rollup(
        datapoints,
        v => d3.mean(v, d => parseFloat(d.Offline_Spend)),
        d => d3.timeDay(d.Transaction_Date)
    );

    // Extract values to calculate the overall average
    const offlineSpendValues = Array.from(offlineSpendPerDay.values());

    // Calculate the total number of unique days with at least one transaction
    const daysWithTransactions = offlineSpendValues.filter(value => !isNaN(value)).length;

    // Calculate the total average offline spend
    const totalAverageOfflineSpend = d3.sum(offlineSpendValues);

    // Calculate the overall average offline spend
    const overallAverageOfflineSpend = totalAverageOfflineSpend / daysWithTransactions || 0;

    // Update the content of an HTML element with the result
    const averageOfflineSpendElement = document.getElementById('average-offline-spend');
    if (averageOfflineSpendElement) {
        averageOfflineSpendElement.innerText = `$${overallAverageOfflineSpend.toFixed(2)}`;
    }
}

function generateAverageOnlineSpendPerDay(datapoints) {
    // Group transactions by day and calculate the average online spend
    const onlineSpendPerDay = d3.rollup(
        datapoints,
        v => d3.mean(v, d => parseFloat(d.Online_Spend)),
        d => d3.timeDay(d.Transaction_Date)
    );

    // Extract values to calculate the overall average
    const onlineSpendValues = Array.from(onlineSpendPerDay.values());

    // Calculate the total number of unique days with at least one transaction
    const daysWithTransactions = onlineSpendValues.filter(value => !isNaN(value)).length;

    // Calculate the total average online spend
    const totalAverageOnlineSpend = d3.sum(onlineSpendValues);

    // Calculate the overall average online spend
    const overallAverageOnlineSpend = totalAverageOnlineSpend / daysWithTransactions || 0;

    // Update the content of an HTML element with the result
    const averageOnlineSpendElement = document.getElementById('average-online-spend');
    if (averageOnlineSpendElement) {
        averageOnlineSpendElement.innerText = `$${overallAverageOnlineSpend.toFixed(2)}`;
    }
}

function formatNumberWithKMB(number) {
    if (Math.abs(number) >= 1.0e+6) {
        return (number / 1.0e+6).toFixed(2) + "M";
    } else if (Math.abs(number) >= 1.0e+3) {
        return (number / 1.0e+3).toFixed(2) + "K";
    } else {
        return number.toFixed(2);
    }
}

function totalSales(datapoints) {
    // Calculate the sum of offline_spend and online_spend
    const totalSales = d3.sum(datapoints, d => parseFloat(d.Offline_Spend || 0) + parseFloat(d.Online_Spend || 0));

    // Format the total sales using K or M
    const formattedTotalSales = formatNumberWithKMB(totalSales);

    // Update the content of an HTML element with the result
    const totalSalesElement = document.getElementById('total-sales');
    if (totalSalesElement) {
        totalSalesElement.innerText = `$${formattedTotalSales}`;
    }
}

function generateLineChart(datapoints) {
    // LINE CHART TOTAL TRANSACTION EVERY MONTH
    const monthlyTotals = {};

    // Define the desired order of months
    const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Iterate through the datapoints and aggregate the values for each month
    datapoints.forEach(dataPoint => {
        const { Month } = dataPoint;

        // If the month is not in the object, create it
        if (!monthlyTotals[Month]) {
            monthlyTotals[Month] = {
                totalTransactions: 0,
            };
        }

        // Add the values to the monthly totals
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
                        const percentage = ((currentValue / total) * 100).toFixed(2);
                        percentage += '%'; // Calculate percentage with 2 decimal places
                        return `${genderLabels[tooltipItem.index]}: ${genderInfo.count} (${percentage})`;
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
    // Group data by tenure_month and calculate the average online_spend
    const averageOnlineSpendPerMonth = d3.rollup(
        datapoints,
        v => d3.mean(v, d => parseFloat(d.Online_Spend || 0)),
        d => parseFloat(d.Tenure_Months)
    );

    // Extract the values for the scatter plot
    const tenureMonths = Array.from(averageOnlineSpendPerMonth.keys());
    const averageOnlineShopping = Array.from(averageOnlineSpendPerMonth.values());

    // Scatter plot data
    const scatterData = {
        labels: 'Scatter Plot',
        datasets: [{
            label: 'Average Online Sales',
            data: tenureMonths.map((val, index) => ({ x: val, y: averageOnlineShopping[index] })),
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
                        text: 'Average Online Sales Behavior'
                    }
                }
            },
            
        }
    };

    // Create the scatter plot
    const scatterChart = new Chart(
        document.getElementById('chartScatter'),
        scatterConfig
    );
}

 // Function to handle navigation clicks
 function handleNavigationClick(url) {
    // Prevent the default behavior of the anchor tag (e.g., navigating to a new page)
    event.preventDefault();

    // Assuming you have a function to process the data on the other page
    processDataOnOtherPage();
    
    // Here, you can add logic to handle the navigation click
    // For example, you can load a new page using AJAX or update the content dynamically
    console.log('Navigating to:', url);
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

const dropContainer = document.getElementById("dropcontainer")
  const fileInput = document.getElementById("fileInput")

  dropContainer.addEventListener("dragover", (e) => {
    // prevent default to allow drop
    e.preventDefault()
  }, false)

  dropContainer.addEventListener("dragenter", () => {
    dropContainer.classList.add("drag-active")
  })

  dropContainer.addEventListener("dragleave", () => {
    dropContainer.classList.remove("drag-active")
  })

  dropContainer.addEventListener("drop", (e) => {
    e.preventDefault()
    dropContainer.classList.remove("drag-active")
    fileInput.files = e.dataTransfer.files
  })