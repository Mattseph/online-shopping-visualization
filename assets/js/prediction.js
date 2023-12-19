document.addEventListener('DOMContentLoaded', function () {

    async function loadCSVData() {
        try {
            const response = await fetch('./../assets/data/online-shopping-data.csv');
            if (!response.ok) {
                throw new Error('Failed to load CSV data');
            }
            const text = await response.text();
            return text;
        } catch (error) {
            console.error('Error loading CSV data:', error);
            throw error;
        }
    }

    async function trainRegressionModel() {
        const csvData = await loadCSVData();

        const data = tf.data.csv(csvData, { hasHeader: true });

        const tenureMonths = Float32Array.from(data.map(record => parseFloat(record['Tenure_Months'])));
        const onlineSpend = Float32Array.from(data.map(record => parseFloat(record['Online_Spend'])));
        const offlineSpend = Float32Array.from(data.map(record => parseFloat(record['Offline_Spend'])));

        const normalizedTenure = tf.tensor1d(tenureMonths).div(tf.scalar(12)).toFloat();
        const normalizedOnlineSpend = tf.tensor1d(onlineSpend).div(tf.scalar(1000)).toFloat();
        const normalizedOfflineSpend = tf.tensor1d(offlineSpend).div(tf.scalar(1000)).toFloat();

        const modelOnline = tf.sequential();
        modelOnline.add(tf.layers.dense({ units: 10, inputShape: [1], activation: 'relu' }));
        modelOnline.add(tf.layers.dense({ units: 1 }));
        modelOnline.compile({ optimizer: 'sgd', loss: 'meanSquaredError' });

        const xOnline = normalizedTenure.reshape([normalizedTenure.size, 1]);
        const yOnline = normalizedOnlineSpend.reshape([normalizedOnlineSpend.size, 1]);

        await modelOnline.fit(xOnline, yOnline, { epochs: 300 });

        const modelOffline = tf.sequential();
        modelOffline.add(tf.layers.dense({ units: 10, inputShape: [1], activation: 'relu' }));
        modelOffline.add(tf.layers.dense({ units: 1 }));
        modelOffline.compile({ optimizer: 'sgd', loss: 'meanSquaredError' });

        const xOffline = normalizedTenure.reshape([normalizedTenure.size, 1]);
        const yOffline = normalizedOfflineSpend.reshape([normalizedOfflineSpend.size, 1]);

        await modelOffline.fit(xOffline, yOffline, { epochs: 300 });

        return { modelOnline, modelOffline, normalizedTenure, normalizedOnlineSpend, normalizedOfflineSpend };
    }

    async function evaluateModel(model, x, y, modelName) {
        const predictions = model.predict(x);

        // Ensure tensors have the correct shape
        const yReshaped = y.reshape(predictions.shape);
        
        const mse = tf.losses.meanSquaredError(yReshaped, predictions).dataSync()[0];
        
        // Calculate MAE manually
        const mae = tf.metrics.meanAbsoluteError(yReshaped, predictions).dataSync()[0];

        // Calculate RMSE manually
        const rmse = Math.sqrt(mse);

        // Update the model metrics in the HTML
        const metricsContainer = document.querySelector('.modelMetrics');
        
        if (metricsContainer) {
            const modelMetrics = document.createElement('div');
            modelMetrics.innerHTML = `
                <h3><b>${modelName} Spend Model Evaluation Metrics</b></h3>
                <p id="${modelName.toLowerCase()}MSE">Mean Squared Error: ${mse}</p>
                <p id="${modelName.toLowerCase()}MAE">Mean Absolute Error: ${mae}</p>
                <p id="${modelName.toLowerCase()}RMSE">Root Mean Squared Error: ${rmse}</p>
                <br>
            `;
            metricsContainer.appendChild(modelMetrics);
        }

        return { mse, mae, rmse };
    }

    function createChart(labels, datasets) {
        const config = {
            type: 'line',
            data: {
                labels: labels.map(label => parseInt(label)), // Convert labels to integers
                datasets: datasets,
            },
            options: {
                aspectRatio: 1,
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        ticks: {
                            stepSize: 1, // Adjust the step size if needed
                        },
                    },
                    y: {
                        type: 'linear',
                        position: 'left',
                        beginAtZero: true,
                    },
                },
            },
        };
    
        const chart = new Chart(document.getElementById('clvChart'), config);
    }
    

    async function main() {
        try {
            const { modelOnline, modelOffline, normalizedTenure, normalizedOnlineSpend, normalizedOfflineSpend } = await trainRegressionModel();

            const newTenure = 12;

            const normalizedNewTenure = newTenure / 12;
            const normalizedNewTenureTensor = tf.tensor2d([[normalizedNewTenure]]);

            // Reshape the input tensor to match the expected shape
            const xNewTenure = normalizedNewTenureTensor.reshape([normalizedNewTenureTensor.shape[0], 1]);

            const { mse: mseOnline, mae: maeOnline, rmse: rmseOnline } = await evaluateModel(modelOnline, xNewTenure, tf.tensor2d([[0]]), 'Online');
            const { mse: mseOffline, mae: maeOffline, rmse: rmseOffline } = await evaluateModel(modelOffline, xNewTenure, tf.tensor2d([[0]]), 'Offline');

            const predictedCLVOnline = modelOnline.predict(xNewTenure).mul(tf.scalar(1000)).dataSync()[0];
            const predictedCLVOffline = modelOffline.predict(xNewTenure).mul(tf.scalar(1000)).dataSync()[0];

            const predictedData = {
                labels: [newTenure.toFixed(2)],
                datasets: [{
                    label: 'Predicted CLV (Online Spend)',
                    data: [predictedCLVOnline.toFixed(2)],
                    backgroundColor: 'red',
                    borderColor: 'red',
                    fill: false,
                    borderWidth: 1,
                }, {
                    label: 'Predicted CLV (Offline Spend)',
                    data: [predictedCLVOffline.toFixed(2)],
                    backgroundColor: 'orange',
                    borderColor: 'orange',
                    fill: false,
                    borderWidth: 1,
                }],
            };

            createChart(predictedData.labels, predictedData.datasets);

        } catch (error) {
            console.error('An error occurred:', error);
        }
    }

    main();

});
