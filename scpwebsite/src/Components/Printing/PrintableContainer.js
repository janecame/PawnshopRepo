import React, { useState, useEffect } from "react";
import { Row, Col, Container, Form } from "react-bootstrap";
//import { FaPrint } from "react-icons/fa6";

export const PrintableContainer = ({ children, className, style, Orientation }) => {
  const [printSetup, setprintSetup] = useState({
    fontSize: "10px",
    intfontSize: 10,
    Orientation: "Portrait",
  });

  useEffect(() => {
    setprintSetup((prev) => ({ ...prev, style, Orientation:Orientation }));
  }, [style, Orientation]);

  const HandleChange = (e) => {
    const { name, value } = e.target;
    if (name === "intfontSize") {
      const newValue = value.replace(/[^0-9,.]/g, "");
      setprintSetup((prev) => ({
        ...prev,
        [name]: newValue,
        fontSize: newValue + "px",
      }));
    } else {
      setprintSetup((prev) => ({ ...prev, [name]: value }));
    }
  };

  function btnPrint() {
    window.print();
  }
  return (
    <>
      <div className="bg-light rounded shadow mt-2 mb-4">
        <Container>
          <Row className="bg-white rounded">
            <Col lg={8} xs={12}>
              <div className="d-flex align-items-center gap-2">
                <div className="d-flex align-items-center border border-2 border-dark rounded col-6 col-lg-2">
                  <Form.Select
                    size="sm"
                    name="Orientation"
                    value={printSetup.Orientation}
                    onChange={(e) => HandleChange(e)}
                  >
                    <option value={"Portrait"}>Portrait</option>
                    <option value={"Landscape"}>Landscape</option>
                    <option value={"C1HalfShort"}>C1-HalfShort</option>
                  </Form.Select>
                </div>
              </div>
            </Col>
            <Col lg={4} xs={12}>
              <div className="d-flex align-items-center justify-content-end gap-2">
                {/* <div class="form-check d-flex align-items-center gap-1">
                              <input className="form-check-input border-dark" type="checkbox" value="" id="isBordered"/>
                                  <label className="form-check-label" for="isBordered">
                                      Bordered?
                                  </label>
                          </div> */}
                <div className="d-flex align-items-center border pe-2 border-2 border-dark rounded col-2">
                  <input
                    type="text"
                    name="intfontSize"
                    className="w-100 text-center border-0 rounded"
                    value={printSetup.intfontSize}
                    onChange={(e) => HandleChange(e)}
                  />
                  <small>px</small>
                </div>
                <button
                  className="btn btn-sm btn-outline-dark rounded"
                  onClick={() => btnPrint()}
                >
                  {/*<FaPrint/>*/} print
                </button>
              </div>
            </Col>
          </Row>
        </Container>
        <Container className="overflow-x-auto p-2">
          <div
            className={`${className} ${
              printSetup.Orientation === "Portrait"
                ? "letter-paper"
                : printSetup.Orientation === "Landscape"
                ? "letter-paper-landscape"
                : printSetup.Orientation === "C1HalfShort"
                ? "letter-paper-C1halfshort"
                : ""
            }`}
            style={printSetup}
          >
            <div className={`printable-content`}>{children}</div>
          </div>
        </Container>
        <Container className="d-flex align-items-center justify-content-center rounded bg-white p-2" style={{fontSize:"10px"}}><b>@Zhybero</b></Container>
      </div>
    </>
  );
};