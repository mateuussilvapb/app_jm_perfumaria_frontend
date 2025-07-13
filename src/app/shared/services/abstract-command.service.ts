//Angular
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

//Internos
import { environment } from 'environments/environment';

export abstract class AbstractCommandService<T> {
  protected constructor(
    protected readonly http: HttpClient,
    protected readonly apiURL: string = environment.apiUrl
  ) {}

  protected abstract path(): string;

  protected get baseURL() {
    return `${this.apiURL}/${this.path()}`;
  }

  create = (body: any): Observable<T> => this.http.post<T>(`${this.baseURL}/command`, body);

  update = (id: string, body: any): Observable<T> =>
    this.http.put<T>(`${this.baseURL}/command/${id}`, body);

  delete = (id: string): Observable<T> =>
    this.http.delete<T>(`${this.baseURL}/command/${id}`);
}
