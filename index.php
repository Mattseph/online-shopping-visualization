<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
    <link rel="stylesheet" href="./assets/css/style.css">
</head>

<body>
    <div class="container">
        <div class="navigation">
            <ul>
                <li>
                    <a href="./">
                        <span class="icon">
                            <ion-icon name="logo-apple"></ion-icon>
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
                            <ion-icon name="person-outline"></ion-icon>
                        </span>
                        <span class="title">Sales Chart</span>
                    </a>
                </li>

                <li>
                    <a href="./data-visualization/prediction-chart.php">
                        <span class="icon">
                            <ion-icon name="person-outline"></ion-icon>
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
                        <div class="cardName">Average Customer Offline Spend Per Day</div>
                    </div>
                    <div class="iconBx">
                        <ion-icon name="cart-outline"></ion-icon>
                    </div>
                </div>
                <div class="card">
                    <div>
                        <div class="numbers" id="average-online-spend"></div>
                        <div class="cardName">Average Customer Online Spend Per Day</div>
                    </div>
                    <div class="iconBx">
                        <ion-icon name="cart-outline"></ion-icon>
                    </div>
                </div>
                <div class="card">
                    <div>
                        <div class="numbers">$10,465</div>
                        <div class="cardName">Earning</div>
                    </div>
                    <div class="iconBx">
                        <ion-icon name="cash-outline"></ion-icon>
                    </div>
                </div>
            </div>

            <div class="chartCard">
                <div class="chartBox bar">
                    <h2>Total Spend Every City</h2>

                    <canvas id="cityChartBar"></canvas>
                </div>

                <div class="chartBox bar">
                    <h2>Total Spend Every Category</h2>

                    <canvas id="categoryChartBar"></canvas>
                </div>

                <div class="chartBox line">
                    <h2>Total of Transaction Every Month</h2>

                    <canvas id="chartTransaction"></canvas>
                </div>

                <div class="chartBox doughnut">
                    <h2>Coupon Percentage</h2>

                    <canvas id="chartDoughnut"></canvas>
                </div>

                <div class="chartBox pie">
                    <h2>Customer Gender Percentage</h2>

                    <canvas id="chartPie"></canvas>
                </div>

                <div class="chartBox pie">
                    <h2>Title Here</h2>

                    <canvas id="chartScatter"></canvas>
                </div>


            </div>

        </div>

    </div>
    <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
    <script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js"
        integrity="sha512-M7nHCiNUOwFt6Us3r8alutZLm9qMt4s9951uo8jqO4UwJ1hziseL6O3ndFyigx6+LREfZqnhHxYjKRJ8ZQ69DQ=="
        crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <script>
    const chartData = './assets/data/online-shopping-data.csv';
    </script>
    <script defer src="./assets/js/main.js"></script>
</body>

</html>