<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
    <link rel="stylesheet" href="./assets/css/style.css">
</head>

<body>

    <div class="upload-container">
        <div class="upload">
            <label for="images" class="drop-container" id="dropcontainer">
                <span class="drop-title">Drop files here</span>
                or
                <input type="file" id="fileInput" accept=".csv" required>
                <button class="button" onclick="handleFile()">
                    <svg class="svgIcon" viewBox="0 0 384 512">
                        <path
                            d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z">
                        </path>
                    </svg>
                </button>
            </label>
        </div>
    </div>


    <div class="dashboard-container">
        <div class="container">
            <div class="navigation">
                <ul>
                    <li>
                        <a href="./">
                            <span class="icon">
                                <ion-icon name="cart-outline"></ion-icon>
                            </span>
                            <span class="title">Online Shopping</span>
                        </a>
                    </li>

                    <li>
                        <a href="./">
                            <span class="icon">
                                <ion-icon name="home-outline"></ion-icon>
                            </span>
                            <span class="title">Dashboard</span>
                        </a>
                    </li>
                    <li>
                        <a href="./data-visualization/sales-chart.php">
                            <span class="icon">
                                <ion-icon name="pie-chart-outline"></ion-icon>

                            </span>
                            <span class="title">Sales Chart</span>
                        </a>
                    </li>

                    <li>
                        <a href="./data-visualization/prediction-chart.php">
                            <span class="icon">
                                <ion-icon name="bar-chart-outline"></ion-icon>
                            </span>
                            <span class="title">Prediction Chart</span>
                        </a>
                    </li>
                </ul>
            </div>

            <!-- main -->
            <div class="main">
                <div class="topbar">

                    <div class="toggle">
                        <ion-icon name="menu-outline"></ion-icon>
                    </div>

                    <div class="search">
                        <label for="">
                            <input type="search" name="" id="">
                            <ion-icon name="search-outline"></ion-icon>
                        </label>
                    </div>
                    <!-- userImg -->
                    <div class="user">
                        <img src="./assets/images/user.jpg" alt="">
                    </div>
                </div>
                <div class="cardBox">
                    <div class="card">
                        <div>
                            <div class="numbers" id="average-transaction"></div>
                            <div class="cardName">Average Transaction Per Day</div>
                        </div>
                        <div class="iconBx">
                            <ion-icon name="eye-outline"></ion-icon>
                        </div>
                    </div>
                    <div class="card">
                        <div>
                            <div class="numbers" id="average-offline-spend"></div>
                            <div class="cardName">Average Offline Spend Per Day</div>
                        </div>
                        <div class="iconBx">
                            <ion-icon name="cash-outline"></ion-icon>
                        </div>
                    </div>
                    <div class="card">
                        <div>
                            <div class="numbers" id="average-online-spend"></div>
                            <div class="cardName">Average Online Spend Per Day</div>
                        </div>
                        <div class="iconBx">
                            <ion-icon name="cash-outline"></ion-icon>
                        </div>
                    </div>
                    <div class="card">
                        <div>
                            <div class="numbers" id="total-sales"></div>
                            <div class="cardName">Total Sales</div>
                        </div>
                        <div class="iconBx">
                            <ion-icon name="cash-outline"></ion-icon>
                        </div>
                    </div>
                </div>

                <div class="chartCard">

                    <div class="chartBox line">
                        <h2>Total of Transaction Every Month</h2>

                        <canvas id="chartTransaction"></canvas>
                    </div>

                    <div class="chartBox scatter">
                        <h2>Average Online Spend Behavior</h2>

                        <canvas id="chartScatter"></canvas>
                    </div>

                    <div class="chartBox doughnut">
                        <h2>Coupon Percentage</h2>

                        <canvas id="chartDoughnut"></canvas>
                    </div>

                    <div class="chartBox pie">
                        <h2>Customer Gender Percentage</h2>

                        <canvas id="chartPie"></canvas>
                    </div>


                </div>

            </div>

        </div>
    </div>

    <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js">
    </script>
    <script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js"
        integrity="sha512-M7nHCiNUOwFt6Us3r8alutZLm9qMt4s9951uo8jqO4UwJ1hziseL6O3ndFyigx6+LREfZqnhHxYjKRJ8ZQ69DQ=="
        crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <script defer src="./assets/js/main.js"></script>
    <!-- <script>
    document.addEventListener('DOMContentLoaded', function() {
        const storedChartData = sessionStorage.getItem('chartData');
        if (storedChartData) {
            document.querySelector('.upload-container').style.display = 'none';
            document.querySelector('.dashboard-container').style.display = 'block';

            d3.csv(storedChartData).then(function(datapoints) {
                generateAverageTransactionsPerDay(datapoints);
                generateAverageOfflineSpendPerDay(datapoints);
                generateAverageOnlineSpendPerDay(datapoints);
                totalSales(datapoints);
                generateScatterPlot(datapoints);
                generatePieChart(datapoints);
                doughnutChartCouponPercentage(datapoints);
                generateLineChart(datapoints);
            });
        }
    });
    </script> -->

</body>

</html>