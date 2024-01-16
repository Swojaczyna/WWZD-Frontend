import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { ReducedModelResponse } from '../interfaces/model';

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

    return this.http.get<ReducedModelResponse>(`${this.apiUrl + '/api/v1/wzw/classified/' + id}`,
      { headers }
    ).pipe(
      catchError((e: HttpErrorResponse) => {
        switch(e.status) {
          case 404:
        }
        return throwError(() => e)
      })
    )
  }

  getJobStatus(id: number) {
    const headers = new HttpHeaders()
    const params = new HttpParams()
      .set('identifier', id)

    return this.http.get<any>(`${this.apiUrl + '/api/v1/wzw/status'}`,
      {
        headers,
        params
      }
    ).pipe(
      catchError((e: HttpErrorResponse) => {
        switch(e.status) {
          case 404:
        }
        return throwError(() => e)
      })
    )
  }

  scheduleAsyncJob(files: any, form: any) {
    const headers = new HttpHeaders()
    const formData: FormData = new FormData();
    formData.append('audio', files)
    formData.append('lyrics', form)

    return this.http.post<{identifier: number}>(`${this.apiUrl + '/api/v1/wzw'}`,
      formData,
      {
        headers,
        observe: 'response'
      }
    ).pipe(
      map((response: HttpResponse<any>) => response.body),
      catchError((e: HttpErrorResponse) => {
        switch(e.status) {
          case 404:
        }
        return throwError(() => e)
      })
    )
  }

  getLyricsFeatures() {
    const headers = new HttpHeaders()

    return this.http.get<number[][]>(`${this.apiUrl + '/api/v1/wzw/initial-data/lyrics-features'}`,
      { headers }
    ).pipe(
      catchError((e: HttpErrorResponse) => {
        switch (e.status) {
          case 404:
        }
        return throwError(() => e)
      })
    )
  }

  getAudioFeatures() {
    const headers = new HttpHeaders()

    return this.http.get<number[][]>(`${this.apiUrl + '/api/v1/wzw/initial-data/audio-features'}`,
      { headers }
    ).pipe(
      catchError((e: HttpErrorResponse) => {
        switch (e.status) {
          case 404:
        }
        return throwError(() => e)
      })
    )
  }

  getLyricsEmotions() {
    const headers = new HttpHeaders()

    return this.http.get<string[]>(`${this.apiUrl + '/api/v1/wzw/initial-data/lyrics-emotions'}`,
      { headers }
    ).pipe(
      catchError((e: HttpErrorResponse) => {
        switch (e.status) {
          case 404:
        }
        return throwError(() => e)
      })
    )
  }
}
