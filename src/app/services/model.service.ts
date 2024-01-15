import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModelService {
  
  http = inject(HttpClient)
  apiUrl = 'http://0.0.0.0:980'


  // MOCKOWY ENDPOINT - czeka na implementację od strony BE
  getAllJobs() {
    const response = {
      name: "abc",
      active: true,
    }

    let obs = new Observable((subscriber) => {
      setTimeout(()=>{
        subscriber.next(response);
        subscriber.complete();
      }, 1500);
    });
    return obs;
  }

  getJobResult(id: number) {
    const headers = new HttpHeaders()

    return this.http.get<any>(`${this.apiUrl + '/api/v1/wzw/classified/' + id}`,
      { headers }
    ).pipe(
      catchError((e: HttpErrorResponse) => {
        switch(e.status) {
          case 404: console.log('dupa')
        }
        return throwError(() => e)
      })
    )
  }

  getJobStatus() {
    const headers = new HttpHeaders()
    const params = new HttpParams()
      .set('identifier', '0')

    return this.http.get<any>(`${this.apiUrl + '/api/v1/wzw/status'}`,
      {
        headers,
        params
      }
    ).pipe(
      catchError((e: HttpErrorResponse) => {
        switch(e.status) {
          case 404: console.log('dupa')
        }
        return throwError(() => e)
      })
    )
  }

  scheduleAsyncJob() {
    const headers = new HttpHeaders()

    return this.http.post<number>(`${this.apiUrl + '/api/v1/wzw'}`,
      undefined,
      {
        headers,
        observe: 'response'
      }
    ).pipe(
      catchError((e: HttpErrorResponse) => {
        switch(e.status) {
          case 404: console.log('dupa')
        }
        return throwError(() => e)
      })
    )
  }
}
