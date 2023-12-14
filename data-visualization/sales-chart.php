<?php
$pageTitle = 'Sales Charts';

include './../includes/header.php';
?>

<div class="chartCard">

    <div class="chartBox line">
        <h2>Total Sales Every Month</h2>
        <canvas id="chartLine"></canvas>
    </div>

    <div class="chartBox bar">
        <h2>Total Sales Every City</h2>

        <canvas id="cityChartBar"></canvas>
    </div>

    <div class="chartBox bar">
        <h2>Total Sales Every Category</h2>

        <canvas id="categoryChartBar"></canvas>
    </div>

</div>

<?php include './../includes/footer.php' ?>