          var num_vars = 30;
          var label_arr = [];
          var primal_vars = [];
          var dual_vars = [];
          var MAX_VAL = 4;
          var MIN_VAL = MAX_VAL / 4;
          MIN_VAL_arr = [];
          
          MIN_VAL_arr.sort().reverse();
          var NUM_PRIMAL = num_vars * .3;
          for(let i = 0; i < NUM_PRIMAL; i++){
            MIN_VAL_arr.push(MIN_VAL * (Math.random() + .3));
          } 
          MIN_VAL_DUAL_arr = [];
          for(let i = 0; i < num_vars - NUM_PRIMAL; i++)
          {
            MIN_VAL_DUAL_arr.push(MIN_VAL * (Math.random() + .3));
          }
          MIN_VAL_DUAL_arr.sort();
          MIN_VAL_arr = MIN_VAL_arr.concat(MIN_VAL_DUAL_arr);
          var mu = MAX_VAL * MAX_VAL / 4;
          for (let step = 1; step <= num_vars; step++) {
            label_arr.push(step.toString());
            let rand = MAX_VAL * Math.random() + 1;
            primal_vars.push(rand);
            dual_vars.push(-mu/rand);
          }
          primal_vars.sort().reverse();
          dual_vars.sort();
          var barChartData = {
            labels: label_arr,
            datasets: [{
              label: 'Primal',
              backgroundColor: window.chartColors.red,
              data: primal_vars 
              
            }, {
              label: 'Dual',
              backgroundColor: window.chartColors.blue,
              data: dual_vars,
            }]
      
          };
          window.onload = function() {
            var ctx = document.getElementById('chart_canvas2').getContext('2d');
            window.myBar = new Chart(ctx, {
              type: 'bar',
              data: barChartData,
              options: {
                title: {
                  // display: true,
                  text: 'Chart.js Bar Chart - Stacked'
                },
                legend :{
                  display: true,
                  position: "right",
                  labels: {
                    fontSize: 40,
                  }
                },
                tooltips: {
                  mode: 'index',
                  intersect: false
                },
                responsive: true,
              scales: {
                  xAxes: [{
                    stacked: true,
                  }],
                  yAxes: [{
                    display:false,
                    stacked: true,
                    ticks: {
                      suggestedMin: -5,
                      suggestedMax: 5, 
                  }
                  }]
                }
              }
            });
          };
  
  
      
            document.addEventListener('keypress', function(e){ 
              if(e.which != 105){
                return;
              };
            let scale_factor = .9;
            for (let step = 0; step < num_vars; step++) {
              let rand_scal_factor;
              if(step < NUM_PRIMAL){
                let scale_factor_primal = Math.max(scale_factor, MIN_VAL_arr[step] / barChartData.datasets[0].data[step]);
                rand_scal_factor = Math.pow(scale_factor_primal, 1- Math.random());
              } else{
                let dual_min_scale_down = Math.min(1,scale_factor /( MIN_VAL_arr[step] / (-barChartData.datasets[1].data[step])));
                let scale_factor_dual = Math.max(scale_factor, dual_min_scale_down);
                rand_scal_factor = Math.pow(scale_factor, 1- Math.random()) * dual_min_scale_down;
              }
              barChartData.datasets[0].data[step] = barChartData.datasets[0].data[step] * rand_scal_factor;
              barChartData.datasets[1].data[step] = barChartData.datasets[1].data[step] * scale_factor / rand_scal_factor;
            }
              barChartData.datasets[0].data.sort().reverse();
              barChartData.datasets[1].data.sort();
            window.myBar.update();
          });