</div>

<script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
<script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js" integrity="sha512-M7nHCiNUOwFt6Us3r8alutZLm9qMt4s9951uo8jqO4UwJ1hziseL6O3ndFyigx6+LREfZqnhHxYjKRJ8ZQ69DQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>


<?php if ($pageTitle === 'Prediction Charts') : ?>

    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.11.0"></script>
    <script defer src="./../assets/js/prediction.js"></script>

<?php elseif ($pageTitle === 'Sales Charts') : ?>

    <script defer src="./../assets/js/sales.js"></script>
    <script>
        const chartData = "./../assets/data/online-shopping-data.csv";
    </script>

<?php else : ?>

    <script defer src="./../assets/js/main.js"></script>

<?php endif; ?>

</body>

</html>