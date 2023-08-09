import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
  );

  export const data_medicinal_entries = {
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

  export const data_wellness_entries = {
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

  export const data_recreational_entries = {
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
        label: 'Week',
        data: [26, 12, 1, 1, 0],
        backgroundColor: [
          'rgba(34, 64, 47, 1)',
          'rgba(44, 99, 66, 1)',
          'rgba(169, 201, 182, 0.57)',
          'rgba(253, 204, 30, 1)',
          'rgba(176, 138, 4, 255)'
        ],
        borderColor: [
          'rgba(34, 64, 47, 1)',
          'rgba(44, 99, 66, 1)',
          'rgba(169, 201, 182, 0.57)',
          'rgba(253, 204, 30, 1)',
          'rgba(176, 138, 4, 255)'
        ],
        borderWidth: 1
      },
    ],
  };
  
  export const data_weekly_entries = {
    labels : ['15+ Weeks', '11-14 Weeks', '6-10 Weeks', '3-5 Weeks', '0-2 Weeks'],
    datasets: [
      {
        label: 'Entries',
        data: [26, 12, 1, 1, 0],
        backgroundColor: [
          'rgba(34, 64, 47, 1)',
          'rgba(44, 99, 66, 1)',
          'rgba(169, 201, 182, 0.57)',
          'rgba(253, 204, 30, 1)',
          'rgba(176, 138, 4, 255)'
        ],
        borderColor: [
          'rgba(34, 64, 47, 1)',
          'rgba(44, 99, 66, 1)',
          'rgba(169, 201, 182, 0.57)',
          'rgba(253, 204, 30, 1)',
          'rgba(176, 138, 4, 255)'
        ],
      },
    ],
  };
  
export const weekly_options = {
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
  },
  callbacks: {
      label: function(tooltipItem) {
          return "$" + Number(tooltipItem.yLabel) + " and so worth it !";
      }
  }
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

  const doughnutDataConstructor = (data, limit) => {
    var limitDefault = !!limit ? limit : 3;
    var dataValues = [];
    var dataBgColor = [];
    var dataBorderColor = [];
    var dataHoverColor = [];
    for (var i = 0; i < data.length; i++) {  
      if (i===limitDefault)break
      dataValues.push(data[i].count)
      dataBgColor.push(backgroundColor[i])
      dataBorderColor.push(borderColor[i])
      dataHoverColor.push(backgroundColor[i])
    }
    return {datasets: [
      {
        data: dataValues,
        backgroundColor: dataBgColor,
        borderColor: dataBorderColor,
        hoverBackgroundColor: dataHoverColor,
        borderWidth: 1
      },
    ]};
  }

  const barDataConstructor = (data, limit) => {
    var limitDefault = !!limit ? limit : 3;
    var dataValues = [];
    var dataBgColor = [];
    var dataBorderColor = [];
    var dataHoverColor = [];
    var dataLabels = [];
    let labelsCons = '';
    for (var i = 0; i < data.length; i++) {  
      if (i===limitDefault)break
        if (!!data[i].gender) {
          labelsCons = data[i].gender
        } else if (!!data[i].age) { 
          labelsCons = data[i].age
        } else if (!!data[i].state) { 
          labelsCons = data[i].state
        }
      dataValues.push(data[i].count)
      dataBgColor.push(backgroundColor[i])
      dataBorderColor.push(borderColor[i])
      dataHoverColor.push(backgroundColor[i])
      dataLabels.push(labelsCons);
    }
    return {
      labels: dataLabels,
      datasets: [
                {
                  label: 'Entries',
                  data: dataValues,
                  backgroundColor: dataBgColor,
                  borderColor: dataBorderColor,
                  hoverBackgroundColor: dataHoverColor,
                  borderWidth: 1
                },
              ]
    };
  }

  export const data_sex_entries = {
    labels : ['12 Entries', '1 Entries', '2 Entries'],
    datasets: [
      {
        label: 'Sex',
        data: [12, 1, 2],
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
const getAgeRange = (age) => {
    return ageGroups.find(e => {
        let s = e.split('-');
        return age >= s[0] && age <= s[1];
    })
}

let ageGroups = ['21-30', '31-40', '41-50', '51-60', '60-100'];

const getAgeGroup = (data) => {
  let m = data.sort((a,b) => b.age - a.age).reduce((a,b) => {
    let r = getAgeRange(b.age);
    return a.set(r, a.has(r) ? a.get(r).concat(b) : [b])
  }, new Map());
  let data_filtered = Array.from(m, ([age, count]) => ({ age, count }));
  for (var i = 0; i < data_filtered.length; i++) {
    let countAge = 0
    for (var c = 0; c < data_filtered[i].count.length; c++) {
      countAge += Number(data_filtered[i].count[c].count)
    }
    data_filtered[i].count = countAge
    if (data_filtered[i].age===undefined) {
      data_filtered[i].age = 'Undefined';
    } else if(data_filtered[i].age==='60-100') {
      data_filtered[i].age = '60+';
    } 
  }
  return data_filtered;
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
  'rgba(44, 99, 66, 1)',
  'rgba(169, 201, 182, 0.57)',
  'rgba(253, 204, 30, 1)',
  'rgba(245, 158, 11, 1)',
  'rgba(176, 138, 4, 255)',
]
var borderColor = [
  'rgba(34, 64, 47, 1)',
  'rgba(44, 99, 66, 1)',
  'rgba(169, 201, 182, 0.57)',
  'rgba(253, 204, 30, 1)',
  'rgba(245, 158, 11, 1)',
  'rgba(176, 138, 4, 255)',
]
const ProfileGraphServices = ({chartName, data}) => { 
    switch (chartName) {
        case "data_sex":
            return <Doughnut id="data_sex" data={doughnutDataConstructor(data, 4)}/>;
        case "data_sex_entries":
            return <Bar id="data_sex_entries" options={options} data={barDataConstructor(data, 4)} />;
        case "data_age":
            return <Doughnut id="data_age" data={doughnutDataConstructor(getAgeGroup(data), 6)}/>;
        case "data_age_entries":
            return <Bar id="data_age_entries" data={barDataConstructor(getAgeGroup(data), 6)}/>;
        case "data_locations":
            return <Doughnut id="data_locations" data={doughnutDataConstructor(data, 6)}/>;
        case "data_location_entries":
            return <Bar id="data_location_entries" options={options} data={barDataConstructor(data, 6)} />;
        case "data_purpose":
            return <Bar id="data_purpose" options={options} data={barDataConstructor(data, 3)} />;
        case "data_weekly":
            return <Doughnut id="data_weekly" data={data_weekly}/>;
        case "data_weekly_entries":
            return <Bar id="data_weekly_entries" options={weekly_options} data={data_weekly_entries} />;
        default:
            return <Doughnut id="data_sex" data={doughnutDataConstructor(data, 4)}/>;
    }

  }

  export default ProfileGraphServices;