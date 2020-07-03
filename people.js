$(document).ready(function () {
    $('#bootstrap-data-table-export').DataTable();
    loadPeople();
});

$(document).on("click", ".action", function (e) {
    let id = $(this).attr('id');
    loadInfo(id);
});

function loadInfo(id) {
    $("#table").slideToggle();
    $("#info").slideToggle();
    $.ajax({
        'url': ' https://cors-anywhere.herokuapp.com/https://torre.bio/api/bios/'+id, //Had to use cors-anywhere to bypass the CORB error on the client.
        'type': 'get',
        'headers': {  'Access-Control-Allow-Origin': 'https://bio.torre.co',
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
    obj = data.person;
    let pbody = $("#personal"),
        tr = "";
    pbody.empty();
    if (obj.name)
        tr += "<tr><td><strong>Fullname</strong></td><td>" + obj.name + "</td></tr>";
    if (obj.publicId)
        tr += "<tr><td><strong>Username</strong></td><td>" + obj.publicId + "</td></tr>";
    if (obj.professionalHeadline)
        tr += "<tr><td><strong>Description</strong></td><td>" + obj.professionalHeadline + "</td></tr>";
    if (obj.verified == "true")
        tr += "<tr><td><strong>Verified</strong></td><td>Verified</td></tr>";
    if (obj.weight)
        tr += "<tr><td><strong>Weight</strong></td><td>" + obj.weight + "</td></tr>";
    if (obj.location)
        tr += "<tr><td><strong>Location</strong></td><td>" + obj.location.name + "</td></tr>";
    if (data.languages)
        tr += "<tr><td><strong>Major Language</strong></td><td>" + data.languages[0].language + "</td></tr>";
    if (obj.date_created)
        tr += "<tr><td><strong>Date Created</strong></td><td>" + formatDate(obj.date_created) + "</td></tr>";
    pbody.html(tr);
}

$(document).on("click", "#back-inspection", function (e) {
    $('#table').show();
    $('#info').hide();
});

function loadPeople() {

    $.ajax({
        'url': 'https://search.torre.co/people/_search/?size=200',
        'type': 'post',
        'data': {},
        'success': function (data) {
            populateDataTable(data["results"]);
        },
        'error': function (err) {
            alert('Error');
        }
    });

}

function populateDataTable(data) {
    console.log("populating data table...");
    $("#bootstrap-data-table").dataTable().fnClearTable();
    $.each(data, function (k, v) {
        var action = '<button type="button" class="action btn btn-secondary mb-1" id='+v.username+' ><i class="fa fa-eye"></i> More info</button>'
        $('#bootstrap-data-table').dataTable().fnAddData([
            v.name,
            v.locationName,
            v.openTo,
            action
        ]);
    });
}