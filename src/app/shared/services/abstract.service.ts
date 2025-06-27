//Angular
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

//Internos
import { environment } from 'environments/environment';
import { removeNullValues } from 'app/utils/extras/object.utils';

export abstract class AbstractService<T> {
  protected constructor(
    protected readonly http: HttpClient,
    protected readonly apiURL: string = environment.apiUrl
  ) {}

  protected abstract path(): string;

  protected get baseURL() {
    return `${this.apiURL}/${this.path()}`;
  }

  byID = (id: string): Observable<T> =>
    this.http.get<T>(`${this.baseURL}/${id}`);

  all = (): Observable<T[]> => this.http.get<T[]>(this.baseURL);

  find = (params?: any): Observable<T[]> =>
    this.http.get<T[]>(this.baseURL, { params: removeNullValues(params) });

  findOne = (params?: any): Observable<T> =>
    this.http.get<T>(this.baseURL, { params: removeNullValues(params) });

  create = (body: any): Observable<T> => this.http.post<T>(this.baseURL, body);

  update = (id: string, body: any): Observable<T> =>
    this.http.put<T>(`${this.baseURL}/${id}`, body);

  delete = (id: string): Observable<T> =>
    this.http.delete<T>(`${this.baseURL}/${id}`);
}
