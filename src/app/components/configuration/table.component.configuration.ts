export enum PropertyType {
  Text = 'Text',
  Number = 'Number',
  DateTime = 'DateTime',
  Boolean = 'Boolean',
}

export class TableConfiguration {
  constructor(public prefix: string,
              public properties: TableConfigurationProperty[],
              public action: any)
  {}
}

export class TableConfigurationProperty {
  constructor(public name: string,
              public suffix: string,
              public type: PropertyType)
  {}
}

export class TableItem {
  constructor(public data: any) {}
}
