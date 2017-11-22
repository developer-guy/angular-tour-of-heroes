import {Injectable} from '@angular/core';
import {Hero} from "./hero";
import {of} from "rxjs/observable/of";
import {Observable} from "rxjs/Observable";
import {MessageService} from "./message.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../environments/environment";
import {catchError, tap} from "rxjs/operators";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class HeroService {


  constructor(private httpClient: HttpClient,
              private messageService: MessageService) {
  }


  getHeroes(): Observable<Hero[]> {
    this.messageService.add('Heroservice: fetched heroes');
    return this.httpClient.get<Hero[]>(environment.apiUrl).pipe(
      tap(heroes => this.log(`fetched heroes`)),
      catchError(this.handleError('getHeroes', []))
    )
  }

  getHero(id: number): Observable<Hero> {
    const url = `${environment.apiUrl}/${id}`;
    this.messageService.add(`HeroService: fetched hero id ${id}`);
    return this.httpClient.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    )
  }

  updateHero(hero: Hero): Observable<any> {
    return this.httpClient.put(environment.apiUrl, hero, httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }


  addHero(hero: Hero): Observable<Hero> {
    return this.httpClient.post(environment.apiUrl, hero, httpOptions).pipe(
      tap((hero: Hero) => this.log(`added hero id=${hero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    )
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    }
  }


  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add('HeroService: ' + message);
  }

  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${environment.apiUrl}/${id}`;

    return this.httpClient.delete(url, httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }


  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return of([]);
    }
    const searchUrl = `${environment.apiUrl}?name=${term}`;
    return this.httpClient.get(searchUrl).pipe(
      tap(_ => this.log(`found heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    )
  }
}
