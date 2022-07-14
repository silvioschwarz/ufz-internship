import React from "react";

export default function FileUpload(props) {
  const [selectedFile, setSelectedFile] = React.useState();
  const [isFilePicked, setIsFilePicked] = React.useState(false);
  const [isSelected, setIsSelected] = React.useState(false);

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsSelected(true);

    // let content = await event.target.files[0].text()

    // console.log(content)
  };

  if (isSelected) {
    console.log(selectedFile.name)
    selectedFile.text().then((res) => {

        const data = csvToArray(res);
        console.log(data)
    });
  }

  function csvToArray(str, delimiter = "   ") {
    // slice from start of text to the first \n index
    // use split to create an array from string by delimiter
    const headers = str.trim().slice(0, str.indexOf("\n")).split(delimiter);
  
    // slice from \n index + 1 to the end of the text
    // use split to create an array of each csv value row
    const rows = str.trim().slice(str.indexOf("\n") + 1).split("\n   ");
  
    // Map the rows
    // split values from each row into an array
    // use headers.reduce to create an object
    // object properties derived from headers:values
    // the object passed as an element of the array
    const arr = rows.map(function (row) {
      const values = row.split(delimiter);
      const el = headers.reduce(function (object, header, index) {
        object[header] = values[index];
        return object;
      }, {});
      return el;
    });
  
    // return the array
    return arr;
  }

  return (
    <div className="mb-0">
      {/* <label htmlFor="formFile" className="form-label"></label> */}
      <input
        className="form-control form-control-sm"
        type="file"
        name={props.name}
        id={props.name}
        onChange={changeHandler}
      />
      {isSelected ? <pre id="file-content"></pre> : <p>Select File</p>}
    </div>
  );
}
