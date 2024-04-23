let hoveredCLAMSApp = null;
let clickedCLAMSApps = [];
var ctx = document.getElementById('pieChart').getContext('2d');

// TODO Update labels dynamically

function getAppLabels() {
  var labels = {};
  for (i = 0; i < nodes.length; i++) {
    for (app of nodes[i].apps) {
      if (app == "") continue;
      if (!(app in labels)) {
        labels[app] = 0;
      }
      labels[app]++;
    }
  }
  return labels;
}

nodesPromise
  .then(() => {updatePieChart()})


function updatePieChart() {
    labelCounts = getAppLabels();

    if (Object.keys(labelCounts).length == 0) {
      ctx.canvas.height = 0;
      return;
    }

    labelList = Object.keys(labelCounts);
    var pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: Object.keys(labelCounts),
        datasets: [{
          data: Object.values(labelCounts),
          selectedBackgroundColors: ['#FF6384', '#36A2EB', '#FFCE56', '#49D49D'],
          unselectedBackgroundColors: ['#FF9999', '#99C2FF', '#FFDC99', '#B3FFB3'],
          backgroundColor: ['#FF9999', '#99C2FF', '#FFDC99', '#B3FFB3'],
        }],
        selectedIndex: null
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            enabled: false // Disable the default tooltip
          }
        },
        hover: {
          mode: 'nearest',
          intersect: true
        },
  
        onHover: (event, chartElements) => {
          event.native.target.style.cursor = chartElements.length ? 'pointer' : 'default';
        },
  
        onClick: (event, chartElements) => {
          if (chartElements.length) {
            const clickedIndex = chartElements[0].index;
            clickedLabel = event.chart.data.labels[clickedIndex];
            clickedCLAMSApps.includes(clickedIndex) ? clickedCLAMSApps.splice(clickedCLAMSApps.indexOf(clickedIndex), 1) : clickedCLAMSApps.push(clickedIndex);
        
            // Update the backgroundColor of the clicked slice
  
            const dataset = event.chart.data.datasets[0];
            for (i = 0; i < event.chart.data.labels.length; i++) {
              if (clickedCLAMSApps.includes(i)) {
                  dataset.backgroundColor[i] = dataset.selectedBackgroundColors[i];
              } else {
                  dataset.backgroundColor[i] = dataset.unselectedBackgroundColors[i];
              }
            }
            // const dataset = event.chart.data.datasets[0];
            // dataset.backgroundColor[clickedIndex] = dataset.hoverBackgroundColor[clickedIndex];
            event.chart.update();
  
            filterByApp();
        
            tick(); // Call the tick function to update node colors/opacity
          }
        }    
      },
  
  
      plugins: [{
        beforeEvent: (chart, args, options) => {
          const event = args.event;
          const hoveredElement = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, false);
  
          if (hoveredElement.length) {
            const hoveredIndex = hoveredElement[0].index;
            hoveredCLAMSApp = null;
            hoveredCLAMSApp = chart.data.labels[hoveredIndex];
            tick();
          } else {
            hoveredCLAMSApp = null;
            tick();
          }
        },
      }]
    });
  
  }


  let enabled = true;

  $(".card-header").click(function(){
    if (!enabled) return;
    var panel = $(this).parent();
    var panelContent = panel.find(".card-content");
    var panelId = panel.data("panel-id");
    var panelState = panel.data("panel-state");
    
    panelContent.slideToggle("slow");
    $(this).toggleClass("active");
    $(this).find(".fa-chevron-up").toggleClass("fa-rotate-180");
    
    if (panelState === "closed") {
        panel.data("panel-state", "open");
        // code to handle opening the panel
    } else {
        panel.data("panel-state", "closed");
        // code to handle closing the panel
    }
});

function disableFilterCard() {
  enabled = false;
  $(".card-header").addClass("has-background-grey-lighter");
  $(".card-header").addClass("has-text-grey");
  $("#returnButton").removeClass("inactive");
}

function enableFilterCard() {
  enabled = true;
  $(".card-header").removeClass("has-background-grey-lighter");
  $(".card-header").removeClass("has-text-grey");
  $("#returnButton").addClass("inactive");
  $(".card-header").click();
  updateGraph();
}