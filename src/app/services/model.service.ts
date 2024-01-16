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
    const response = [{ "emotion": "love", "reduced_audio_features": [ [ 7.904686450958252, 6.640691757202148 ] ], "reduced_text_features": [ [ 1.9322983026504517, 2.798635721206665 ] ] }, { "emotion": "hate", "reduced_audio_features": [ [ 5.0379665159, 3.2360037692, 9.8240981092 ] ], "reduced_text_features": [ [ 1.3360433552,2.7668983367,1.7874406571 ] ] }, { "emotion": "normal", "reduced_audio_features": [ [ 4.9528418225, 1.5536162893 ] ], "reduced_text_features": [ [ 1.827666907,2.4657126942 ] ] }, { "emotion": "excited", "reduced_audio_features": [ [ 6.6013675493, 1.7926920898, 2.0805599755 ] ], "reduced_text_features": [ [ 1.9322983026504517, 2.798635721206665 ] ] }]

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
