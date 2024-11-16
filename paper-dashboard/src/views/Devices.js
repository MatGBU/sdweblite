import React from "react";
import axios from "axios"; // Import axios for making HTTP requests
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Button,
  Row,
  Col,
} from "reactstrap";

function Devices() {
  // Function to handle "Turn On" button click
  const handleTurnOn = () => {
    axios
      .get("http://127.0.0.1:8000/turn_on")  // FastAPI backend URL
      .then((response) => {
        console.log(response.data.status);  // Log the response message
      })
      .catch((error) => {
        console.error("There was an error turning on the device:", error);
      });
  };

  // Function to handle "Turn Off" button click
  const handleTurnOff = () => {
    axios
      .get("http://127.0.0.1:8000/turn_off")  // FastAPI backend URL
      .then((response) => {
        console.log(response.data.status);  // Log the response message
      })
      .catch((error) => {
        console.error("There was an error turning off the device:", error);
      });
  };

  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Kasa Smart Wi-Fi Power Strip</CardTitle>
              </CardHeader>
              <CardBody>
                <Button color="success" onClick={handleTurnOn}>
                  Turn On
                </Button>
                <Button color="danger" className="ml-2" onClick={handleTurnOff}>
                  Turn Off
                </Button>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Devices;
