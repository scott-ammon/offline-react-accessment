import { useCallback, useEffect, useState } from "react";
import _debounce from "lodash/debounce";
import { getLocations, isNameValid } from "../mock-api/apis";
import { DataTable } from "./DataTable";

export const NameAndLocation = () => {
  const [locations, setLocations] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [inputName, setInputName] = useState("");
  const [inputLocation, setInputLocation] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    const populateLocations = async () => {
      // Since our mock api will not fail, this is a simple request - but in practice
      // we would add error handling here to indicate to the user that we were unable to
      // fetch locations, and potentially give a pending state
      const result = await getLocations();
      setLocations(result);
    };
    populateLocations();
  }, []);

  useEffect(() => {
    setInputLocation(locations[0]);
  }, [locations]);

  async function onNameChange(event) {
    // We could make this validation name styled differently to indicated to the
    // user that it's not an error, but leaving as a future styling improvement -
    // I wanted to include it here to make it clear when we are actually attempting to validate
    // a user's input.
    if (event.target.value) {
      setValidationMessage("validating name...");
    }
    setDisabled(true);
    // We are just doing a simple call for the name validation here to see if it's 'invalid name' or not,
    // but in the case of a real api, we could potentially cache validated names to further reduce calls
    const isValidName =
      (await isNameValid(event.target.value)) && event.target.value !== "";
    setDisabled(!isValidName);
    if (!isValidName && event.target.value !== "") {
      setValidationMessage("this name has already been taken");
    } else {
      setInputName(event.target.value);
      setValidationMessage("");
    }
  }

  // Debouncing the name validation to reduce network calls here,
  // I chose to set it to half a second which reduces calls but doesn't
  // make the user wait so long they wonder why they are not able to add a name.
  // One area to improve here would be to immediately render the 'validating name...' message
  // and disable the add button rather than including those changes in the debounced function.
  const debounceOnNameChange = useCallback(_debounce(onNameChange, 500), []);

  function onSelectChange(event) {
    setInputLocation(event.target.value);
  }

  function onClear() {
    setTableData([]);
  }

  function onAdd() {
    setTableData((prevState) => [
      ...prevState,
      { name: inputName, location: inputLocation },
    ]);
    // Note: I'm allowing the user to add duplicate entries without re-validating
    // In a real scenario, perhaps the api would not let you set the same name multiple times
    // for the same location, but in the case where duplicates are allowed I don't
    // want the user to wait for re-validation. Setting disabled to true below would change
    // that behavior.
    // setDisabled(true);
  }

  return (
    <section className="nameAndLocationContainer">
      <div>
        <div className="inputFieldWrapper">
          <label name="name">Name</label>
          <input
            type="text"
            htmlFor="name"
            className="name"
            onChange={debounceOnNameChange}
          ></input>
        </div>
        <p className="validationMessage">{validationMessage}</p>
        <div className="inputFieldWrapper">
          <label name="location">Location</label>
          <select
            name="location"
            htmlFor="location"
            className="location"
            onChange={onSelectChange}
          >
            {locations.map((location) => {
              return (
                <option key={location} value={location}>
                  {location}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <div className="buttonContainer">
        <button onClick={onClear}>Clear</button>
        <button onClick={onAdd} disabled={disabled} className="addButton">
          Add
        </button>
      </div>
      <DataTable tableData={tableData} />
    </section>
  );
};
