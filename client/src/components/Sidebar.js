import React from "react";

export default function Sidebar(props) {
  return (
    <aside className="sidebar-container">
      <div>
        <input
          type="checkbox"
          checked={props.showLayer1}
          onChange={(event) => setShowLayer1(event.target.checked)}
        />{" "}
        Show Path 1
      </div>
    </aside>
  );
}
