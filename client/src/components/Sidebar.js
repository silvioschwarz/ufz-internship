import React from "react";
import BeatLoader from "react-spinners/BeatLoader";

export default function Sidebar(props) {
  const classElements = props.classes.map((item) => {
    // console.log(item)
    return (
      <option key={item} value={item}>
        {item}
      </option>
    );
  });

  const roadElements = props.roadTypes.map((item) => {
    // console.log(item);
    return (
      <div key={item}>
        <input
          type="checkbox"
          defaultChecked={true}
          value={item}
          onChange={props.roadSelectionHandler}
        />
        <span>{item}</span>
      </div>
    );
  });

  return (
    <div className="selection-div">
      {props.isRoadActive && !props.isRoadLoaded && (
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
                      onChange={props.segmentationHandler}
                    />
                    {props.isSegmentationSelected ? (
                      <pre id="file-content"></pre>
                    ) : (
                      <p>Select File</p>
                    )}
                  </div>
                  <br />
                  <form onSubmit={props.handleEPSG}>
                    <label>
                      EPSG:
                      <input 
                      id="EPSG"
                      name="EPSG"
                      type="text" 
                      onChange={event => props.setEPSG(event.target.value)}
                      value={props.EPSG}
                      className="form-control" />
                    </label>
                    <input type="submit" /> 
                  </form>
                </div>
                {/* Segmentation Class Selection */}
                {props.isSegmentationSelected && (
                  <select
                    onChange={(event) => {
                      props.setShowSegmentation(false);
                      props.setSegmentationClass(event.target.value);
                      setTimeout(function () {
                        props.setShowSegmentation(true);
                      }, 500);
                    }}
                    defaultValue={"maxClass"}
                    id="Classes"
                    name="Classes"
                  >
                    <option value="maxClass">max Class</option>
                    <option disabled>_________</option>
                    {classElements}
                  </select>
                )}
                {/* Show Segmentation */}
                <input
                  type="checkbox"
                  checked={props.showSegmentation}
                  onChange={(event) =>
                    props.setShowSegmentation(event.target.checked)
                  }
                />{" "}
                Show Segmentation
                {/* show top points */}
                {props.isSegmentationSelected && (
                  <label>
                    <input
                      type="checkbox"
                      checked={props.showTopPoints}
                      onChange={(event) =>
                        props.setShowTopPoints(event.target.checked)
                      }
                    />{" "}
                    Show Top Points
                  </label>
                )}
                {/* <input
                  type="checkbox"
                  checked={props.showRoadNetwork}
                  onChange={(event) =>
                    props.setShowRoadNetwork(event.target.checked)
                  }
                />{" "}
                show GeoJSON */}
              </fieldset>
            </div>
          </div>

          {/* ROAD NETWORK */}

          <div className="tab-pane container fade" id="roadNetwork">
            <fieldset>
              <legend>Input Road network</legend>
              <div className="flexx-row">
                <fieldset style={{ display: "inline" }}>
                  <input
                    type="radio"
                    value="default"
                    name="roadNetwork"
                    checked={props.useOSMRoadNetwork === true}
                    onChange={props.roadNetworkHandler}
                  />{" "}
                  use default
                  <br />
                  <input
                    type="radio"
                    value="custom"
                    name="roadNetwork"
                    checked={props.useOSMRoadNetwork === false}
                    onChange={props.roadNetworkHandler}
                  />{" "}
                  use own road network
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
              <div className="flexx-row">
                <div>
                  <input
                    id="LoadRoadNetwork"
                    type="checkbox"
                    checked={props.loadRoadNetwork}
                    onChange={(event) =>
                      props.setLoadRoadNetwork(event.target.checked)
                    }
                  />{" "}
                  <label htmlFor="LoadRoadNetwork">Load Road Network</label>
                </div>
                <div>
                  <input
                    id="showRoadNetwork"
                    type="checkbox"
                    checked={props.showRoadNetwork}
                    onChange={(event) =>
                      props.setShowRoadNetwork(event.target.checked)
                    }
                  />{" "}
                  <label htmlFor="showRoadNetwork">Show Road Network</label>
                </div>
              </div>

              {/* Select Road Type */}
              {props.isRoadLoaded && (
                <fieldset className="roadTypes">
                  <legend>Select Roads to show</legend>
                  <div className="roadElements">{roadElements}</div>
                </fieldset>
              )}
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
