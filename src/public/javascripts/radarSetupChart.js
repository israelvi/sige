      /* Radar chart design created by Nadieh Bremer - VisualCinnamon.com */

////////////////////////////////////////////////////////////// 
//////////////////////// Set-Up ////////////////////////////// 
////////////////////////////////////////////////////////////// 

var margin = { top: 100, right: 100, bottom: 100, left: 100 },
    width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
    height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);

////////////////////////////////////////////////////////////// 
////////////////////////// Data ////////////////////////////// 
////////////////////////////////////////////////////////////// 

var data = [
    [//PRI
        { axis: "Factores Externos", value: 0.78 },
        { axis: "Popularidad del Candidato", value: 0.29 },
        { axis: "Percepción Ciudadanía", value: 0.17 },
        { axis: "Factores Negativos", value: 0.22 },
        { axis: "Partido", value: 0.02 },
        { axis: "Preferencia", value: 0.21 },
    ], [//PAN
        { axis: "Factores Externos", value: 0.48 },
        { axis: "Popularidad del Candidato", value: 0.39 },
        { axis: "Percepción Ciudadanía", value: 0.27 },
        { axis: "Factores Negativos", value: 0.42 },
        { axis: "Partido", value: 0.12 },
        { axis: "Preferencia", value: 0.21 },
    ], [//PRD
        { axis: "Factores Externos", value: 0.58 },
        { axis: "Popularidad del Candidato", value: 0.33 },
        { axis: "Percepción Ciudadanía", value: 0.45 },
        { axis: "Factores Negativos", value: 0.29 },
        { axis: "Partido", value: 0.44 },
        { axis: "Preferencia", value: 0.34 },
    ]
];
////////////////////////////////////////////////////////////// 
//////////////////// Draw the Chart ////////////////////////// 
////////////////////////////////////////////////////////////// 

var color = d3.scale.ordinal()
				.range(["#F6111B", "#00468E", "#FFD90A"]);

var radarChartOptions = {
    w: width,
    h: height,
    margin: margin,
    maxValue: 1,
    levels: 10,
    roundStrokes: true,
    color: color,
    dotRadius: 5
};
//Call function to draw the Radar chart
RadarChart(".radarChart", data, radarChartOptions);
