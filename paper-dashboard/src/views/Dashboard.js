import React, { useState, useEffect } from "react";
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
        label: "Loading...",
        data: [], // Empty data array for initial render
        borderColor: "#6bd098",
        backgroundColor: "rgba(107, 208, 152, 0.2)",
        fill: true,
      },
    ],
  });

  useEffect(() => {
    async function loadChartData() {
      try {
        // Fetch the CSV file
        const response = await fetch("http://localhost:8080/energy_predictions.csv"); //change later when deployed using AWS, currently runnning a local server for testing
        const csvText = await response.text();

        // Parse the CSV file
        const rows = csvText.split("\n").map((row) => row.split(","));
        const labels = rows.slice(1).map((row) => row[0]); // First column as labels (e.g., time)
        const hydroData = rows.slice(1).map((row) => parseFloat(row[1])); // Second column for hydro data
        const nuclearData = rows.slice(1).map((row) => parseFloat(row[2])); 
        const windData = rows.slice(1).map((row) => parseFloat(row[3]));
        const solarData = rows.slice(1).map((row) => parseFloat(row[4])); 
        // Update chart data
        setChartData({
          labels: labels,
          datasets: [

            {
              label: "Hydro",
              borderColor: "#6bd098",
              backgroundColor: "#6bd098",
              pointRadius: 1,
              pointHoverRadius: 4,
              borderWidth: 3,
              tension: 0.4,
              fill: false,
              data: hydroData, // dynamic hydro data
            },
            {
              label: "Nuclear",
              borderColor: "#f17e5d",
              backgroundColor: "#f17e5d",
              pointRadius: 1,
              pointHoverRadius: 0,
              borderWidth: 3,
              tension: 0.4,
              fill: false,
              data: nuclearData, // dynamic nuclear data
            },
            {
              label: "Wind",
              borderColor: "#fcc468",
              backgroundColor: "#fcc468",
              pointRadius: 1,
              pointHoverRadius: 0,
              borderWidth: 3,
              tension: 0.4,
              fill: false,
              data: windData, // dynamic wind data
            },
            {
              label: "Solar",
              borderColor: "#1f8ef1",
              backgroundColor: "#1f8ef1",
              pointRadius: 1,
              pointHoverRadius: 0,
              borderWidth: 3,
              tension: 0.4,
              fill: false,
              data: solarData, // dynamic solar data
            },
          ],
        });
      } catch (error) {
        console.error("Error loading CSV data:", error);
      }
    }

    loadChartData();
  }, []);

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
          <Card >
            <CardHeader>
             <CardTitle tag="h5">Generation Prediction</CardTitle>
                <p className="card-category">24 Hours Forecast (MW)</p>
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
                <i className="fa fa-history" /> Updated from CSV
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
                  <i className="fa fa-history" /> Updated from CSV
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

