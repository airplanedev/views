// To escape CSV strings that might contain commas, we need to surround them by quotes,
// e.g. `"abc,def",ghi`. So we always surround by quotes for simplicity.
//
// When we surround by quotes, we also need to convert quotes into double-quotes, e.g.
// `abc"def,ghi` => `"abc""def","ghi"` are equivalent CSV strings.
function arrayToCSVRow<TData>(array: Array<TData>): string {
  return array
    .map((datum) => '"' + (datum?.toString().replace(/"/g, '""') ?? "") + '"')
    .join(",");
}

export function dataToCSVLink<TData>(
  columns: string[],
  data: Array<Array<TData>>,
): string {
  const columnRows = arrayToCSVRow(columns);
  const dataRows = data.map((row) => arrayToCSVRow(row));
  return (
    "data:text/csv;charset=utf-8," +
    encodeURIComponent([columnRows, ...dataRows].join("\n"))
  );
}
