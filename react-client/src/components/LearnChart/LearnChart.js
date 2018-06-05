import React, { Component } from 'react';
import ChartistGraph from 'react-chartist';
import Chartist from 'chartist';

import './LearnChart.css';

class LearnChart extends Component {
  render() {
    const categories = this.props.categories;
    if (!categories || !categories.length) {
      return '';
    }

    const processedCategories = categories.map(category => ({
      name: category.name,
      learnedWordsThisWeek: (category.learnedWordsThisWeek || 0) / (category.words.length || 1),
      learnedWordsBeforeThisWeek: (category.learnedWordsBeforeThisWeek || 0) / (category.words.length || 1),
    })).sort((a, b) =>
      b.learnedWordsThisWeek + b.learnedWordsBeforeThisWeek -
      (a.learnedWordsThisWeek + a.learnedWordsBeforeThisWeek)
    ).slice(0, 5);

    const chartData = {
      labels: processedCategories.map(c => c.name),
      series: [
        processedCategories.map(c => c.learnedWordsBeforeThisWeek),
        processedCategories.map(c => c.learnedWordsThisWeek),
      ],
    };
    const ticks = [];
    for (let i = 0; i < 11; i++) {
      ticks.push(i * 0.1);
    }
    const chartOptions = {
      stackBars: true,
      axisY: {
        type: Chartist.FixedScaleAxis,
        low: 0,
        high: 1,
        ticks,
        labelInterpolationFnc: function (value) {
          return Math.round(value * 100) + '%';
        },
        labelOffset: {
          x: 5,
          y: 15,
        }
      },
    }
    
    return (
      <div className="chart-container">
        <ChartistGraph data={chartData} options={chartOptions} type="Bar" />
        <div className="chart-legend">
          <h1>Legenda</h1>
          <ul className="chart-legend-items">
            <li className="series-b">Nowo opanowane w tym tygodniu słówka</li>
            <li className="series-a">Słówka opanowane przed początkiem tego tygodnia</li>
          </ul>
        </div>
        <div class="chart-footer">Top 5 kategorii</div>
      </div>
    );
  }
}

export default LearnChart;
