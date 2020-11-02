import {
  cerPalette,
  prepareSeriesNonTidy,
} from "../../modules/util.js";

import abandonmentData from "./Modified.json";

export const jenniferAbandonment = () => {
  const abandonmentColors = {
    "Amounts Set Aside": cerPalette["Sun"],
    "Amount to Recover": cerPalette["Night Sky"],
  };

  const filterSeries = (seriesData) => {
    var exclude = [
      "Total Group 1 Pipelines",
      "Total Group 2 Pipelines",
      "Total CER Regulated Pipelines",
    ];

    var seriesTotals = [];

    seriesData = seriesData.map((series) => {
      seriesTotals.push({
        name: series.name,
        color: series.color,
        data: series.data.filter((row) => exclude.includes(row.name)),
      });

      return {
        data: series.data.filter((row) => !exclude.includes(row.name)),
        name: series.name,
        color: series.color,
      };
    });
    return [seriesData, seriesTotals];
  };

  var [seriesData, seriesTotals] = filterSeries(
    prepareSeriesNonTidy(
      abandonmentData,
      false,
      false,
      ["Amounts Set Aside", "Amount to Recover"],
      "Company",
      abandonmentColors,
      2,
      "name"
    )
  );

  const tooltipAbandon = (event) => {
    var toolText = `<b>${event.points[0].key}</b><table>`;
    var calc = {};
    event.points.map((p)=>{
      calc[p.series.name] = p.y;
      toolText += `<tr><td> <span style="color: ${p.color}">\u25CF</span> ${p.series.name}: </td><td style="padding:0"><b>${p.y}</b></td></tr>`
    })
    
    calc["pctRecovered"] = (
      (calc["Amounts Set Aside"] /
        (calc["Amount to Recover"] + calc["Amounts Set Aside"])) *
      100
    ).toFixed(1);
    return toolText + `<tr><td> Percent Recovered: </td><td style="padding:0"> <b>${calc["pctRecovered"]}% </b></td></tr>`;
  };

  const createAbandonmentTotals = (seriesData) => {
    return new Highcharts.chart("container_abandonment_totals", {
      chart: {
        height: "30%",
        type: "bar",
        gridLineWidth: 0,
      },

      title: { text: "Abandonment Funding Totals" },

      credits: {
        enabled: false,
      },

      plotOptions: {
        bar: {
          animation: false,
          stacking: "normal",
          marker: true,
          dataLabels: {
            enabled: true,
            formatter: function () {
              if (this.key !== "Total Group 2 Pipelines") {
                return `${(this.point.y / 1000000000).toFixed(1)} Billion`;
              } else {
                return null;
              }
            },
          },
        },
        series: {
          states: {
            inactive: {
              opacity: 1,
            },
          },
        },
      },

      legend: {
        enabled: false,
      },

      yAxis: {
        //visible: false,
        title: {
          enabled: false,
        },
        labels: {
          enabled: false,
        },
        stackLabels: {
          enabled: true,
          formatter: function () {
            var [remaining, total] = this.points[0];
            var recovered = total - remaining;
            return (recovered / total).toFixed(2) * 100 + "% recovered";
          },
        },
      },

      xAxis: {
        categories: true,
        title: {
          enabled: false,
        },
        stackLabels: {
          enabled: true,
        },
      },

      tooltip: {
        //useHTML: false,
        shared: true,
        formatter: function () {
          return tooltipAbandon(this);
        },
      },

      series: seriesData,
    });
  };

  const createAbandonmentChart = (seriesData) => {
    return new Highcharts.chart("container_abandonment", {
      chart: {
        type: "column",
      },

      title: { text: "Group 1 Abandonment Breakdown" },

      plotOptions: {
        series: {
          states: {
            inactive: {
              opacity: 1,
            },
          },
        },
      },

      credits: {
        text: "Source: CER",
      },
      xAxis: {
        categories: true,
      },

      tooltip: {
        shared: true,
        formatter: function () {
          return tooltipAbandon(this);
        },
      },

      yAxis: {
        title: {
          text: "Abandonment Costs (Billions)",
        },
        labels: {
          formatter: function (){
            return this.value/1000000000
          }
        }
      },

      series: seriesData,
    });
  };
  const abandonTotals = createAbandonmentTotals(seriesTotals);
  const abandonChart = createAbandonmentChart(seriesData);
};
