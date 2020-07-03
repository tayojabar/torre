$(document).ready(function () {
    $('#bootstrap-data-table-export').DataTable();
    loadOpportunities();
});


$(document).on("click", ".action", function (e) {
    let id = $(this).attr('id');
    loadInfo(id);
});

function loadInfo(id) {
    $("#table").slideToggle();
    $("#info").slideToggle();
    $.ajax({
        'url': ' https://cors-anywhere.herokuapp.com/https://torre.co/api/opportunities/'+id, //Using cors-anywhere to bypass the CORB error on the client.
        'type': 'get',
        'headers': {  'Access-Control-Allow-Origin': 'https://torre.co/api',
                    Accept:'application/json' },
        'crossDomain': true,
        'dataType': 'json',
        'success': function (data) {
            populateInfoPanel(data);
        },
        'error': function (err) {
            alert('Error');
        }
    });

}

function populateInfoPanel(data){
    obj = data;
    let obody = $("#oppo"),
        tr = "";
    obody.empty();
    if (obj.objective)
        tr += "<tr><td><strong>Job title</strong></td><td>" + obj.objective + "</td></tr>";
    if (obj.organizations)
        tr += "<tr><td><strong>Company</strong></td><td>" + obj.organizations[0].name + "</td></tr>";
    if (obj.commitment)
        tr += "<tr><td><strong>Commitment</strong></td><td>" + obj.commitment.code + "</td></tr>";
    if (obj.created)
        tr += "<tr><td><strong>Date of Posting</strong></td><td>" + obj.created + "</td></tr>";
    if (obj.compensation)
        tr += "<tr><td><strong>Currency</strong></td><td>"+obj.compensation.currency+", "+obj.compensation.periodicity+"</td></tr>";
    if (obj.place)
        tr += "<tr><td><strong>Remote</strong></td><td>"+obj.place.remote+", "+obj.compensation.periodicity+"</td></tr>";
    if (obj.owner)
        tr += "<tr><td><strong>Job Poster</strong></td><td>" + obj.owner.name + "</td></tr>";
    if (obj.owner)
        tr += "<tr><td><strong>Poster Verified</strong></td><td>" + obj.owner.verified + "</td></tr>";
    if (obj.deadline)
        tr += "<tr><td><strong>Deadline</strong></td><td>" + obj.deadline + "</td></tr>";
    obody.html(tr);
}

$(document).on("click", "#back-inspection", function (e) {
    $('#table').show();
    $('#info').hide();
});


function loadOpportunities() {

    $.ajax({
        'url': 'https://search.torre.co/opportunities/_search/?',
        'type': 'post',
        'data': {},
        'success': function (data) {
            populateDataTable(data["results"]);
        },
        'error': function (err) {
            alert ('Error');
        }
    });

}

function populateDataTable(data) {
    console.log("populating data table...");
    $("#bootstrap-data-table").dataTable().fnClearTable();
    $.each(data, function(k, v){
        var action = '<button type="button" class="action btn btn-secondary mb-1" id='+v.id+' ><i class="fa fa-eye"></i> More info</button>'
        $('#bootstrap-data-table').dataTable().fnAddData([
            v.objective,
            v.type,
            v.organizations[0].name,
            v.remote,
            v.deadline, 
            action
        ]);
    });
}