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
  export const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      },
    }
  };

  const mainbarDataConstructor = (data) => {
    var activityDataValues = [];
    var dataLabels = [];
    for (var i = 0; i < data.activityDataSets.length; i++) {  
      activityDataValues.push(data.activityDataSets[i].entries)
      dataLabels.push(data.activityDataSets[i].monthyear)
    }
    var conditionsDataValues = [];
    for (var i = 0; i < data.conditionsDataSets.length; i++) {  
      conditionsDataValues.push(data.conditionsDataSets[i].entries)
      dataLabels.push(data.conditionsDataSets[i].monthyear)
    }
    var effectsDataValues = [];
    for (var i = 0; i < data.effectsDataSets.length; i++) {  
      effectsDataValues.push(data.effectsDataSets[i].entries)
      dataLabels.push(data.effectsDataSets[i].monthyear)
    }
    var symptomsDataValues = [];
    for (var i = 0; i < data.symptomsDataSets.length; i++) {  
      symptomsDataValues.push(data.symptomsDataSets[i].entries)
      dataLabels.push(data.symptomsDataSets[i].monthyear)
    }
    return {
      labels: [...new Set(dataLabels)],
      datasets: [
        {
          label: "Activities",
          data: activityDataValues,
          borderColor: 'rgba(34, 64, 47, 1)',
          backgroundColor: 'rgba(34, 64, 47, 1)',
        },
        {
          label: " Health Conditions",
          data: conditionsDataValues,
          borderColor: 'rgba(44, 99, 66, 1)',
          backgroundColor: 'rgba(44, 99, 66, 1)',
        },
        {
          label: "Effects",
          data: effectsDataValues,
          borderColor: 'rgba(169, 201, 182, 0.57)',
          backgroundColor: 'rgba(169, 201, 182, 0.57)',
        },
        {
          label: "Symptoms",
          data: symptomsDataValues,
          borderColor: 'rgba(104, 204, 143, 1)',
          backgroundColor: 'rgba(104, 204, 143, 1)',
        }
      ]
    };
  }
  const mainbarReasonsDataConstructor = (data) => {
    var dataLabels = [];
    var datasetsReasons = [];
    for (var i = 0; i < data.length; i++) {  
      var dataValues = [];
      for (var key in data[i].entriesByDate) {
        dataValues.push(data[i].entriesByDate[key].entries);
        var entriesByMonthYear = data[i].entriesByDate[key].monthyear
      }
      dataLabels.push(entriesByMonthYear)
      if (dataValues.length > 0) {
      datasetsReasons.push({
        label: data[i].name,
        data: dataValues,
        borderColor: backgroundColor[i],
        backgroundColor: backgroundColor[i],
      })
    }
    }
    return {
      labels: [...new Set(dataLabels)],
      datasets: datasetsReasons
    };
  }
  var colorDatas = [
    '/assets/images/icon10.png',
    '/assets/images/icon25.png',
    '/assets/images/icon16.png',
    '/assets/images/icon12.png',
    '/assets/images/icon11.png',
    '/assets/images/icon23.png',
    '/assets/images/icon20.png',
    '/assets/images/icon21.png',
    '/assets/images/icon22.png',
  ]
  var backgroundColor = [
    'rgba(34, 64, 47, 1)',
    'rgba(245, 158, 11, 1)',
    'rgba(253, 204, 30, 1)',
    'rgba(169, 201, 182, 0.57)',
    'rgba(44, 99, 66, 1)',
    'rgba(176, 138, 4, 1)',
    'rgba(104, 153, 124, 1)',
    'rgba(104, 204, 143, 1)',
  ]
  var borderColor = [
    'rgba(34, 64, 47, 1)',
    'rgba(245, 158, 11, 1)',
    'rgba(253, 204, 30, 1)',
    'rgba(169, 201, 182, 0.57)',
    'rgba(44, 99, 66, 1)',
    'rgba(176, 138, 4, 1)',
    'rgba(104, 153, 124, 1)',
    'rgba(104, 204, 143, 1)',
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

  const barDataReasonsConstructor = (data, limit, name) => {
    var dataValues = [];
    var dataBgColor = [];
    var dataBorderColor = [];
    var dataLabels = [];
    for (var i = 0; i < data.gender.length; i++) {  
      dataValues.push(data.gender[i].count)
      dataBgColor.push(backgroundColor[i])
      dataBorderColor.push(borderColor[i])
      dataLabels.push(data.gender[i].gender);
    }
      dataValues.push(0)
      dataBgColor.push(backgroundColor[2])
      dataBorderColor.push(borderColor[2])
      dataLabels.push('Non-Binary');
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

  const doughnutReasonsDataConstructor = (data, limit) => {
    var dataLabel = [];
    var dataValues = [];
    var dataBgColor = [];
    var dataBorderColor = [];
    for (var i = 0; i < data.gender.length; i++) {  
        dataLabel.push(data.gender[i].gender);
        dataValues.push(data.gender[i].count);
        dataBgColor.push(backgroundColor[i])
        dataBorderColor.push(borderColor[i])
    }
    dataValues.push(0)
      dataBgColor.push(backgroundColor[2])
      dataBorderColor.push(borderColor[2])
    return {datasets: [
      {
        data: dataValues,
        backgroundColor: dataBgColor,
        borderColor: dataBorderColor,
        borderWidth: 1
      },
    ]};
  };
  export const data_yoga_entries = {
    labels : ['Male', 'Female', 'Non-Binary'],
    datasets: [
      {
        label: 'Entries',
        data: [0, 3, 1],
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
      dataLabels.push(data[i].name);
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
const ObjectivesGraphServices = ({chartName, data, name}) => { 
    var topAces = !!name ? name : '';
    topAces = topAces.replace(/ +/g, "");
    switch (chartName) {
      case "topACES":
        return <>
          <div className="demopie_chart">
                  <div className="demopie_row">
                    <div className="demopie_title">
                      <h5>{name}</h5>
                    </div>

                    <div className="demopie_drop">
                    <a href="#" onClick={() => {saveCanvas(topAces)}}>
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
                        <Doughnut id='topAces' data={doughnutDataConstructor(data, 5)}/>
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
                        <Bar id={topAces} options={options} data={barDataConstructor(data, 5, name)}/>
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
        case "topReasons":
          return <>
            <div className="demopie_chart">
                    <div className="demopie_row">
                      <div className="demopie_title">
                        <h5>{name}</h5>
                      </div>

                      <div className="demopie_drop">
                      <a href="#" onClick={() => {saveCanvas(topAces)}}>
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
                          <Doughnut id='topAces' data={doughnutReasonsDataConstructor(data, 5)}/>
                        </div>

                        <div className="demograph_list">
                        <ul>
                        <li>
                          {" "}
                          <img
                            src="/assets/images/icon10.png"
                            alt=""
                          />{" "}
                          Male{" "}
                        </li>
                        <li>
                          {" "}
                          <img
                            src="/assets/images/icon25.png"
                            alt=""
                          />{" "}
                          Female{" "}
                        </li>
                        <li>
                          {" "}
                          <img
                            src="/assets/images/icon16.png"
                            alt=""
                          />{" "}
                          No-Binary{" "}
                        </li>
                          </ul>
                        </div>
                      </div>

                      <div className="demograph_chart_right">
                        <div className="progress_list">
                          <Bar id={topAces} options={options} data={barDataReasonsConstructor(data, 5, name)}/>
                        </div>

                        <div className="progressbtm_list">
                        <ul>
                        <li>
                {" "}
                <img
                  src="/assets/images/icon10.png"
                  alt=""
                />{" "}
                Male{" "}
              </li>
              <li>
                {" "}
                <img
                  src="/assets/images/icon25.png"
                  alt=""
                />{" "}
                Female{" "}
              </li>
              <li>
                {" "}
                <img
                  src="/assets/images/icon16.png"
                  alt=""
                />{" "}
                Non-Binary{" "}
              </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
          </>;
        case "main_graph":
          return <>
          <div className="entry_graph">
            <Bar id="main_graph" options={options_main} data={mainbarDataConstructor(data)} />
          </div>
          <div className="progressbtm_list">
            <ul>
              <li>
                {" "}
                <img
                  src="/assets/images/icon10.png"
                  alt=""
                />{" "}
                Activities{" "}
              </li>
              <li>
                {" "}
                <img
                  src="/assets/images/icon20.png"
                  alt=""
                />{" "}
                Health Conditions{" "}
              </li>
              <li>
                {" "}
                <img
                  src="/assets/images/icon12.png"
                  alt=""
                />{" "}
                Effects{" "}
              </li>
              <li>
                {" "}
                <img
                  src="/assets/images/icon21.png"
                  alt=""
                />{" "}
                Symptoms{" "}
              </li>
            </ul>
          </div>
          </>;
          case "main_reasons":
            return <>
            <div className="entry_graph">
              <Bar id="main_graph" options={options_main} data={mainbarReasonsDataConstructor(data)} />
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
            </>;
        default:
            return <Doughnut id="data_sex" data={data_sex}/>;
    }

  }

  export default ObjectivesGraphServices;