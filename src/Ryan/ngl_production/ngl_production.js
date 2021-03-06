import { cerPalette, conversions, tooltipPoint } from "../../modules/util.js";
import { productionChart, errorChart } from "../../modules/charts.js";
import nglProdData from "./figures.json";
import Series from "highseries";

const createChart = (lang, langShared, langUnits) => {
  var units = conversions("Mb/d to m3/d", "Mb/d", "Mb/d");
  units.display = langUnits[units.unitsCurrent];
  var nglProdColors = {
    Ethane: cerPalette["Ocean"],
    Propane: cerPalette["Forest"],
    Butanes: cerPalette["Night Sky"],
  };

  const mainNglProd = () => {
    let series = new Series({
      data: nglProdData,
      xCol: "Year",
      yCols: ["Ethane", "Propane", "Butanes"],
      colors: nglProdColors,
      names: lang.series,
    });
    var params = {
      div: "container_ngl_production",
      sourceLink:
        "https://www.cer-rec.gc.ca/en/data-analysis/canada-energy-future/index.html",
      sourceText: lang.source,
      units: units,
      series: series.hcSeries,
      lang: langShared,
    };
    var chartNgl = productionChart(params);
    var selectUnitsNglProd = document.getElementById("select_units_ngl_prod");
    selectUnitsNglProd.addEventListener("change", (selectUnitsNglProd) => {
      units.unitsCurrent = selectUnitsNglProd.target.value;
      units.display = langUnits[units.unitsCurrent];
      if (units.unitsCurrent !== units.unitsBase) {
        series.update({
          data: nglProdData,
          transform: {
            conv: [units.conversion, units.type],
            decimals: 1,
          },
        });
      } else {
        series.update({
          data: nglProdData,
          transform: {
            conv: undefined,
            decimals: undefined,
          },
        });
      }
      chartNgl.update({
        series: series.hcSeries,
        yAxis: {
          title: { text: units.display },
        },
        tooltip: {
          pointFormat: tooltipPoint(units.display),
        },
      });
    });
  };
  try {
    return mainNglProd();
  } catch (err) {
    return errorChart("container_ngl_production");
  }
};

export function ryanNglProduction(lang, langShared, langUnits) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(createChart(lang, langShared, langUnits)), 0);
  });
}
