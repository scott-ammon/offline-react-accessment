// This is hardcoded to accept tableData in one format (name and location),
// but I extracted this to demonstrate that we'd typically provide a more generic
// component that could render an arbitrary number of columns with different headers.
// This generalized component could also handle overflow/scrolling and virtualization
export const DataTable = ({ tableData }) => {
  return (
    <div className="dataTable">
      <div className="tableHeader">
        <p className="nameItem">Name</p>
        <p className="locationItem">Location</p>
      </div>

      {tableData.map((row, i) => {
        const stripeRowClass = i % 2 === 0 ? "stripe" : "";
        return (
          <div key={`${row.name}-${i}`} className={`tableRow ${stripeRowClass}`}>
            <p className="nameItem">{row.name}</p>
            <p className="locationItem">{row.location}</p>
          </div>
        );
      })}
    </div>
  );
};
