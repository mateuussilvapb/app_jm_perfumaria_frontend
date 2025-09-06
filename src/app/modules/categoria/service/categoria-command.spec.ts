import { TestBed } from "@angular/core/testing";
import { provideHttpClient } from "@angular/common/http";
import {
  provideHttpClientTesting,
  HttpTestingController,
} from "@angular/common/http/testing";
import { CategoriaCommandService } from "./categoria-command.service";
import { CategoriaUpdateDTO } from "@categoria/interfaces/categoria-update-dto";
import { STATUS } from "@shared/enums/status.enum";

describe("CategoriaCommandService", () => {
  let service: CategoriaCommandService;
  let httpMock: HttpTestingController;
  const baseUrl = "/categorias/command";

  // example payloads (you gave similar JSONs earlier)
  const novaCategoria: CategoriaUpdateDTO = {
    id: "101",
    nome: "Linha Infantil",
    descricao: "Fragrâncias suaves e seguras, desenvolvidas especialmente para crianças e bebês.",
    status: STATUS.ATIVO,
  };

  const outraCategoria: CategoriaUpdateDTO = {
    id: "102",
    nome: "Linha Bebê",
    descricao: "Fragrâncias hipoalergênicas e suaves, formuladas especialmente para a pele sensível de bebês.",
    status: STATUS.ATIVO,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      // provideHttpClient() MUST come before provideHttpClientTesting()
      providers: [provideHttpClient(), provideHttpClientTesting(), CategoriaCommandService],
    });

    service = TestBed.inject(CategoriaCommandService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // ensure no outstanding requests
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("create() should POST and return created categoria", () => {
    let result: CategoriaUpdateDTO | undefined;
    const returned: CategoriaUpdateDTO = { ...novaCategoria, id: "101" };

    service.create(novaCategoria).subscribe((data) => {
      result = { ...data, id: String(data.id) };
    });

    const req = httpMock.expectOne((r) => r.url === baseUrl && r.method === "POST");
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual(novaCategoria);

    req.flush(returned);

    expect(result).toEqual(returned);
  });

  it("update() should PUT and return updated categoria", () => {
    let result: CategoriaUpdateDTO | undefined;
    const id = "101";
    const updates = { nome: "Linha Infantil Premium", status: STATUS.INATIVO };
    const returnedUpdated: CategoriaUpdateDTO = { id, ...novaCategoria, ...updates };

    service.update(id, updates).subscribe((data) => {
      result = { ...data, id: String(data.id) };
    });

    const req = httpMock.expectOne((r) => r.url === `${baseUrl}/${id}` && r.method === "PUT");
    expect(req.request.method).toBe("PUT");
    // body might be partial depending on implementation; assert accordingly
    expect(req.request.body).toEqual(updates);

    req.flush(returnedUpdated);

    expect(result).toEqual(returnedUpdated);
  });

  it("delete() should send DELETE and complete successfully", (done) => {
    const id = "101";
    // subscribe and mark done when complete
    service.delete(id).subscribe({
      next: (res) => {
        // many implementations return null/void — we accept any successful emission
        expect(res === null || res === undefined || !!res).toBeTruthy();
      },
      error: () => fail("should not error on successful delete"),
      complete: () => done(),
    });

    const req = httpMock.expectOne((r) => r.url === `${baseUrl}/${id}` && r.method === "DELETE");
    expect(req.request.method).toBe("DELETE");

    // simulate 204 No Content
    req.flush(null, { status: 204, statusText: "No Content" });
  });

  // optional: error propagation example for create()
  it("create() should propagate HTTP error", () => {
    let caughtError: any;
    service.create(outraCategoria).subscribe({
      next: () => fail("expected an error"),
      error: (err) => (caughtError = err),
    });

    const req = httpMock.expectOne((r) => r.url === baseUrl && r.method === "POST");
    req.flush({ message: "Bad Request" }, { status: 400, statusText: "Bad Request" });

    expect(caughtError).toBeTruthy();
  });
});
