import { cerPalette, getUnique, setTitle, bands } from "../../modules/util.js";
import { errorChart } from "../../modules/charts.js";
import creditData from "../credit_ratings/May 13 - Credit Ratings FINAL.json";
import scaleData from "../credit_ratings/Scale.json";

const createChart = (lang, fraLevel) => {
  const ratingsColors = {
    DBRS: cerPalette["Sun"],
    "S&P": cerPalette["Night Sky"],
    "Moody's": cerPalette["Forest"],
  };

  var ratingsFilter = { Year: 2020 };

  const addColumns = (data, entities, agencies) => {
    const series = {};
    entities.map((company) => {
      agencies.map((agent) => {
        series[company + " - " + agent] = { name: company, y: null };
      });
    });
    data.map((row) => {
      row["Corporate Entity"] = row.series.split(" - ")[0];
      row["Type"] = row.series.split(" - ").slice(-1)[0];
      series[row["series"]] = {
        name: row["Corporate Entity"],
        y: row["Level"],
      };
    });
    const cS = { DBRS: [], "Moody's": [], "S&P": [] };
    for (const [key, value] of Object.entries(series)) {
      agencies.map((agent) => {
        if (key.includes(agent)) {
          cS[agent].push(value);
        }
      });
    }
    return [
      { name: "Moody's", data: cS["Moody's"], color: ratingsColors["Moody's"] },
      { name: "S&P", data: cS["S&P"], color: ratingsColors["S&P"] },
      { name: "DBRS", data: cS["DBRS"], color: ratingsColors["DBRS"] },
    ];
  };

  const applyMissing = (data, filter) => {
    var creditEntity = data.filter((row) => row.Year == filter.Year);
    const entities = [
      "Enbridge Inc.",
      "Enbridge Pipelines Inc.",
      "Westcoast Energy Inc.",
      "TC Energy Corporation",
      "TransCanada PipeLines Limited",
      "NOVA Gas Transmission Ltd.",
      "TQM Pipeline Inc.",
      "Emera Inc.",
      "Maritimes & Northeast Pipeline Limited Partnership",
      "Alliance Pipeline Ltd.",
    ];
    const agencies = ["S&P", "Moody's", "DBRS"];
    creditEntity = addColumns(creditEntity, entities, agencies);
    return creditEntity;
  };

  const yRange = (creditData) => {
    const creditRange = getUnique(creditData, "Level");
    return [Math.min(...creditRange), 26];
  };

  const createChartCross = (series, minY, maxY) => {
    return Highcharts.chart("container_ratings_cross", {
      chart: {
        // borderWidth: 1,
        type: "column",
      },

      credits: {
        text: "",
      },

      plotOptions: {
        series: {
          states: {
            inactive: {
              opacity: 1,
            },
          },
        },
        column: {
          stacking: null,
        },
      },

      legend: {
        align: "left",
        verticalAlign: "bottom",
        backgroundColor: "white",
        borderColor: cerPalette["Dim Grey"],
        borderWidth: 3,
        y: -50,
        floating: true,
      },

      xAxis: {
        categories: true,
        crosshair: true,
        plotBands: [
          bands(-0.5, 2.5, lang.enbridge, 15, 0),
          bands(2.5, 5.5, lang.tc, 15, 0, "#bde0ff"),
          bands(5.5, 11.5, lang.other, 15, 0),
        ],
      },

      yAxis: {
        title: { text: lang.yAxis },
        gridLineWidth: 3,
        gridZIndex: 1,
        categories: true,
        max: maxY,
        min: minY - 1,
        labels: {
          formatter: function () {
            if (fraLevel) {
              var langLevel = fraLevel[scaleData[this.value].creditQuality];
            } else {
              var langLevel = scaleData[this.value].creditQuality;
            }
            return `${langLevel}<b> - ${scaleData[this.value]["S&P"]},
              ${scaleData[this.value]["Moody's"]},
              ${scaleData[this.value]["DBRS"]}</b>`;
          },
        },
        plotLines: [
          {
            color: cerPalette["Ocean"],
            value: 16,
            width: 2,
            zIndex: 7,
            label: {
              text: lang.level,
              align: "right",
              x: -10,
              rotation: 90,
              style: {
                fontSize: 14,
                color: cerPalette["Ocean"],
                fontWeight: "bold",
              },
            },
          },
        ],
      },
      tooltip: {
        shared: true,
        backgroundColor: "white",
        useHTML: true,
        formatter: function () {
          var toolText = `<b> ${this.points[0].key} </b><table>`;
          this.points.map((p) => {
            toolText += `<tr><td> <span style="color: ${
              p.color
            }">\u25CF</span> ${p.series.name}:</td><td style="padding:0">&nbsp<b>${
              scaleData[p.y][p.series.name]
            }</b></td></tr>`;
          });
          return toolText + "</table>";
        },
      },
      series: series,
    });
  };

  const mainCreditYear = () => {
    const [minY, maxY] = yRange(creditData);
    var yearChart = createChartCross(
      applyMissing(creditData, ratingsFilter),
      minY,
      maxY
    );
    var figure_title = document.getElementById("ratings_year_title");
    setTitle(figure_title, "31", ratingsFilter.Year, "Annual Comparison of Credit Ratings for Major Pipeline Companies");

    $("#credit_years button").on("click", function () {
      $(".btn-credit > .btn").removeClass("active");
      $(this).addClass("active");
      var thisBtn = $(this);
      var btnText = thisBtn.text();
      var btnValue = thisBtn.val();
      $("#selectedVal").text(btnValue);
      ratingsFilter.Year = btnText;
      setTitle(
        figure_title,
        "31",
        ratingsFilter.Year,
        "Company Credit Ratings"
      );
      yearChart.update({
        series: applyMissing(creditData, ratingsFilter),
      });
    });
  };
  try {
    return mainCreditYear();
  } catch (err) {
    return errorChart("container_ratings_cross");
  }
};

export function jenniferRatingsCross(lang, fraLevel) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(createChart(lang, fraLevel)), 0);
  });
}
