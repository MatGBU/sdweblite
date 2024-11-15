/*!

=========================================================
* Paper Dashboard React - v1.3.2
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/main/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import React, { useState, useEffect } from "react";
// react plugin used to create charts
import { Line } from "react-chartjs-2";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Row,
  Col,
} from "reactstrap";

// core components
import { predictiongraph } from "/Users/mateuszgorczak/Documents/GitHub/Senior-project/paper-dashboard/src/variables/charts.js";

// Initialize the chart when the page is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  predictiongraph();
});

function Dashboard() {
  const [chartData, setChartData] = useState({
    labels: [], // Initialize with an empty labels array
    datasets: [
      {
        label: 'Loading...',
        data: [], // Empty data array for initial render
        borderColor: '#6bd098',
        backgroundColor: 'rgba(107, 208, 152, 0.2)',
        fill: true,
      },
    ],
  });

  // Use useEffect to set chart data when the component mounts
  useEffect(() => {
    async function loadChartData() {
      console.log("Fetching chart data...");
      if (predictiongraph && predictiongraph.data) {
        console.log("Data loaded:", predictiongraph.data);
        setChartData(predictiongraph.data); // Set the chart data state
      } else {
        console.log("No data available in predictiongraph.");
      }
    }

    loadChartData();
  }, []);

  console.log("Rendering chart with data:", chartData);
  
  return (
    <>
      <div className="content">
        <Row>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-globe text-warning" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Power Usage</p>
                      <CardTitle tag="p">150kW</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="fas fa-sync-alt" /> Update Now
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-money-coins text-success" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Money Saved</p>
                      <CardTitle tag="p">$ 14</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="far fa-calendar" /> Last Month
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-vector text-danger" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Sources of Energy</p>
                      <CardTitle tag="p">5</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="far fa-clock" /> In the last day
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-favourite-28 text-primary" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category">Cleanest Generation</p>
                      <CardTitle tag="p">In 3 hours</CardTitle>
                      <p />
                    </div>
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="fas fa-sync-alt" /> Update now
                </div>
              </CardFooter>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h5">Generation Prediction</CardTitle>
                <p className="card-category">24 Hours Forecast</p>
              </CardHeader>
              <CardBody>
              {chartData.labels && chartData.labels.length > 0 ? (
                  <Line
                    id="myChart"
                    data={chartData} // Render chart with loaded data
                    options={predictiongraph.options}
                    width={400}
                    height={100}
                  />
                ) : (
                  <p>Loading chart data...</p>
                )}
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="fa fa-history" /> Updated 3 minutes ago
                </div>
              </CardFooter>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="4">
            <Card>
              <CardHeader>
                <CardTitle tag="h5">Generation Breakdown</CardTitle>
                <p className="card-category">Last Month's Performance</p>
              </CardHeader>
              <CardBody style={{ height: "266px" }}>
               
              </CardBody> 
              <CardFooter>
                <div className="legend">
                  <i className="fa fa-circle text-primary" /> Hydro{" "}
                  <i className="fa fa-circle text-warning" /> Solar{" "}
                  <i className="fa fa-circle text-danger" /> Wind{" "}
                  <i className="fa fa-circle text-gray" /> Coal
                </div>
                <hr />
                <div className="stats">
                  <i className="fa fa-calendar" /> TEST
                </div>
              </CardFooter>
            </Card>
          </Col>
          <Col md="8">
            <Card className="card-chart">
              <CardHeader>
                <CardTitle tag="h5">Yearly Generation</CardTitle>
                <p className="card-category">Per Month</p>
              </CardHeader>
              <CardBody>
              
              </CardBody>
              <CardFooter>
                <div className="chart-legend">
                  <i className="fa fa-circle text-info" /> Hydro{" "}
                  <i className="fa fa-circle text-warning" /> Solar
                </div>
                <hr />
                <div className="card-stats">
                  <i className="fa fa-check" /> Data information certified
                </div>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Dashboard;
