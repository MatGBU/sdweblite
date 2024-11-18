import React, { useState, useEffect } from "react";
import { Line, Pie } from "react-chartjs-2";
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
import { predictiongraph } from "../variables/charts.js";

function Dashboard() {
  const [lineChartData, setLineChartData] = useState({
    labels: [],
    datasets: [],
  });

  const [pieChartData, setPieChartData] = useState({
    labels: [],
    datasets: [],
  });

  const [monthlyGenerationData, setMonthlyGenerationData] = useState({
    labels: [],
    datasets: [],
  });

  // Fetch data for the Line Chart
  useEffect(() => {
    async function loadLineChartData() {
      try {
        const response = await fetch("http://localhost:8080/energy_predictions.csv");
        const csvText = await response.text();

        // Parse the CSV
        const rows = csvText.split("\n").map((row) => row.split(","));
        const headers = rows[0];
        const dataRows = rows.slice(1).filter((row) => row.length === headers.length);

        const labels = dataRows.map((row) => row[0]); // Dates as labels
        const hydroData = dataRows.map((row) => parseFloat(row[1]) || 0); // Hydro
        const nuclearData = dataRows.map((row) => parseFloat(row[2]) || 0); // Nuclear
        const windData = dataRows.map((row) => parseFloat(row[3]) || 0); // Wind
        const solarData = dataRows.map((row) => parseFloat(row[4]) || 0); // Solar

        setLineChartData({
          labels: labels,
          datasets: [
            {
              label: "Hydro",
              borderColor: "#6bd098",
              backgroundColor: "#6bd098",
              data: hydroData,
              fill: false,
              tension: 0.4,
              borderWidth: 3,
            },
            {
              label: "Nuclear",
              borderColor: "#f17e5d",
              backgroundColor: "#f17e5d",
              data: nuclearData,
              fill: false,
              tension: 0.4,
              borderWidth: 3,
            },
            {
              label: "Wind",
              borderColor: "#fcc468",
              backgroundColor: "#fcc468",
              data: windData,
              fill: false,
              tension: 0.4,
              borderWidth: 3,
            },
            {
              label: "Solar",
              borderColor: "#1f8ef1",
              backgroundColor: "#1f8ef1",
              data: solarData,
              fill: false,
              tension: 0.4,
              borderWidth: 3,
            },
          ],
        });
      } catch (error) {
        console.error("Error loading line chart data:", error);
      }
    }

    loadLineChartData();
  }, []);

  // Fetch data for the Pie Chart
  useEffect(() => {
    async function loadPieChartData() {
      try {
        const response = await fetch("http://127.0.0.1:8080/TwoYear_Training_Set_Copy.csv");
        const csvText = await response.text();

        // Parse the CSV
        const rows = csvText.split("\n").map((row) => row.split(","));
        const headers = rows[0];
        const dataRows = rows.slice(1).filter((row) => row.length === headers.length);

        const technologyLabels = headers.slice(1, 12); // First 6 technologies
        const technologyTotals = technologyLabels.map((tech, index) =>
          dataRows.reduce((sum, row) => sum + parseFloat(row[index + 1] || 0), 0)
        );

        setPieChartData({
          labels: technologyLabels,
          datasets: [
            {
              label: "Total Generation",
              data: technologyTotals,
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#8BC34A",
                "#FF5722",
                "#9C27B0",
              ],
            },
          ],
        });
      } catch (error) {
        console.error("Error loading pie chart data:", error);
      }
    }

    loadPieChartData();
  }, []);

// Fetch data for Monthly Generation Line Chart
useEffect(() => {
  async function loadMonthlyGenerationData() {
    try {
      const response = await fetch("http://127.0.0.1:8080/TwoYear_Training_Set_Copy.csv");
      const csvText = await response.text();

      // Parse CSV
      const rows = csvText.split("\n").map((row) => row.split(","));
      const headers = rows[0];
      const dataRows = rows.slice(1).filter((row) => row.length === headers.length);

      // Define months
      const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ];

      // Initialize data aggregation
      const generationByMonth = months.map(() => ({
        Coal: 0,
        Hydro: 0,
        "Natural Gas": 0,
        Nuclear: 0,
        Oil: 0,
        Other: 0,
      }));

      // Group and aggregate data by month
      dataRows.forEach((row) => {
        const [beginDate, ...generationValues] = row;
        const date = new Date(beginDate);
        const monthIndex = date.getMonth(); // 0-based index for months

        if (date.getFullYear() === new Date().getFullYear() - 1) {
          generationByMonth[monthIndex].Coal += parseFloat(generationValues[0]) || 0;
          generationByMonth[monthIndex].Hydro += parseFloat(generationValues[1]) || 0;
          generationByMonth[monthIndex]["Natural Gas"] += parseFloat(generationValues[2]) || 0;
          generationByMonth[monthIndex].Nuclear += parseFloat(generationValues[3]) || 0;
          generationByMonth[monthIndex].Oil += parseFloat(generationValues[4]) || 0;
          generationByMonth[monthIndex].Other += parseFloat(generationValues[5]) || 0;
        }
      });

      // Prepare data for the line chart
      setMonthlyGenerationData({
        labels: months, // x-axis (months)
        datasets: [
          {
            label: "Coal",
            data: generationByMonth.map((month) => month.Coal),
            borderColor: "#FF6384",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            fill: true,
            tension: 0.4,
          },
          {
            label: "Hydro",
            data: generationByMonth.map((month) => month.Hydro),
            borderColor: "#36A2EB",
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            fill: true,
            tension: 0.4,
          },
          {
            label: "Natural Gas",
            data: generationByMonth.map((month) => month["Natural Gas"]),
            borderColor: "#FFCE56",
            backgroundColor: "rgba(255, 206, 86, 0.2)",
            fill: true,
            tension: 0.4,
          },
          {
            label: "Nuclear",
            data: generationByMonth.map((month) => month.Nuclear),
            borderColor: "#8BC34A",
            backgroundColor: "rgba(139, 195, 74, 0.2)",
            fill: true,
            tension: 0.4,
          },
          {
            label: "Oil",
            data: generationByMonth.map((month) => month.Oil),
            borderColor: "#FF5722",
            backgroundColor: "rgba(255, 87, 34, 0.2)",
            fill: true,
            tension: 0.4,
          },
          {
            label: "Other",
            data: generationByMonth.map((month) => month.Other),
            borderColor: "#9C27B0",
            backgroundColor: "rgba(156, 39, 176, 0.2)",
            fill: true,
            tension: 0.4,
          },
        ],
      });
    } catch (error) {
      console.error("Error loading monthly generation data:", error);
    }
  }

  loadMonthlyGenerationData();
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
              {lineChartData.labels.length > 0 ? (
                <Line
                  id="lineChart"
                  data={lineChartData}
                  options={predictiongraph.options}
                  width={600}
                  length={100}
                />
              ) : (
                <p>Loading line chart data...</p>
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
                <p className="card-category">Last Year's Performance (MW)</p>
              </CardHeader>
              <CardBody style={{ height: "430px" }}>
              {pieChartData.labels.length > 0 ? (
                <Pie id="pieChart" data={pieChartData} />
              ) : (
                <p>Loading pie chart data...</p>
              )}
              </CardBody> 
              <CardFooter>
                <div className="stats">
                  <i i className="fa fa-history" /> Updated from CSV
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
              {monthlyGenerationData.labels.length > 0 ? (
                <Line id="monthlyLineChart" data={monthlyGenerationData} />
              ) : (
                <p>Loading monthly generation data...</p>
              )}
              </CardBody>
              <CardFooter>

                <hr />
                <div className="card-stats">
                  <i i className="fa fa-history" /> Updated from CSV
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

