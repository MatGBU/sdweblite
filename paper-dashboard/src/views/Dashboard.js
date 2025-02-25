import React, { useState, useEffect } from "react";
import { Line, Pie } from "react-chartjs-2";
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
import { predictiongraph } from "../variables/charts";

function Dashboard() {
  const [lineChartDataone, setLineChartDataone] = useState({
    labels: [],
    datasets: [],
  });

  const [pieChartData, setPieChartData] = useState({
    labels: [],
    datasets: [],
  });

  const [lineChartDatatwo, setLineChartDatatwo] = useState({
    labels: [],
    datasets: [],
  });

  // Fetch data for the first Line Chart
  useEffect(() => {
    async function loadLineChartDataone() {
      try {
        const response = await fetch("/data/energy_predictions.csv"); // Updated path
        const csvText = await response.text();

        // Parse the CSV
        const rows = csvText.split("\n").map((row) => row.split(","));
        const headers = rows[0];
        const dataRows = rows.slice(1).filter((row) => row.length === headers.length);

        const labels = dataRows.map((row) => row[0]); // Dates as labels
        const hydroData = dataRows.map((row) => parseFloat(row[1]) || 0);
        const nuclearData = dataRows.map((row) => parseFloat(row[2]) || 0);
        const windData = dataRows.map((row) => parseFloat(row[3]) || 0);
        const solarData = dataRows.map((row) => parseFloat(row[4]) || 0);

        setLineChartDataone({
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

    loadLineChartDataone();
  }, []);

  // Fetch data for the Pie Chart
  useEffect(() => {
    async function loadPieChartData() {
      try {
        const response = await fetch("/data/TwoYear_Training_Set_Copy.csv"); // Updated path
        const csvText = await response.text();

        // Parse the CSV
        const rows = csvText.split("\n").map((row) => row.split(","));
        const headers = rows[0];
        const dataRows = rows.slice(1).filter((row) => row.length === headers.length);

        const technologyLabels = headers.slice(1, 12);
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

  // Fetch data for the second Line Chart
  useEffect(() => {
    async function loadLineChartDatatwo() {
      try {
        const response = await fetch("/data/energy_predictions.csv"); // Updated path
        const csvText = await response.text();

        // Parse the CSV
        const rows = csvText.split("\n").map((row) => row.split(","));
        const headers = rows[0];
        const dataRows = rows.slice(1).filter((row) => row.length === headers.length);

        const labels = dataRows.map((row) => row[0]);
        const refuseData = dataRows.map((row) => parseFloat(row[5]) || 0);
        const woodData = dataRows.map((row) => parseFloat(row[6]) || 0);

        setLineChartDatatwo({
          labels: labels,
          datasets: [
            {
              label: "Refuse",
              borderColor: "#6bd098",
              backgroundColor: "#6bd098",
              data: refuseData,
              fill: false,
              tension: 0.4,
              borderWidth: 3,
            },
            {
              label: "Wood",
              borderColor: "#f17e5d",
              backgroundColor: "#f17e5d",
              data: woodData,
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

    loadLineChartDatatwo();
  }, []);

  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h5">Generation Prediction</CardTitle>
                <p className="card-category">24 Hours Forecast (MW)</p>
              </CardHeader>
              <CardBody>
                {lineChartDataone.labels.length > 0 ? (
                  <Line data={lineChartDataone} options={predictiongraph.options} />
                ) : (
                  <p>Loading line chart data...</p>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md="4">
            <Card>
              <CardHeader>
                <CardTitle tag="h5">Generation Breakdown</CardTitle>
              </CardHeader>
              <CardBody>
                {pieChartData.labels.length > 0 ? <Pie data={pieChartData} /> : <p>Loading pie chart data...</p>}
              </CardBody>
            </Card>
          </Col>
          <Col md="8">
            <Card>
              <CardHeader>
                <CardTitle tag="h5">Generation Prediction</CardTitle>
              </CardHeader>
              <CardBody>
                {lineChartDatatwo.labels.length > 0 ? <Line data={lineChartDatatwo} options={predictiongraph.options} /> : <p>Loading line chart data...</p>}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Dashboard;
