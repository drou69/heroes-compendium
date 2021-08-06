import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { Pact, Matchers } from '@pact-foundation/pact';
import { HeroService } from './hero.service';
import { Hero } from './hero';
import * as path from 'path';

describe('HeroServicePact', () => {
  var provider = new Pact({
    cors: true,
    spec: 1,
    port: 8080,
    host: 'localhost',
    consumer: 'heroes-compendium',
    provider: 'heroes',
    logLevel: 'info',
    log: path.resolve(process.cwd(), 'pact', 'logs', 'mockserver-integration.log'),
    dir: path.resolve(process.cwd(), 'pacts'),
  });

  // Setup Pact mock server for this service
  beforeAll(async () => {
    await provider.setup();
  });

  // Configure Angular Testbed for this service
  beforeEach(async ()=> {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ],
      providers: [
        HeroService
      ]
    })
  });

  // Verify mock service
  afterEach(async () => {
    await provider.verify();
  });

  // Create contract
  afterAll(async () => {
    await provider.finalize();
  });

  describe('get heroes', () => {
    const expectedHeroes: Hero[] = [{   
        id:1,
        name:'Superman',
      },{   
        id:2,
        name:'Batman',
      },{   
        id:3,
        name:'Ironman',
      }, 
    ];

    beforeAll(async () => {
      await provider.addInteraction({
        state: 'heroes exist',
        uponReceiving: 'a request to get all the heroes',
        withRequest: {
          method:'GET',
          path:'/heroes'
        },
        willRespondWith: {
          status:200,
          body: Matchers.somethingLike(expectedHeroes)
        }
      });
    });

    it('should get heroes', async() => {
      const heroService = TestBed.inject(HeroService);

      await heroService.getHeroes().toPromise().then(response => {
        expect(response).toEqual(expectedHeroes);
      });
    })
  })
});