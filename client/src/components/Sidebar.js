import React from "react";
import BeatLoader from "react-spinners/BeatLoader";

export default function Sidebar(props) {

  return (
    <div className="selection-div">
      {!props.loaded && (
        <div className="loading-div">
          <BeatLoader />
        </div>
      )}

      <aside>
        <ul className="nav nav-tabs">
          <li className="nav-item" id="tab-segmentation">
            <a
              className="nav-link active"
              data-bs-toggle="tab"
              href="#segmentation"
            >
              Segmentation
            </a>
          </li>
          <li className="nav-item" id="tab-roadnetwork">
            <a className="nav-link" data-bs-toggle="tab" href="#roadNetwork">
              Road Network
            </a>
          </li>
          <li className="nav-item" id="tab-route">
            <a className="nav-link" data-bs-toggle="tab" href="#route">
              Calculate Route
            </a>
          </li>
          <li className="nav-item" id="tab-export">
            <a className="nav-link" data-bs-toggle="tab" href="#export">
              Export
            </a>
          </li>
        </ul>
         Tab Contents 
        <div className="tab-content">
          <div className="tab-pane container active" id="segmentation">
            <div className="aside-child">
              <fieldset>
                <legend>Input Segmentation</legend>

                <div className="">
                  <div className="mb-0">
                    <input
                      className="form-control form-control-sm"
                      type="file"
                      name="segfile"
                      id="segFile"
                      onChange={props.changeHandler}
                    />
                    {!props.selected ? (
                      <pre id="file-content"></pre>
                    ) : (
                      <p>Select File</p>
                    )}
                  </div>
                  <br />
                   <select id="EPSG" name="EPSG">
                    <option>Select EPSG</option>
                    <option disabled>_________</option>
                    <option>4326</option>
                    <option>35644764</option>
                    <option>4</option>
                    <option>4446</option>
                  </select>
                </div>
                <input
                  type="checkbox"
                  checked={props.showSegmentation}
                  onChange={(event) =>
                    props.setShowSegmentation(event.target.checked)
                  }
                />{" "}
                Show Segmentation 
              </fieldset>
            </div>
          </div>

          <div className="aside-child tab-pane container fade" id="roadNetwork">
            <fieldset>
              <legend>Input Road network</legend>
              <div className="flexx-row">
                <fieldset style={{ display: "inline" }}>
                  <input type="radio" name="roadNetwork" /> use default
                  <br />
                  <input type="radio" name="roadNetwork" /> use own road network
                </fieldset>
                <br />
                <div className="mb-0 w-50">
                  <label htmlFor="formFile" className="form-label">
                    Own road Network
                  </label>
                  <input
                    className="form-control form-control-sm"
                    type="file"
                    id="formFile"
                  />
                </div>
              </div>
              <input
                type="checkbox"
                checked={props.showLayer1}
                onChange={(event) => props.setShowLayer1(event.target.checked)}
              />{" "}
              Show Road Network
              <fieldset className="roadTypes">
                <legend>Select Roads to show</legend>
                 {/* <input
                  type="checkbox"
                  id="motorway"
                  name="motorway"
                  value="motorway"
                  checked={motorway}
                  onChange={handleRoadTypes}
                />
                <label htmlFor="motorway"> motorway</label>
                <br />
                <input
                  type="checkbox"
                  id="trunk"
                  name="trunk"
                  value="trunk"
                  checked={trunk}
                  onChange={handleRoadTypes}
                />
                <label htmlFor="trunk"> trunk</label>
                <br />
                <input
                  type="checkbox"
                  id="primary"
                  name="primary"
                  value="primary"
                  checked={primary}
                  onChange={handleRoadTypes}
                /> 
                <label htmlFor="primary"> primary</label> */}
              </fieldset>
            </fieldset>
          </div>

          <div className="aside-child tab-pane container fade" id="route">
            <fieldset>
              <legend>Find Optimal Route</legend>
              <div className="flexx-row">
                <fieldset className="w-75" style={{ display: "inline" }}>
                  <input type="radio" name="criteria1" /> Best points
                  <br />
                  <input type="radio" name="criteria1" /> Best road segments
                </fieldset>
                <div>
                  Length of Segment (km): <br></br>
                  <input className="w-75" type="number" />
                </div>
              </div>
              <div className="flexx-row">
                <fieldset className="w-50" style={{ display: "inline" }}>
                  <input type="radio" name="criteria2" /> Find a loop
                  <br />
                  <input type="radio" name="criteria2" /> Define Start/End
                </fieldset>
                <div className="w-50">
                  Start coordinates:
                  <br />{" "}
                  <input
                    className="w-50"
                    type="number"
                    placeholder="Easting"
                  ></input>
                  <input
                    className="w-50"
                    type="number"
                    placeholder="Northing"
                  ></input>{" "}
                  <br />
                  End coordinates:
                  <br />{" "}
                  <input
                    className="w-50"
                    type="number"
                    placeholder="Easting"
                  ></input>
                  <input
                    className="w-50"
                    type="number"
                    placeholder="Northing"
                  ></input>
                </div>
              </div>
              Desired route length (km):
              <br /> <input className="w-50" type="number"></input>
              <button className="m-1">Start calc</button>
            </fieldset>
          </div>

          <div className="aside-child tab-pane container fade" id="export">
            <fieldset>
              <legend>Export</legend>
              <button className="m-2" type="button">
                Save Route
              </button>
              <button className="m-2" type="button">
                Save Image
              </button>
            </fieldset>
          </div>
        </div>
      </aside>
    </div>
  );
}

// Tabs
