/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var dates = [];

var config = {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
                label: 'Weight',
                backgroundColor: window.chartColors.blue,
                borderColor: window.chartColors.blue,
                data: [],
                fill: false,
            }]
    },
    options: {
        responsive: true,
        title: {
            display: false,
            text: 'Weight'
        },
        tooltips: {
            mode: 'index',
            intersect: false,
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Date'
                    }
                }],
            yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Weight'
                    }
                }]
        }
    }
};

////////////////////////////////////////////////////////////////////

document.querySelector("html").classList.add('js');

var fileInput = document.querySelector(".input-file"),
        button = document.querySelector(".input-file-trigger"),
        the_return = document.querySelector(".file-return");

button.addEventListener("keydown", function (event) {
    if (event.keyCode == 13 || event.keyCode == 32) {
        fileInput.focus();
    }
});
button.addEventListener("click", function (event) {
    fileInput.focus();
    return false;
});
fileInput.addEventListener("change", function (event) {
    the_return.innerHTML = this.value;

    loadData(fileInput);
});

////////////////////////////////////////////////////////////////////

window.onload = function () {
    var ctx = document.getElementById('canvas').getContext('2d');
    window.myLine = new Chart(ctx, config);
};

function loadData(fileInput) {
    var file = fileInput.files[0];
    var fileURL = URL.createObjectURL(file);
    var req = new XMLHttpRequest();
    req.open('GET', fileURL);
    req.onload = function () {
        URL.revokeObjectURL(fileURL);
        populateData(fileInput.form, this.responseXML);
    };
    req.onerror = function () {
        URL.revokeObjectURL(fileURL);
        console.log('Error loading XML file.');
    };
    req.send();
}

function populateData(form, xmlDoc) {
    var root = xmlDoc.documentElement;

    var xmlElement = root.querySelector("name");
    document.getElementById("info").innerHTML = "Person: " + xmlElement.textContent;

    document.getElementById("canvas").style.visibility = "visible";

    //document.getElementById("info").innerHTML = "Period From =  " + document.getElementById("periodFrom").value;

    var observations = xmlDoc.getElementsByTagName("observation");
    for (var i = 0; i < observations.length; i++) {
        //var observation = observations[i].firstChild.nodeValue;
        var code = observations[i].getElementsByTagName("code")[0].getAttribute("displayName");
        var date = observations[i].getElementsByTagName("low")[0].getAttribute("value");
        var value = observations[i].getElementsByTagName("value")[0].textContent;

        /*let tableRef = document.getElementById("weightTable");
         let newRow = tableRef.insertRow(-1);
         let typeCell = newRow.insertCell(0);
         let dateCell = newRow.insertCell(1);
         let valueCell = newRow.insertCell(2);
         var typeText = document.createTextNode(code);
         var dateText = document.createTextNode(date);
         var valueText = document.createTextNode(value);
         typeCell.appendChild(typeText);
         dateCell.appendChild(dateText);
         valueCell.appendChild(valueText);*/

        if (code == "Body weight Measured") {
            dates.push(date);

            if (config.data.datasets.length > 0) {
                config.data.labels.push(moment(date, "YYYYMMDDHHmmssZZ").format("YY/MM/DD"));
                config.data.datasets.forEach(function (dataset) {
                    dataset.data.push(value);
                });
                window.myLine.update();
            }
        }
    }
    /*for () {
     //
     }*/

}