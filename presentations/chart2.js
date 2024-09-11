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

var NUM_LAYERS = 5;

function make_just_data(_data){
    console.log("Make stack data now.");
    let NUM_VARS_PER_LAYER = num_vars / NUM_LAYERS;
    _new_data_primal = [];
    _new_data_dual = [];
    for(let i = 0; i < NUM_VARS_PER_LAYER; i++){
        _new_data_it_primal = [];
        _new_data_it_dual = [];
        for(let step = 0; i + NUM_VARS_PER_LAYER * step < num_vars ;step++)
        {
            cur_step = i + NUM_VARS_PER_LAYER * step;
            // Quick fix to create gaps between layers
            _new_data_it_primal.push(_data.datasets[0].data[cur_step] * Math.pow(.5,step));
            _new_data_it_dual.push(_data.datasets[1].data[cur_step] / Math.pow(.5,step) * Math.pow(.5, NUM_LAYERS - 1));
        }
        _new_data_primal.push(_new_data_it_primal);
        _new_data_dual.push(_new_data_it_dual);
    }

    new_data_sets = [];
   for(let i = 0; i < NUM_VARS_PER_LAYER; i++)
   {
        let stack_name = 'Stack ' + i.toString(); 
        var prim_data = {backgroundColor: window.chartColors.red,
        data: _new_data_primal[i], stack: stack_name};
        var dual_data = {backgroundColor: window.chartColors.blue, 
        data: _new_data_dual[i], stack:stack_name}; 
        new_data_sets.push(prim_data);
        new_data_sets.push(dual_data);
   }
}

function make_stack_data(_data){
  
    let _labels = [];
    for(let i = 1; i <= NUM_LAYERS; i++){
        _labels.push("Layer " + i.toString());
    }
    var_new_data_sets = make_just_data(_data);
  
    var _new_data = {
        labels: _labels,
        datasets: new_data_sets 
    }
    console.log(_new_data);
    return _new_data; 
 }


var barChartData2 = make_stack_data(barChartData);

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

  var ctx2 = document.getElementById('chart_canvas3').getContext('2d');
  window.myBar2 = new Chart(ctx2, {
    type: 'bar',
    data: barChartData2,
    options: {
      title: {
        // display: true,
        text: 'Chart.js Bar Chart - Stacked'
      },
      legend :{
        display: false,
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
          ticks: {
              fontSize: 40,
          }
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
    if(e.which != 118){
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
    barChartData2.datasets = make_just_data(barChartData);
    window.myBar2.update();
});
