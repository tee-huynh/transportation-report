const crudeProdColors = {'Conventional Light':cerPalette['Sun'],
'Conventional Heavy':cerPalette['Night Sky'],
'C5+':cerPalette['Ocean'],
'Field Condensate':cerPalette['Forest'],
'Mined Bitumen':cerPalette['Cool Grey'],
'In Situ Bitumen':cerPalette['Dim Grey']}

var crudeProdFilters = {'Region':'Canada'}
var units = '1000 bbl/day'
const crudeProdColumns=['Conventional Light','Conventional Heavy','C5+','Field Condensate','Mined Bitumen','In Situ Bitumen']
const crudeProdData = JSON.parse(JSON.stringify(JSON.parse(getData('Kevin/crude_production/Crude_Oil_Production.json'))));
fillDrop('Region','select_region_crude_prod','Canada',crudeProdData)

//var seriesData = prepareSeriesNonTidy(crudeProdData,crudeProdFilters,valueVars=crudeProdColumns,xCol='Year',crudeProdColors)
var seriesData = prepareSeriesNonTidyUnits(crudeProdData,
    crudeProdFilters,
    unitsCurrent=units,
    baseUnits=units,
    conversion=6.2898,
    convType='/',
    valueVars=crudeProdColumns,
    xCol='Year',
    colors=crudeProdColors)

const createCrudeProdChart = (seriesData) => {


var chart = new Highcharts.chart('container_crude_production', {

    chart: {
        type: 'column', //line,bar,scatter,area,areaspline
        zoomType: 'x', //allows the user to focus in on the x or y (x,y,xy)
        borderColor: 'black',
        borderWidth: 1,
        animation: true,
        events: {
            load: function () {
                this.credits.element.onclick = function () {
                    window.open(
                        'https://www.cer-rec.gc.ca/index-eng.html',
                        '_blank' // <- This is what makes it open in a new window.
                    );
                }
            }
        }
    },

    title: {
        text: null
    },

    credits: {
        //enabled:false //gets rid of the "Highcharts logo in the bottom right"
        text: 'Canada Energy Regulator',
        href: 'https://www.cer-rec.gc.ca/index-eng.html'
    },

    plotOptions: {
        column: {
            stacking: 'normal',
            dataLabels: {
                enabled: false
            }
        }
    },

    tooltip: {
        animation: true,
        //shared: true,
    },

    // title: { text: 'Canada Propane Exports' },

    // xAxis: {
    // },

    yAxis: {
        title: { text: 'Thousand bbl/day' },
        stackLabels: {
            enabled: true,
            style: {
                fontWeight: 'bold',
                color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
            }
        }
    },

    lang: {
        noData: "No Exports"
    },

    noData: {
        style: {
            fontWeight: 'bold',
            fontSize: '15px',
            color: '#303030'
        }
    },
    series: seriesData
});

return chart

}

var chartCrude = createCrudeProdChart(seriesData) //do I need to have each chart variable with a different name?

//recreate the chart when the region changes
var selectRegionCrudeProd = document.getElementById('select_region_crude_prod');
selectRegionCrudeProd.addEventListener('change', (selectRegionCrudeProd) => {
    var region = selectRegionCrudeProd.target.value;
    crudeProdFilters['Region'] = region
    var seriesData = prepareSeriesNonTidyUnits(crudeProdData,
        crudeProdFilters,
        unitsCurrent=units,
        baseUnits='1000 bbl/day',
        conversion=6.2898,
        convType='/',
        valueVars=crudeProdColumns,
        xCol='Year',
        colors=crudeProdColors)
    chartCrude = createCrudeProdChart(seriesData)
});

//update existing chart when the units change
var selectUnitsCrudeProd = document.getElementById('select_units_crude_prod');
selectUnitsCrudeProd.addEventListener('change', (selectUnitsCrudeProd) => {
    var units = selectUnitsCrudeProd.target.value;
    var seriesData = prepareSeriesNonTidyUnits(crudeProdData,
        crudeProdFilters,
        unitsCurrent=units,
        baseUnits='1000 bbl/day',
        conversion=6.2898,
        convType='/',
        valueVars=crudeProdColumns,
        xCol='Year',
        colors=crudeProdColors)
    
    chartCrude.update({
        series:seriesData
    })
});








