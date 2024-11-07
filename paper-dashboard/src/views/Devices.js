import React from "react";

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
                <Button color="success" >
                  Turn On
                </Button>
                <Button color="danger"  className="ml-2">
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
