export class AutocompleteDto {
  label: string;
  value: string;

  constructor(obj: any) {
    if (obj) {
      this.label = obj?.nome ?? '';
      this.value = obj?.id ?? '';
      Object.assign(this, obj);
    }
  }
}
