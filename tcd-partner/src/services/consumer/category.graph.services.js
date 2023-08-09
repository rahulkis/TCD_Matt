import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { saveAs } from 'file-saver';
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
  );

  const saveCanvas = (elementId) => {
    //save to png
    const canvasSave = document.getElementById(elementId);
    canvasSave.toBlob(function (blob) {
        saveAs(blob, elementId+".png")
    })
}

  export const data_sex = {
    datasets: [
      {
        data: [12, 4, 2, 1, 0],
        backgroundColor: [
            'rgba(34, 64, 47, 1)',
            'rgba(245, 158, 11, 1)',
            'rgba(253, 204, 30, 1)',
            'rgba(169, 201, 182, 0.57)',
            'rgba(44, 99, 66, 1)'
        ],
        borderColor: [
          'rgba(34, 64, 47, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(253, 204, 30, 1)',
          'rgba(169, 201, 182, 0.57)',
          'rgba(44, 99, 66, 1)',
        ],
        borderWidth: 1
      },
    ],
  };
  
  export const data_sex_entries = {
    labels : ['12 Entries', '4 Entries', '2 Entries', '1 Entries', '0 Entries'],
    datasets: [
      {
        label: 'Sex',
        data: [12, 4, 2, 1, 0],
        backgroundColor: [
          'rgba(34, 64, 47, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(253, 204, 30, 1)',
          'rgba(169, 201, 182, 0.57)',
          'rgba(44, 99, 66, 1)'
        ],
        borderColor: [
          'rgba(34, 64, 47, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(253, 204, 30, 1)',
          'rgba(169, 201, 182, 0.57)',
          'rgba(44, 99, 66, 1)',
        ],
      },
    ],
  };
  
  export const data_age = {
    datasets: [
      {
        data: [13, 4, 3, 2, 0],
        backgroundColor: [
            'rgba(34, 64, 47, 1)',
            'rgba(44, 99, 66, 1)',
            'rgba(169, 201, 182, 0.57)',
            'rgba(253, 204, 30, 1)',
            'rgba(245, 158, 11, 1)'
        ],
        borderColor: [
            'rgba(34, 64, 47, 1)',
            'rgba(44, 99, 66, 1)',
            'rgba(169, 201, 182, 0.57)',
            'rgba(253, 204, 30, 1)',
            'rgba(245, 158, 11, 1)'
        ],
        borderWidth: 1
      },
    ],
  };
  
  export const data_age_entries = {
    labels : ['13 Entries', '4 Entries', '3 Entries', '2 Entries', '0 Entries'],
    datasets: [
      {
        label: 'Age',
        data: [13, 4, 3, 2, 0],
        backgroundColor: [
            'rgba(34, 64, 47, 1)',
            'rgba(44, 99, 66, 1)',
            'rgba(169, 201, 182, 0.57)',
            'rgba(253, 204, 30, 1)',
            'rgba(245, 158, 11, 1)'
        ],
        borderColor: [
            'rgba(34, 64, 47, 1)',
            'rgba(44, 99, 66, 1)',
            'rgba(169, 201, 182, 0.57)',
            'rgba(253, 204, 30, 1)',
            'rgba(245, 158, 11, 1)'
        ],
      },
    ],
  };
  
  export const data_locations = {
    datasets: [
      {
        data: [10, 5, 2, 2, 1],
        backgroundColor: [
          'rgba(34, 64, 47, 1)',
          'rgba(44, 99, 66, 1)',
          'rgba(169, 201, 182, 0.57)',
          'rgba(253, 204, 30, 1)',
          'rgba(245, 158, 11, 1)'
        ],
        borderColor: [
          'rgba(34, 64, 47, 1)',
          'rgba(44, 99, 66, 1)',
          'rgba(169, 201, 182, 0.57)',
          'rgba(253, 204, 30, 1)',
          'rgba(245, 158, 11, 1)'
        ],
        borderWidth: 1
      },
    ],
  };
  
  export const data_location_entries = {
    labels : ['10 Entries', '5 Entries', '2 Entries', '2 Entries', '1 Entries'],
    datasets: [
      {
        label: 'Locations',
        data: [10, 5, 2, 2, 1],
        backgroundColor: [
          'rgba(34, 64, 47, 1)',
          'rgba(44, 99, 66, 1)',
          'rgba(169, 201, 182, 0.57)',
          'rgba(253, 204, 30, 1)',
          'rgba(245, 158, 11, 1)'
        ],
        borderColor: [
          'rgba(34, 64, 47, 1)',
          'rgba(44, 99, 66, 1)',
          'rgba(169, 201, 182, 0.57)',
          'rgba(253, 204, 30, 1)',
          'rgba(245, 158, 11, 1)'
        ],
      },
    ],
  };
  
  export const data_medicinal_entries_objective = {
    labels : ['10 Entries', '3 Entries', '0 Entries'],
    datasets: [
      {
        label: 'Medicinal',
        data: [10, 3, 0],
        backgroundColor: [
          'rgba(34, 64, 47, 1)',
          'rgba(44, 99, 66, 1)',
          'rgba(169, 201, 182, 0.57)'
        ],
        borderColor: [
          'rgba(34, 64, 47, 1)',
          'rgba(44, 99, 66, 1)',
          'rgba(169, 201, 182, 0.57)'
        ],
      },
    ],
  };
  
  export const data_wellness_entries_objective = {
    labels : ['8 Entries', '0 Entries', '1 Entries'],
    datasets: [
      {
        label: 'Wellness',
        data: [8, 0, 1],
        backgroundColor: [
          'rgba(34, 64, 47, 1)',
          'rgba(44, 99, 66, 1)',
          'rgba(169, 201, 182, 0.57)'
        ],
        borderColor: [
          'rgba(34, 64, 47, 1)',
          'rgba(44, 99, 66, 1)',
          'rgba(169, 201, 182, 0.57)'
        ],
      },
    ],
  };
  
  export const data_recreational_entries_objective = {
    labels : ['6 Entries', '2 Entries', '1 Entries'],
    datasets: [
      {
        label: 'Recreational',
        data: [6, 2, 1],
        backgroundColor: [
          'rgba(34, 64, 47, 1)',
          'rgba(44, 99, 66, 1)',
          'rgba(169, 201, 182, 0.57)'
        ],
        borderColor: [
          'rgba(34, 64, 47, 1)',
          'rgba(44, 99, 66, 1)',
          'rgba(169, 201, 182, 0.57)'
        ],
      },
    ],
  };
  
  export const data_weekly = {
    datasets: [
      {
        data: [0, 1, 1, 12],
        backgroundColor: [
          'rgba(34, 64, 47, 1)',
          'rgba(44, 99, 66, 1)',
          'rgba(169, 201, 182, 0.57)',
          'rgba(253, 204, 30, 1)'
        ],
        borderColor: [
          'rgba(34, 64, 47, 1)',
          'rgba(44, 99, 66, 1)',
          'rgba(169, 201, 182, 0.57)',
          'rgba(253, 204, 30, 1)'
        ],
        borderWidth: 1
      },
    ],
  };
  
  export const data_weekly_entries = {
    labels : ['0 Entries', '1 Entries', '1 Entries', '12 Entries'],
    datasets: [
      {
        label: 'Weekly',
        data: [0, 1, 1, 12],
        backgroundColor: [
          'rgba(34, 64, 47, 1)',
          'rgba(44, 99, 66, 1)',
          'rgba(169, 201, 182, 0.57)',
          'rgba(253, 204, 30, 1)'
        ],
        borderColor: [
          'rgba(34, 64, 47, 1)',
          'rgba(44, 99, 66, 1)',
          'rgba(169, 201, 182, 0.57)',
          'rgba(253, 204, 30, 1)'
        ],
      },
    ],
  };
  
  export const options = {
    indexAxis: 'y',
    maintainAspectRatio: false,
    elements: {
      bar: {
        borderWidth: 1,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      },
    },
    scales: {
        xAxes: [{
            ticks: {
                display: false //this will remove only the label
            },
            gridLines: {
              color: "rgba(0, 0, 0, 0)",
              drawBorder: false,
              display: false
          }
        }],
        yAxes: [{
            gridLines: {
                color: "rgba(0, 0, 0, 0)",
                drawBorder: false,
                display: false
            }
        }]
    }
  };

  export const data_preroll = {
  datasets: [
    {
      data: [3, 4, 1],
      backgroundColor: [
        'rgba(34, 64, 47, 1)',
        'rgba(44, 99, 66, 1)',
        'rgba(169, 201, 182, 0.57)'
      ],
      borderColor: [
        'rgba(34, 64, 47, 1)',
        'rgba(44, 99, 66, 1)',
        'rgba(169, 201, 182, 0.57)'
      ],
      borderWidth: 1
    },
  ],
};

  export const data_preroll_entries = {
    labels : ['Male', 'Female', 'Non-Binary'],
    datasets: [
      {
        data: [3, 4, 1],
        backgroundColor: [
          'rgba(34, 64, 47, 1)',
          'rgba(44, 99, 66, 1)',
          'rgba(169, 201, 182, 0.57)'
        ],
        borderColor: [
          'rgba(34, 64, 47, 1)',
          'rgba(44, 99, 66, 1)',
          'rgba(169, 201, 182, 0.57)'
        ],
      },
    ],
  };

  export const data_drinks = {
    datasets: [
      {
        data: [7, 0, 0],
        backgroundColor: [
          'rgba(34, 64, 47, 1)',
          'rgba(44, 99, 66, 1)',
          'rgba(169, 201, 182, 0.57)'
        ],
        borderColor: [
          'rgba(34, 64, 47, 1)',
          'rgba(44, 99, 66, 1)',
          'rgba(169, 201, 182, 0.57)'
        ],
        borderWidth: 1
      },
    ],
  };
  
  export const data_drinks_entries = {
    labels : ['Male', 'Female', 'Non-Binary'],
    datasets: [
      {
        data: [7, 0, 0],
        backgroundColor: [
          'rgba(34, 64, 47, 1)',
          'rgba(44, 99, 66, 1)',
          'rgba(169, 201, 182, 0.57)'
        ],
        borderColor: [
          'rgba(34, 64, 47, 1)',
          'rgba(44, 99, 66, 1)',
          'rgba(169, 201, 182, 0.57)'
        ],
      },
    ],
  };

  export const data_edibles = {
    datasets: [
      {
        data: [4, 2, 0],
        backgroundColor: [
          'rgba(34, 64, 47, 1)',
          'rgba(44, 99, 66, 1)',
          'rgba(169, 201, 182, 0.57)'
        ],
        borderColor: [
          'rgba(34, 64, 47, 1)',
          'rgba(44, 99, 66, 1)',
          'rgba(169, 201, 182, 0.57)'
        ],
        borderWidth: 1
      },
    ],
  };
  
  export const data_edibles_entries = {
    labels : ['Male', 'Female', 'Non-Binary'],
    datasets: [
      {
        data: [4, 2, 0],
        backgroundColor: [
          'rgba(34, 64, 47, 1)',
          'rgba(44, 99, 66, 1)',
          'rgba(169, 201, 182, 0.57)'
        ],
        borderColor: [
          'rgba(34, 64, 47, 1)',
          'rgba(44, 99, 66, 1)',
          'rgba(169, 201, 182, 0.57)'
        ],
      },
    ],
  };
  
  export const data_vape = {
    datasets: [
      {
        data: [2, 1, 0],
        backgroundColor: [
          'rgba(34, 64, 47, 1)',
          'rgba(44, 99, 66, 1)',
          'rgba(169, 201, 182, 0.57)',
        ],
        borderColor: [
          'rgba(34, 64, 47, 1)',
          'rgba(44, 99, 66, 1)',
          'rgba(169, 201, 182, 0.57)'
        ],
        borderWidth: 1
      },
    ],
  };
  
  export const data_vape_entries = {
    labels : ['Male', 'Female', 'Non-Binary'],
    datasets: [
      {
        data: [2, 1, 0],
        backgroundColor: [
          'rgba(34, 64, 47, 1)',
          'rgba(44, 99, 66, 1)',
          'rgba(169, 201, 182, 0.57)',
        ],
        borderColor: [
          'rgba(34, 64, 47, 1)',
          'rgba(44, 99, 66, 1)',
          'rgba(169, 201, 182, 0.57)',
        ],
      },
    ],
  };
  export const data_flower = {
    datasets: [
      {
        data: [2, 4, 1],
        backgroundColor: [
          'rgba(34, 64, 47, 1)',
          'rgba(44, 99, 66, 1)',
          'rgba(169, 201, 182, 0.57)',
        ],
        borderColor: [
          'rgba(34, 64, 47, 1)',
          'rgba(44, 99, 66, 1)',
          'rgba(169, 201, 182, 0.57)'
        ],
        borderWidth: 1
      },
    ],
  };
  
  export const data_flower_entries = {
    labels : ['Male', 'Female', 'Non-Binary'],
    datasets: [
      {
        data: [2, 4, 1],
        backgroundColor: [
          'rgba(34, 64, 47, 1)',
          'rgba(44, 99, 66, 1)',
          'rgba(169, 201, 182, 0.57)',
        ],
        borderColor: [
          'rgba(34, 64, 47, 1)',
          'rgba(44, 99, 66, 1)',
          'rgba(169, 201, 182, 0.57)',
        ],
      },
    ],
  };
  export const data_ingestible = {
    datasets: [
      {
        data: [1, 3, 0],
        backgroundColor: [
          'rgba(34, 64, 47, 1)',
          'rgba(44, 99, 66, 1)',
          'rgba(169, 201, 182, 0.57)',
        ],
        borderColor: [
          'rgba(34, 64, 47, 1)',
          'rgba(44, 99, 66, 1)',
          'rgba(169, 201, 182, 0.57)'
        ],
        borderWidth: 1
      },
    ],
  };
  
  export const data_ingestible_entries = {
    labels : ['Male', 'Female', 'Non-Binary'],
    datasets: [
      {
        data: [1, 3, 0],
        backgroundColor: [
          'rgba(34, 64, 47, 1)',
          'rgba(44, 99, 66, 1)',
          'rgba(169, 201, 182, 0.57)',
        ],
        borderColor: [
          'rgba(34, 64, 47, 1)',
          'rgba(44, 99, 66, 1)',
          'rgba(169, 201, 182, 0.57)',
        ],
      },
    ],
  };
  export const options_main = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false,
        text: 'Chart.js Line Chart',
      },
    },
  };
  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  export const data_main = {
    labels,
    datasets: [
      {
        data: [8, 1, 3, 0, 13, 5],
        borderColor: 'rgba(34, 64, 47, 1)',
        backgroundColor: 'rgba(34, 64, 47, 1)',
      },
      {
        data: [3, 13, 1, 0, 4, 10],
        borderColor: 'rgba(44, 99, 66, 1)',
        backgroundColor: 'rgba(44, 99, 66, 1)',
      },
      {
        data: [2, 10, 0, 4, 5, 1],
        borderColor: 'rgba(169, 201, 182, 0.57)',
        backgroundColor: 'rgba(169, 201, 182, 0.57)',
      },
      {
        data: [0, 1, 4, 0, 1, 0],
        borderColor: 'rgba(104, 204, 143, 1)',
        backgroundColor: 'rgba(104, 204, 143, 1)',
      }
    ],
  };

  const applyCustomOrder = (arr, desiredOrder) => {
    const orderForIndexVals = desiredOrder.slice(0).reverse();
    arr.sort((a, b) => {
      const aIndex = -orderForIndexVals.indexOf(a);
      const bIndex = -orderForIndexVals.indexOf(b);
      return aIndex - bIndex;
    });
  }
  const mainbarDataConstructor = (data) => {
    var categoryDataLabels = [];
    var categorydataSets = [];
    for (var i in data) {
        var categoryDataValues = [];
        for (var x in data[i].entries_by_month) {
            categoryDataValues.push(data[i].entries_by_month[x].entries)
            if (!categoryDataLabels.includes(data[i].entries_by_month[x].monthyear)) categoryDataLabels.push(data[i].entries_by_month[x].monthyear)
        }
        categorydataSets.push(
            {
                data: categoryDataValues,
                borderColor: borderColor[i],
                backgroundColor: backgroundColor[i],
            }
        )
    }
    var sortOrder = ['January 2022','February 2022','March 2022','April 2022','May 2022','June 2022','July 2022','August 2022','September 2022','October 2022','November 2022 ','December 2022'];
    applyCustomOrder(categoryDataLabels, sortOrder);
    return {
        labels: [...new Set(categoryDataLabels)],
        datasets: categorydataSets
    };
  }
  var colorDatas = [
    '/assets/images/icon10.png',
    '/assets/images/icon11.png',
    '/assets/images/icon12.png',
    '/assets/images/icon16.png',
    '/assets/images/icon25.png',
    '/assets/images/icon23.png',
  ]
  var backgroundColor = [
    'rgba(34, 64, 47, 1)',
    'rgba(245, 158, 11, 1)',
    'rgba(253, 204, 30, 1)',
    'rgba(169, 201, 182, 0.57)',
    'rgba(44, 99, 66, 1)',
    'rgba(176, 138, 4, 255)'
  ]
  var borderColor = [
    'rgba(34, 64, 47, 1)',
    'rgba(245, 158, 11, 1)',
    'rgba(253, 204, 30, 1)',
    'rgba(169, 201, 182, 0.57)',
    'rgba(44, 99, 66, 1)',
    'rgba(176, 138, 4, 255)'
  ]

  const doughnutDataConstructor = (data, limit) => {
    var limitDefault = !!limit ? limit : 3;
    var dataValues = [];
    var dataBgColor = [];
    var dataBorderColor = [];
    for (var i = 0; i < data.length; i++) {  
      if (i===limitDefault)break
      dataValues.push(data[i].total_entries)
      dataBgColor.push(backgroundColor[i])
      dataBorderColor.push(borderColor[i])
    }
    return {datasets: [
      {
        data: dataValues,
        backgroundColor: dataBgColor,
        borderColor: dataBorderColor,
        borderWidth: 1
      },
    ]};
  };

  const barDataConstructor = (data, limit, name) => {
    var limitDefault = !!limit ? limit : 3;
    var dataValues = [];
    var dataBgColor = [];
    var dataBorderColor = [];
    var dataLabels = [];
    for (var i = 0; i < data.length; i++) {  
      if (i===limitDefault)break
      dataValues.push(data[i].total_entries)
      dataBgColor.push(backgroundColor[i])
      dataBorderColor.push(borderColor[i])
      dataLabels.push(data[i].total_entries+ ' Entries');
    }
    return {
      labels: dataLabels,
      datasets: [
                {
                  data: dataValues,
                  backgroundColor: dataBgColor,
                  borderColor: dataBorderColor,
                  borderWidth: 1
                },
              ]
    };
  }
const CategoryGraphServices = ({chartName, data, name}) => { 
    switch (chartName) {
        case "topACES":
          return <>
            <div className="demopie_chart">
                    <div className="demopie_row">
                      <div className="demopie_title">
                        <h5>{name}</h5>
                      </div>

                      <div className="demopie_drop">
                      <a href="#" onClick={() => {saveCanvas({name})}}>
                          {" "}
                          <img
                            src="/assets/images/icons/arrow2.svg"
                            alt=""
                          />{" "}
                          Export
                        </a>
                      </div>
                    </div>

                    <div className="demograph_chart">
                      <div className="demograph_chart_left">
                        <div className="analist_chart">
                          <Doughnut id="data_sex" data={doughnutDataConstructor(data, 5)}/>
                        </div>

                        <div className="demograph_list">
                        <ul>
                          {
                            data.map(function(object, i){
                              return(<li>
                              {" "}
                              <img
                                  src={colorDatas[i]}
                                  alt=""
                              />{" "}
                              {data[i].name}{" "}
                              </li>)
                          })
                          }
                          </ul>
                        </div>
                      </div>

                      <div className="demograph_chart_right">
                        <div className="progress_list">
                          <Bar id="data_sex" data={barDataConstructor(data, 5, "Entries")}/>
                        </div>

                        <div className="progressbtm_list">
                        <ul>
                        {
                            data.map(function(object, i){
                              return(<li>
                              {" "}
                              <img
                                  src={colorDatas[i]}
                                  alt=""
                              />{" "}
                              {data[i].name}{" "}
                              </li>)
                          })
                          }
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
          </>;
        case "data_sex_entries":
            return <Bar id="data_sex_entries" options={options} data={data_sex_entries} />;
        case "data_age":
            return <Doughnut id="data_age" data={data_age}/>;
        case "data_age_entries":
            return <Bar id="data_age_entries" options={options} data={data_age_entries} />;
        case "data_locations":
            return <Doughnut id="data_locations" data={data_locations}/>;
        case "data_location_entries":
            return <Bar id="data_location_entries" options={options} data={data_location_entries} />;
        case "data_medicinal_entries_objective":
            return <Bar id="data_medicinal_entries_objective" options={options} data={data_medicinal_entries_objective} />;
        case "data_wellness_entries_objective":
            return <Bar id="data_wellness_entries_objective" options={options} data={data_wellness_entries_objective} />;
        case "data_recreational_entries_objective":
            return <Bar id="data_recreational_entries_objective" options={options} data={data_recreational_entries_objective} />;
        case "data_weekly":
            return <Doughnut id="data_weekly" data={data_weekly}/>;
        case "data_weekly_entries":
            return <Bar id="data_weekly_entries" options={options} data={data_weekly_entries} />;
        case "data_preroll":
            return <Doughnut id="data_preroll" data={data_preroll}/>;
        case "data_preroll_entries":
            return <Bar id="data_preroll_entries" options={options} data={data_preroll_entries} />;
        case "data_drinks":
            return <Doughnut id="data_drinks" data={data_drinks}/>;
        case "data_drinks_entries":
            return <Bar id="data_drinks_entries" options={options} data={data_drinks_entries} />;
        case "data_edibles":
            return <Doughnut id="data_edibles" data={data_edibles}/>;
        case "data_edibles_entries":
            return <Bar id="data_edibles_entries" options={options} data={data_edibles_entries} />;
        case "data_vape":
            return <Doughnut id="data_vape" data={data_vape}/>;
        case "data_vape_entries":
            return <Bar id="data_vape_entries" options={options} data={data_vape_entries} />;
        case "data_flower":
            return <Doughnut id="data_vape" data={data_flower}/>;
        case "data_flower_entries":
            return <Bar id="data_vape_entries" options={options} data={data_flower_entries} />;
        case "data_ingestible":
            return <Doughnut id="data_shatter" data={data_ingestible}/>;
        case "data_ingestible_entries":
            return <Bar id="data_ingestible_entries" options={options} data={data_ingestible_entries} />;
        case "main_graph":
          return <>
          <div className="entry_graph">
            <Bar id="main_graph" options={options_main} data={mainbarDataConstructor(data)} />
          </div>
          <div className="progressbtm_list">
          <ul>
              {
                  data.map(function(object, i){
                    return(<li>
                    {" "}
                    <img
                        src={colorDatas[i]}
                        alt=""
                    />{" "}
                    {object.name}{" "}
                    </li>)
                })
              }
            </ul>
          </div>
          </>;
        case "main_entries":
          return <Bar id="main_entries" options={options_main} data={data_main} />;
        default:
            return <Doughnut id="data_sex" data={data_sex}/>;
    }

  }

  export default CategoryGraphServices;