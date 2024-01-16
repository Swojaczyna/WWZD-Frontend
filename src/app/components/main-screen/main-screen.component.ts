import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronLeft, faUpload } from '@fortawesome/free-solid-svg-icons';
import { Chart, ChartTypeRegistry } from 'chart.js/auto';
import { ModelService } from '../../services/model.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { AddDataModalComponent } from '../add-data-modal/add-data-modal.component';
import { LoaderService } from '../../services/loader.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { forkJoin } from 'rxjs';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ReducedModelResponse } from '../../interfaces/model';

@Component({
  selector: 'app-main-screen',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatProgressBarModule,
    MatTooltipModule
  ],
  host: { class: 'h-screen header-view' },
  templateUrl: './main-screen.component.html',
  styleUrl: './main-screen.component.scss',
  animations: [
    trigger('hideShow', [
      state('show-progress', style({
        opacity: 1
      })),
      state('hide-progress', style({
        visibility: 'hidden',
        height: 0,
        opacity: 0
      })),
      transition('show-progress => hide-progress', animate('0.1s')),
      transition('hide-progress => show-progress', animate('0.1s')),
    ]),
  ]
})

export class MainScreenComponent implements OnInit, AfterViewInit {
  dialogService = inject(MatDialog)
  loaderService = inject(LoaderService)
  router = inject(Router)
  modelService = inject(ModelService)
  changeDetectorRef = inject(ChangeDetectorRef)
  chevronLeft = faChevronLeft
  upload = faUpload

  progressValue = 0

  barChart!: Chart
  // bubbleChart!: Chart
  pieChart!: Chart
  scatterChart!: Chart
  scatterAudioChart!: Chart

  ngOnInit(): void {
    // this.modelService.getJobStatus().subscribe()
    this.barChart = this.createChart('BarChart', 'bar', {
      labels: [],
      datasets: [],
    }, {
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Wykres ilościowy rozkładu danych tekstowych'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    })

    // this.bubbleChart = this.createChart('BubbleChart', 'bubble', {
    //   datasets: []
    // }, {
    //   plugins: {
    //     legend: {
    //       position: 'top',
    //     },
    //     title: {
    //       display: true,
    //       text: 'Chart.js Scatter Multi Axis Chart'
    //     }
    //   },
    // })

    this.pieChart = this.createChart('PieChart', 'pie', {
      labels: [],
      datasets: []
    }, {
      plugins: {
        datalabels: {
          formatter: (value: number, ctx: { chart: { data: { datasets: { data: any; }[]; }; }; }) => {
              let sum = 0;
              let dataArr = ctx.chart.data.datasets[0].data;
              dataArr.map((data: number) => {
                sum += data;
              });
              let percentage = (value*100 / sum).toFixed(2)+"%";
              return percentage;
          },
          color: '#fff',
          display: function(context: { active: any; }) {
            return context.active;
          }
        },
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Wykres procentowy rozkładu danych tekstowych'
        }
      },
    },
    [ChartDataLabels])

    this.scatterChart = this.createChart('ScatterChart', 'scatter', {
      datasets: [],
    }, {
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Wykres punktowy rozkładu danych tekstowych'
        }
      },
    })

    this.scatterAudioChart = this.createChart('ScatterAudioChart', 'scatter', {
      datasets: [],
    }, {
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Wykres punktowy rozkładu danych muzycznych'
        }
      },
    })
  }
  
  ngAfterViewInit(): void { this.loadAllDataIntoCharts() }

  loadAllDataIntoCharts() {
    this.progressValue = 40
    this.changeDetectorRef.detectChanges()

    forkJoin([
      this.modelService.getLyricsFeatures(),
      this.modelService.getAudioFeatures(),
      this.modelService.getLyricsEmotions()
    ]).subscribe(([lyricsF, audioF, lyricsE]) => {
      let scatterData: { x: number; y: number; label: string; }[] = [];
      lyricsF.forEach((value: number[], index: number) => {
        const coordination = {
          x: value[0],
          y: value[1],
          label: lyricsE[index]
        }

        scatterData.push(coordination)
      })

      const groupedScatterData = this.groupBy(scatterData, 'label')

      let preparedLabels: any[] | undefined = []
      let preparedLengthData = []
      for(const [key, value] of Object.entries(groupedScatterData)) {
        preparedLabels.push(key)
        preparedLengthData.push((value as any[]).length)

        this.scatterChart.data.datasets.push({
          label: key,
          data: value as any[],
          // backgroundColor: color
        });
      }

      this.barChart.data.labels = preparedLabels
      this.barChart.data.datasets.push({
        label: 'Liczba rekordów',
        data: preparedLengthData,
        borderWidth: 1,
      })

      console.log(this.scatterChart.data.datasets)

      // this.bubbleChart.data.datasets.push({
      //   label: 'First Dataset',
      //   data: [{
      //     x: 20,
      //     y: 30,
      //     r: 15
      //   }, {
      //     x: 40,
      //     y: 10,
      //     r: 10
      //   }],
      //   backgroundColor: 'rgb(255, 99, 132)'
      // })

      this.pieChart.data.labels = preparedLabels
      this.pieChart.data.datasets.push({
        label: 'Liczba rekordów',
        data: preparedLengthData,
        hoverOffset: 4
      })

      const test = audioF.map((value: number[]) => {
        return {x: value[0], y: value[1]}
      })
    
      this.scatterAudioChart.data.datasets.push({
        label: 'unknown',
        data: test,
      })

      console.log(this.scatterAudioChart.data)
    
      console.log(this.scatterAudioChart.data.datasets.forEach(value => value.label))

      console.log(this.barChart.data.datasets[0])
      console.log(this.pieChart.data.datasets[0])

      this.barChart.update()
      // this.bubbleChart.update()
      this.pieChart.update()
      this.scatterChart.update()
      this.scatterAudioChart.update()

      this.progressValue = 100
      this.changeDetectorRef.detectChanges()

      setTimeout(() => {
        this.progressValue = 0
        this.changeDetectorRef.detectChanges()
      }, 750)
    })
  }

  createChart(id: string, type: keyof ChartTypeRegistry, data: any, options: any, plugins?: any) {
    return new Chart(id, {
      type: type,
      data: data,
      options: options,
      plugins: plugins
    });
  }

  openModal() {
    const sub = this.dialogService.open(AddDataModalComponent,
      {
        hasBackdrop: true,
        minWidth: '30%',
        // panelClass: '!bg-gray-800'
      }
    ).afterClosed().subscribe((v) => {
      if (v) {
        this.progressValue = 40
        this.modelService.getJobResult(v.identifier)
          .subscribe((result: ReducedModelResponse) => {
            this.progressValue = 100
            const index = this.barChart.data.labels?.indexOf(result.emotion)!

            console.log(this.barChart.data)
            console.log(this.pieChart.data)
            console.log(this.scatterChart.data)


            if (index) {
              const newBarChartDataValue = (this.barChart.data.datasets[0].data[index] as number) + 1;
              const newPieChartDataValue = (this.pieChart.data.datasets[0].data[index] as number) + 1;
              
              this.barChart.data.datasets[0].data[index] = newBarChartDataValue
              this.pieChart.data.datasets[0].data[index] = newPieChartDataValue
  
              this.scatterChart.data.datasets[index].data.push({
                // label: result.emotion,
                x: result.reduced_text_features[0],
                y: result.reduced_text_features[1]
              });

            } else { }// nigdy nie będzie takiej sytuacji xd 

            console.log(this.scatterAudioChart.data)
            const indexAudio = this.scatterAudioChart.data.datasets.findIndex(value => value.label == result.emotion)

            if (indexAudio > -1) {
              this.scatterAudioChart.data.datasets[indexAudio].data.push({
                // label: result.emotion,
                x: result.reduced_audio_features[0],
                y: result.reduced_audio_features[1]
              });
            } else {
              var r = Math.floor(Math.random() * 255);
              var g = Math.floor(Math.random() * 255);
              var b = Math.floor(Math.random() * 255);
              const color = "rgb(" + r + "," + g + "," + b + ")";

              this.scatterAudioChart.data.datasets.push({
                label: result.emotion,
                data: [{
                  x: result.reduced_audio_features[0],
                  y: result.reduced_audio_features[1]
                }],
                backgroundColor: color
              })
            }

            this.barChart.update()
            this.pieChart.update()
            this.scatterChart.update()
            this.scatterAudioChart.update()

            setTimeout(() => {
              this.progressValue = 0
              this.changeDetectorRef.detectChanges()
            }, 750)
          })
      }
      sub.unsubscribe()
    })
  }

  groupBy(arr: any[], property: string | number) {
    return arr.reduce(function (memo, x) {
        if (!memo[x[property]]) { memo[x[property]] = []; }
        memo[x[property]].push(x);
        return memo;
    }, {});
  };
}
