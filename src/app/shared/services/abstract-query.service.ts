//Angular
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

//Internos
import { environment } from 'environments/environment';
import { removeNullValues } from 'app/utils/extras/object.utils';

export abstract class AbstractQueryService<T> {
  protected constructor(
    protected readonly http: HttpClient,
    protected readonly apiURL: string = environment.apiUrl
  ) {}

  protected abstract path(): string;

  protected get baseURL() {
    return `${this.apiURL}/${this.path()}`;
  }

  byID = (id: string): Observable<T> =>
    this.http.get<T>(`${this.baseURL}/query/${id}`);

  all = (): Observable<T[]> => this.http.get<T[]>(`${this.baseURL}/query`);

  find = (params?: any): Observable<T[]> =>
    this.http.get<T[]>(`${this.baseURL}/query`, { params: removeNullValues(params) });

  findOne = (params?: any): Observable<T> =>
    this.http.get<T>(`${this.baseURL}/query`, { params: removeNullValues(params) });
}
