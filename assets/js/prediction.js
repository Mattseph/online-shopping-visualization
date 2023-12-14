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

    // ...

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
        modelOnline.add(tf.layers.dense({ inputShape: [1], units: 1 }));
        modelOnline.compile({ optimizer: 'sgd', loss: 'meanSquaredError' });

        const xOnline = normalizedTenure.reshape([normalizedTenure.size, 1]);
        const yOnline = normalizedOnlineSpend.reshape([normalizedOnlineSpend.size, 1]);

        await modelOnline.fit(xOnline, yOnline, { epochs: 100 });

        const modelOffline = tf.sequential();
        modelOffline.add(tf.layers.dense({ inputShape: [1], units: 10, activition: 'relu' }));
        modelOffline.add(tf.layers.dense({ inputShape: [1], units: 20 }));
        modelOffline.add(tf.layers.dense({ inputShape: [1], units: 10 }));
        modelOffline.add(tf.layers.dense({ inputShape: [1], units: 1 }));
        modelOffline.compile({ optimizer: 'sgd', loss: 'meanSquaredError' });

        const xOffline = normalizedTenure.reshape([normalizedTenure.size, 1]);
        const yOffline = normalizedOfflineSpend.reshape([normalizedOfflineSpend.size, 1]);

        await modelOffline.fit(xOffline, yOffline, { epochs: 100 });

        return { modelOnline, modelOffline, normalizedTenure, normalizedOnlineSpend, normalizedOfflineSpend };
    }

    async function main() {
        try {
            const { modelOnline, modelOffline, normalizedTenure, normalizedOnlineSpend, normalizedOfflineSpend } = await trainRegressionModel();
            const newTenure = 12;

            const normalizedNewTenure = newTenure / 12;
            const normalizedNewTenureTensor = tf.tensor2d([[normalizedNewTenure]]);
            const predictedCLVOnline = modelOnline.predict(normalizedNewTenureTensor).mul(tf.scalar(1000)).dataSync()[0];
            const predictedCLVOffline = modelOffline.predict(normalizedNewTenureTensor).mul(tf.scalar(1000)).dataSync()[0];

            // const originalData = {
            //     labels: (await normalizedTenure.array()).map(value => value.toFixed(2)),
            //     datasets: [{
            //         label: 'Online Spend',
            //         data: (await normalizedOnlineSpend.array()).map(value => value.toFixed(2)),
            //         backgroundColor: 'blue',
            //         borderColor: 'blue',
            //         fill: false,
            //         borderWidth: 1,
            //     }, {
            //         label: 'Offline Spend',
            //         data: (await normalizedOfflineSpend.array()).map(value => value.toFixed(2)),
            //         backgroundColor: 'green',
            //         borderColor: 'green',
            //         fill: false,
            //         borderWidth: 1,
            //     }],
            // };

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

            const config = {
                type: 'line',
                data: {
                    labels: predictedData.labels,
                    datasets: predictedData.datasets,
                },
                options: {
                    aspectRatio: 1,
                    scales: {
                        x: {
                            type: 'linear',
                            position: 'bottom',
                        },
                        y: {
                            type: 'linear',
                            position: 'left',
                            beginAtZero: true,
                        },
                    },
                },
            };

            const chart = new Chart(
                document.getElementById('clvChart'),
                config
            );
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }

    main();

});