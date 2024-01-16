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
  bubbleChart!: Chart
  radarChart!: Chart
  scatterChart!: Chart

  ngOnInit(): void {
    // this.modelService.getJobStatus().subscribe()
    this.barChart = this.createChart('BarChart', 'bar', {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [],
    }, {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    })

    this.bubbleChart = this.createChart('BubbleChart', 'bubble', {
      datasets: []
    }, {})

    this.radarChart = this.createChart('RadarChart', 'radar', {
      labels: [
        'Eating',
        'Drinking',
        'Sleeping',
        'Designing',
        'Coding',
        'Cycling',
        'Running'
      ],
      datasets: []
    }, {
      elements: {
        line: {
          borderWidth: 3
        }
      },
      scales: {
        r: {
            min: 0,
            max: 100,
          ticks: {
            stepSize: 10,
          },
          pointLabels: {
            fontSize: 14,
            display: (ctx: { chart: { width: number; }; }) => ctx.chart.width > 400
          }
        }
      }
    })

    this.scatterChart = this.createChart('ScatterChart', 'scatter', {
      datasets: [],
    }, {})
  }
  
  ngAfterViewInit(): void { this.loadAllDataIntoCharts() }

  loadAllDataIntoCharts() {
    this.progressValue = 40
    this.changeDetectorRef.detectChanges()

    this.modelService.getAllJobs().subscribe((t) => {
      console.log(t)

      this.barChart.data.datasets.push({
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1,
      })

      this.bubbleChart.data.datasets.push({
        label: 'First Dataset',
        data: [{
          x: 20,
          y: 30,
          r: 15
        }, {
          x: 40,
          y: 10,
          r: 10
        }],
        backgroundColor: 'rgb(255, 99, 132)'
      })

      this.radarChart.data.datasets.push({
        label: 'My First Dataset',
        data: [65, 59, 90, 81, 56, 55, 40],
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgb(255, 99, 132)',
        pointBackgroundColor: 'rgb(255, 99, 132)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(255, 99, 132)'
      }, {
        label: 'My Second Dataset',
        data: [28, 48, 40, 19, 96, 27, 100],
        fill: true,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgb(54, 162, 235)',
        pointBackgroundColor: 'rgb(54, 162, 235)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(54, 162, 235)'
      })

      this.scatterChart.data.datasets.push({
        label: 'Scatter Dataset',
        data: [{
          x: -10,
          y: 0
        }, {
          x: 0,
          y: 10
        }, {
          x: 10,
          y: 5
        }, {
          x: 0.5,
          y: 5.5
        }],
        backgroundColor: 'rgb(255, 99, 132)'
      });

      this.barChart.update()
      this.bubbleChart.update()
      this.radarChart.update()
      this.scatterChart.update()

      this.progressValue = 100
      this.changeDetectorRef.detectChanges()

      setTimeout(() => {
        this.progressValue = 0
        this.changeDetectorRef.detectChanges()
      }, 750)
    })
  }

  createChart(id: string, type: keyof ChartTypeRegistry, data: any, options: any) {
    return new Chart(id, {
      type: type,
      data: data,
      options: options,
    });
  }

  openModal() {
    const sub = this.dialogService.open(AddDataModalComponent,
      {
        hasBackdrop: true,
        minWidth: '30%',
        panelClass: '!bg-gray-800'
      }
    ).afterClosed().subscribe((v) => {
      if (v) { this.loadAllDataIntoCharts() }
      sub.unsubscribe()
    })
  }
}
