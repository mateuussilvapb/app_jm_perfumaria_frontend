import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { CategoriaQueryService } from './categoria-query.service';
import { STATUS } from '@shared/enums/status.enum';
import { CategoriaUpdateDTO } from '@categoria/interfaces/categoria-update-dto';

describe('CategoriaQueryService (modern HTTP providers)', () => {
  let service: CategoriaQueryService;
  let httpMock: HttpTestingController;

  const mockCategorias: CategoriaUpdateDTO[] = [
    {
      id: '1',
      nome: 'Linha Bebê',
      descricao:
        'Fragrâncias hipoalergênicas e suaves, formuladas especialmente para a pele sensível de bebês.',
      status: STATUS.ATIVO,
    },
    {
      id: '2',
      nome: 'Linha Juvenil',
      descricao:
        'Aromas divertidos e modernos, pensados para crianças e pré-adolescentes.',
      status: STATUS.ATIVO,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      // IMPORTANT: provideHttpClient() must come before provideHttpClientTesting()
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        CategoriaQueryService,
      ],
    });

    service = TestBed.inject(CategoriaQueryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // ensure no outstanding requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('all() should perform GET and return categories', () => {
    let result: CategoriaUpdateDTO[] | undefined;

    service.all().subscribe((data) => {
      result = data.map((categoria: any) => ({
        ...categoria,
        id: String(categoria.id),
      }));
    });

    const req = httpMock.expectOne((r) => r.method === 'GET');
    expect(req.request.method).toBe('GET');

    req.flush(mockCategorias);

    expect(result).toEqual(mockCategorias);
  });

  it('all() should handle HTTP error', () => {
    let errorResponse: any;
    service.all().subscribe({
      next: () => fail('expected an error, not categories'),
      error: (err) => (errorResponse = err),
    });

    const req = httpMock.expectOne((r) => r.method === 'GET');
    req.flush(
      { message: 'Server error' },
      { status: 500, statusText: 'Server Error' }
    );

    expect(errorResponse).toBeTruthy();
  });
});
