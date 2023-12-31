<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $pageTitle ?></title>
    <link rel="stylesheet" href="./../assets/css/style.css">
</head>

<body>
    <div class="container">
        <div class="navigation">
            <ul>
                <li>
                    <a href="./../">
                        <span class="icon">
                            <ion-icon name="cart-outline"></ion-icon>
                        </span>
                        <span class="title">Online Shopping</span>
                    </a>
                </li>

                <li>
                    <a href="./../">
                        <span class="icon">
                            <ion-icon name="home-outline"></ion-icon>
                        </span>
                        <span class="title">Dashboard</span>
                    </a>
                </li>
                <li>
                    <a href="./sales-chart.php">
                        <span class="icon">
                            <ion-icon name="pie-chart-outline"></ion-icon>
                        </span>
                        <span class="title">Sales Chart</span>
                    </a>
                </li>

                <li>
                    <a href="./prediction-chart.php">
                        <span class="icon">
                            <ion-icon name="bar-chart-outline"></ion-icon>
                        </span>
                        <span class="title">Prediction Chart</span>
                    </a>
                </li>

                <li>
                    <a href="#" id="reUploadButton">
                        <span class="icon">
                            <ion-icon name="cloud-upload-outline"></ion-icon>
                        </span>
                        <span class="title">Re-Uplaod Dataset</span>
                    </a>
                </li>
            </ul>
        </div>

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
                    <img src="./../assets/images/user.jpg" alt="">
                </div>
            </div>