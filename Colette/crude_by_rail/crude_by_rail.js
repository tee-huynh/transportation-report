document.addEventListener('DOMContentLoaded',()=>{
    const chart = Highcharts.chart('container', {

        chart:{
            type:'area', //line,bar,scatter,area,areaspline
            zoomType: 'x', //allows the user to focus in on the x or y (x,y,xy)
            borderColor: 'black',
            borderWidth: 1,
            animation: false
        },

        credits:{
            //enabled:false //gets rid of the "Highcharts logo in the bottom right"
            text:'Canada Energy Regulator',
            href:'https://www.cer-rec.gc.ca/index-eng.html'
        },

        title:{text:'Crude by Rail Exports'},


        data: {
            //csv: document.getElementById('csv').innerHTML
            csvURL: 'https://raw.githubusercontent.com/mbradds/HighchartsData/master/crude_by_rail.csv',
            seriesMapping : [{x:0,y:1}]
        },

        colors:['#054169','#FFBE4B','#5FBEE6','#559B37','#FF821E','#871455','#FFFFFF','#8c8c96','#42464B'],

        plotOptions: {
            series: {
                stickyTracking:false,
                marker: {
                    enabled: true
                },
                states: {
                    inactive: {
                      opacity: 1
                    }
                  }
            }
        },

        tooltip:{
            shared:true,
        },

        xAxis: {
            type: 'datetime'
        },

        yAxis: {
            title:{text:'Crude by Rail Exports (bbl/day)'}
        }

    });

});