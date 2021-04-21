
class ChurnChartFactory {
    static create(element){
        ChurnChartFactory.createMarkup(element);
        ChurnChartFactory.drawChart(element);
    }

    static createMarkup(element){
        element.innerHTML = '<div class="curve_chart" style="width: 100%; height: 100%"></div>';
    }

    static drawChart(element){
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(() => {
            const csvUrl = './data/churn.csv'
            var queryOptions = {
                csvColumns: ['date', 'number', 'number'],
                csvHasHeader: true,
                sendMethod: 'xhr'
            };
            var query = new google.visualization.Query(csvUrl, queryOptions);
            query.setQuery('select date,added,deleted');
            query.send((response) => {
                const data = response.getDataTable();
                const chart = new google.visualization.LineChart(element.getElementsByClassName('curve_chart')[0]);
                var options = {
                    title: 'Churn',
                    curveType: 'function',
                    legend: { position: 'bottom' }
                };
                chart.draw(data, options);
            });
        });
    }
}


document
    .querySelectorAll('churnChart')
    .forEach(ChurnChartFactory.create);

