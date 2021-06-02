
class SocChartFactory {
    static create(element){
        SocChartFactory.createMarkup(element);
        SocChartFactory.drawChart(element);
    }

    static createMarkup(element){
        element.innerHTML = '<div class="socChart" style="width: 100%; height: 100%"></div>';
    }

    static drawChart(element){
        google.charts.load("current", {packages:["corechart"]});
        google.charts.setOnLoadCallback(() => {
            const csvUrl = './data/soc.csv'
            var queryOptions = {
                csvColumns: ['string', 'number', 'number'],
                csvHasHeader: true,
                sendMethod: 'xhr'
            };
            const query = new google.visualization.Query(csvUrl, queryOptions);
            query.setQuery('select *');
            query.send((response) => {
                const data = response.getDataTable();
                const rangeH = data.getColumnRange(1);
                const rangeV = data.getColumnRange(2);
                const chart = new google.visualization.BubbleChart(element);
                var options = {
                    hAxis: {
                        title: 'Sum of coupling',
                        viewWindow: {
                            min: rangeH.min - 5,
                            max: rangeH.max + 5
                        }
                    },
                    vAxis: {
                        title: 'Lines of code',
                        viewWindow: {
                            min: rangeV.min - 20,
                            max: rangeV.max + 20
                        }},
                    bubble: {textStyle: {fontSize: 11}},
                    
                };
                chart.draw(data, options);
            });

            
        });
    }
}


document
    .querySelectorAll('socChart')
    .forEach(SocChartFactory.create);