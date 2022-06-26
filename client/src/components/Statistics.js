import React from "react";

export default function Statistics(props) {
  // console.log(props.data.features);

  const features = props.data.features;
  let distance = 0;
  let duration = 0;
  let moveDuration = 0;

  const featuresElements = features.map((feature) => {
    // console.log(feature.properties.distance);

    let timespan = feature.properties.timespan;
    let parsed = timespan.toString().split(",");
    const [begin, end] = parsed.map((item) => {
      return new Date(item.split('"')[3]);
    });
    // let begin = parsed[2];
    //  let end = parsed[4];
    let durationFeature = end - begin;
    // console.log([end])

    distance += parseFloat(feature.properties.distance);
    duration += parseFloat(durationFeature);

    if (feature.properties.distance !== "0") {
      moveDuration += parseFloat(durationFeature);

      return (
        <div className="statistics-element">
          <h3>{feature.properties.name}</h3>
          <ul>
            <li>Distance: {feature.properties.distance / 1000} km</li>
            <li>Duration: {(durationFeature / 1000 / 60).toFixed(2)} Min</li>
            <li>
              Speed:{" "}
              {(
                parseFloat(feature.properties.distance) /
                1000 /
                (durationFeature / 1000 / 3600).toFixed(2)
              ).toFixed(2)}{" "}
              km/h
            </li>
          </ul>
        </div>
      );
    }
  });

  // console.log({featuresElements})

  return (
    <div className="statistics-container">
      <div className="statistics-info">
      <h1>Statistics</h1>
      <h3>Distance: {(distance / 1000).toFixed(3)} km</h3>
      {/* <h3>Duration: {(duration/1000/3600).toFixed(2)} h</h3> */}
      <h3>Move Duration: {(moveDuration / 1000 / 3600).toFixed(2)} h</h3>
      <h3>
        Avg speed:{" "}
        {(
          (distance / 1000).toFixed(3) / (moveDuration / 1000 / 3600).toFixed(2)
        ).toFixed(2)}{" "}
        km/h
      </h3>
    </div>
    <h2>Stationen</h2>
    <div className="statistics-stations">
      {featuresElements}
    </div>
    </div>

  );
}
