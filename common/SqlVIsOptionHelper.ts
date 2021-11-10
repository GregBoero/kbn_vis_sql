export class SqlVIsType {
  constructor(public value: string, public text: string) {}
}

export const DATATABLE_TYPE = new SqlVIsType('datatable', 'DataTables');
export const METRIC_TYPE = new SqlVIsType('metric', 'Metric');

/**
 *  Easy way of getting the available vis type that we can use in this vis
 *
 */
export function getAvailableVisType(): SqlVIsType[] {
  return [
    DATATABLE_TYPE,
    // METRIC_TYPE,
  ];
}
