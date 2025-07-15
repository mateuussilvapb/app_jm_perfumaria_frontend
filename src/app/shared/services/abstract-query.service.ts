//Angular
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

//Internos
import { environment } from 'environments/environment';

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

  find = (filters?: URLSearchParams): Observable<T[]> => {
    let params = filters ? `?${filters.toString()}` : '';
    return this.http.get<T[]>(`${this.baseURL}/query${params}`);
  }

  findOne = (id: string): Observable<T> =>
    this.http.get<T>(`${this.baseURL}/query/${id}`,);
}
