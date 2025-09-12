import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { HttpException } from '@nestjs/common';
import { of, throwError } from 'rxjs';

import { CatsService } from './cats.service';
import { BreedQueryDto } from './dto/breed-query.dto';

/**
 * Pruebas unitarias para el servicio de gatos
 * Verifica el comportamiento de los métodos del servicio
 */
describe('CatsService', () => {
  let service: CatsService;
  let httpService: HttpService;
  let configService: ConfigService;

  const mockHttpService = {
    get: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatsService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<CatsService>(CatsService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);

    // Configurar valores por defecto
    mockConfigService.get.mockImplementation((key: string) => {
      const config = {
        THECAT_API_KEY: 'test-api-key',
        THECAT_API_BASE_URL: 'https://api.thecatapi.com/v1',
      };
      return config[key];
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getBreeds', () => {
    it('should get breeds successfully', async () => {
      const mockBreeds = [
        { id: 'beng', name: 'Bengal', description: 'A breed of cat' },
        { id: 'pers', name: 'Persian', description: 'A long-haired breed' },
      ];

      mockHttpService.get.mockReturnValue(of({ data: mockBreeds }));

      const result = await service.getBreeds();

      expect(mockHttpService.get).toHaveBeenCalledWith(
        'https://api.thecatapi.com/v1/breeds',
        {
          headers: {
            'x-api-key': 'test-api-key',
          },
        },
      );
      expect(result).toEqual(mockBreeds);
    });

    it('should get breeds with query parameters', async () => {
      const query: BreedQueryDto = {
        q: 'bengal',
        page: 1,
        limit: 10,
      };

      const mockBreeds = [{ id: 'beng', name: 'Bengal' }];
      mockHttpService.get.mockReturnValue(of({ data: mockBreeds }));

      const result = await service.getBreeds(query);

      expect(mockHttpService.get).toHaveBeenCalledWith(
        'https://api.thecatapi.com/v1/breeds?q=bengal&page=1&limit=10',
        {
          headers: {
            'x-api-key': 'test-api-key',
          },
        },
      );
      expect(result).toEqual(mockBreeds);
    });

    it('should throw HttpException on error', async () => {
      mockHttpService.get.mockReturnValue(throwError(() => new Error('API Error')));

      await expect(service.getBreeds()).rejects.toThrow(HttpException);
    });
  });

  describe('getBreedById', () => {
    it('should get breed by id successfully', async () => {
      const breedId = 'beng';
      const mockBreed = { id: 'beng', name: 'Bengal', description: 'A breed of cat' };

      mockHttpService.get.mockReturnValue(of({ data: mockBreed }));

      const result = await service.getBreedById(breedId);

      expect(mockHttpService.get).toHaveBeenCalledWith(
        `https://api.thecatapi.com/v1/breeds/${breedId}`,
        {
          headers: {
            'x-api-key': 'test-api-key',
          },
        },
      );
      expect(result).toEqual(mockBreed);
    });

    it('should throw HttpException for 404 error', async () => {
      const breedId = 'nonexistent';
      const error = {
        response: { status: 404 },
      };

      mockHttpService.get.mockReturnValue(throwError(() => error));

      await expect(service.getBreedById(breedId)).rejects.toThrow(HttpException);
    });
  });

  describe('searchBreeds', () => {
    it('should search breeds successfully', async () => {
      const searchTerm = 'bengal';
      const mockBreeds = [{ id: 'beng', name: 'Bengal' }];

      mockHttpService.get.mockReturnValue(of({ data: mockBreeds }));

      const result = await service.searchBreeds(searchTerm);

      expect(mockHttpService.get).toHaveBeenCalledWith(
        `https://api.thecatapi.com/v1/breeds/search?q=${encodeURIComponent(searchTerm)}`,
        {
          headers: {
            'x-api-key': 'test-api-key',
          },
        },
      );
      expect(result).toEqual(mockBreeds);
    });
  });
});
