import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Chart, ChartTypeRegistry } from 'chart.js/auto';

@Component({
  selector: 'app-main-screen',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    MatButtonModule,
    MatProgressBarModule
  ],
  host: { class: 'h-screen relative header-view' },
  templateUrl: './main-screen.component.html',
  styleUrl: './main-screen.component.scss'
})

export class MainScreenComponent implements OnInit {
  router = inject(Router)
  iconValue = faChevronLeft

  ngOnInit(): void {
    this.createChart('BarChart', 'bar', {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [
        {
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          borderWidth: 1,
        },
      ],
    }, {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    })

    this.createChart('BubbleChart', 'bubble', {
      datasets: [{
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
      }]
    }, {})

    this.createChart('RadarChart', 'radar', {
      labels: [
        'Eating',
        'Drinking',
        'Sleeping',
        'Designing',
        'Coding',
        'Cycling',
        'Running'
      ],
      datasets: [{
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
      }]
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

    this.createChart('ScatterChart', 'scatter', {
      datasets: [{
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
      }],
    }, {})
  }

  createChart(id: string, type: keyof ChartTypeRegistry, data: any, options: any) {
    new Chart(id, {
      type: type,
      data: data,
      options: options,
    });
  }
}
