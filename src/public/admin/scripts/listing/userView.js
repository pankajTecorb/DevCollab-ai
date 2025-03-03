
$(document).ready(function () {
    var selector = '.nav li';

    $(selector).on('click', function () {
        $(selector).removeClass('active');
        $(this).addClass('active');
    });
});



function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    const monthNames = ["Jan", "Feb", "March", "April", "May", "June",
        "July", "Aug", "Sept", "Oct", "Nov", "Dec"
    ];
    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    var y = monthNames[month - 1]
    // console.log('month',y)
    return [day, monthNames[month - 1], year].join('-');
}


//***********User view Details*********/
var currentLocation = window.location.href;
var url = new URL(currentLocation);
var userId = url.searchParams.get("id");

//***********User view Details*********/
var currentLocation = window.location.href;
var url = new URL(currentLocation);
var role = url.searchParams.get("role");

function userDetails() {
    var obj = {
        "userId": userId
    }
    $('#ibox1').children('.ibox-content').toggleClass('sk-loading');
    $.ajax({
        url: `${host}/api/v1/admin/user/viewdetail/${userId}`,
        type: 'Get',
        contentType: 'application/json',
        data: JSON.stringify(obj),
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        dataType: 'json',

        success: function (data, status) {
            $('#ibox1').children('.ibox-content').toggleClass('sk-loading');

            if (data.code == 200) {
                document.getElementById('name').innerHTML = data.data.response.name;
                document.getElementById('email').innerHTML = data.data.response.email ? data.data.response.email : "N/A";
                document.getElementById('mobile').innerHTML = data.data.response.phoneNumber ? data.data.response.phoneNumber : "N/A";
                document.getElementById('businessName').innerHTML = data.data.response.businessName ? data.data.response.businessName : 'N/A';
                document.getElementById("pendingIssue").innerHTML = data.data.ticketPending;
                document.getElementById('resolvedIssue').innerHTML = data.data.ticketResolve;
                document.getElementById('tripcomplete').innerHTML = data.data.bookingComplete;
                document.getElementById('trippending').innerHTML = data.data.bookingPending;
                document.getElementById('tripcancel').innerHTML = data.data.bookingCancel;
                document.getElementById('tripongoing').innerHTML = data.data.bookingProgress;
            } else {
                alert("Something Wrong, Try again")
            }
        }
    });
}


function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#blah')
                .attr('src', e.target.result)
                .width(100)
                .height(100);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

$(document).ready(function () {
    var selector = '.nav li';
    $(selector).on('click', function () {
        $(selector).removeClass('active');
        $(this).addClass('active');
    });
});



function clientDetail() {
    var obj = {
        'page': 1,
        'pageSize': 10,
        "userId": userId,
        "role":role
    }
    $.ajax({
        url: `${host}/api/v1/admin/user/userCredit-List?userId=${obj.userId}&page=${obj.page}&pageSize=${obj.pageSize}&role=${obj.role}`,
        type: 'Get',
        contentType: 'application/json',
        data: JSON.stringify(obj),
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        dataType: 'json',

        success: function (data, status) {
            if (data.code == 200) {
                $("#table2").removeClass("hide")
                $("#noData").removeClass("show")
                $("#page1").removeClass("hide")
                var x = data.data.Total
                $('#example-1').pagination({
                    total: x,
                    current: 1,
                    length: 10,
                    prev: 'Previous',
                    next: 'Next',
                    click: function (options, $target) {
                        let obj = {
                            'page': options.current,
                            'pageSize': options.length,
                            "userId": userId,
                            "role":role

                        }

                        $.ajax({
                            url: `${host}/api/v1/admin/user/userCredit-List?userId=${obj.userId}&page=${obj.page}&pageSize=${obj.pageSize}&role=${obj.role}`,
                            type: 'Get',
                            contentType: 'application/json',
                            data: JSON.stringify(obj),
                            beforeSend: function (xhr) {
                                xhr.setRequestHeader('Authorization', token);
                            },
                            dataType: 'json',
                            success: function (data, status) {
                                if (data.code == 200) {
                                    $("#tripTable").html(' ');


                                    for (var i = 0; i < data.data.response.length; i++) {

                                        var index = i + 1 + (obj.pageSize * (obj.page - 1));

                                        document.getElementById('tripTable').innerHTML += '<tr >' +
                                            '<td >' + index + '<td>' + data.data.response[i].identity + '<td><span>' + data.data.response[i].PicupAdd[0].addressLine1 + '<span>' + ',' + '<span >' + data.data.response[i].PicupAdd[0].addressLine2 + '<span>' + ',' + '<span >' + data.data.response[i].PicupAdd[0].city + '</span>' + '<td><span>' + data.data.response[i].DropAdd[0].addressLine1 + '<span>' + ',' + '<span >' + data.data.response[i].DropAdd[0].addressLine2 + '<span>' + ',' + '<span >' + data.data.response[i].DropAdd[0].city + '</span>' +
                                            '<td>' + data.data.response[i].containerLength + '<td>' + data.data.response[i].goodsCategory + '<td>' + data.data.response[i].pickupTime +
                                            '<td>' + data.data.response[i].pickupDate + '<td>' + data.data.response[i].bookingStatus
                                        '<td class="table-dropdown">' +
                                            '<div class="dropdown">' +
                                            '<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                                            '<img src="' + "../img/moreicon1.png" + '" >  </button > ' +
                                            '<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">' +
                                            // '<a class="dropdown-item"  onclick ="UpdatedataStatus(' + '\'' + data.result[i]._id + '\'' + ')">Active</a>' +

                                            '</div></div>'
                                    }
                                }

                            }

                        })
                        $target.next(".show").text('Current: ' + options.current);

                    }
                })
                $("#tripTable").html(' ');

                for (var i = 0; i < data.data.response.length; i++) {
                    var index = i + 1
                    document.getElementById('tripTable').innerHTML += '<tr >' +
                        '<td >' + index + '<td>' + data.data.response[i].identity + '<td><span>' + data.data.response[i].PicupAdd[0].addressLine1 + '<span>' + ',' + '<span >' + data.data.response[i].PicupAdd[0].addressLine2 + '<span>' + ',' + '<span >' + data.data.response[i].PicupAdd[0].city + '</span>' + '<td><span>' + data.data.response[i].DropAdd[0].addressLine1 + '<span>' + ',' + '<span >' + data.data.response[i].DropAdd[0].addressLine2 + '<span>' + ',' + '<span >' + data.data.response[i].DropAdd[0].city + '</span>' +
                        '<td>' + data.data.response[i].containerLength + '<td>' + data.data.response[i].goodsCategory + '<td>' + data.data.response[i].pickupTime +
                        '<td>' + data.data.response[i].pickupDate + '<td>' + data.data.response[i].bookingStatus
                    '<td class="table-dropdown">' +
                        '<div class="dropdown">' +
                        '<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                        '<img src="' + "../assets/img/moreicon1.png" + '" >  </button > ' +
                        '<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">' +
                        // '<a class="dropdown-item"  onclick ="UpdatedataStatus(' + '\'' + data.result[i]._id + '\'' + ')">Active</a>' +

                        '</div></div>'
                }
            } else {
                $("#table").html(' ');
                $("#table2").addClass("hide");
                $("#noData").addClass("show");
                $("#page1").hide();
            }
        }
    });
}


function issueDetail() {
    var obj = {
        'page': 1,
        'pageSize': 10,
        "userId": userId
    }
    $.ajax({
        url: `${host}/api/v1/admin/user/userCredit-List?userId=${obj.userId}&page=${obj.page}&pageSize=${obj.pageSize}`,
        type: 'Get',
        contentType: 'application/json',
        data: JSON.stringify(obj),
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        dataType: 'json',

        success: function (data, status) {

            if (data.code == 200) {
                $("#table2").removeClass("hide")
                $("#noData").removeClass("show")
                $("#page2").removeClass("hide")
                var x = data.data.issueTotal

                $('#example-2').pagination({
                    total: x,
                    current: 1,
                    length: 10,
                    prev: 'Previous',
                    next: 'Next',
                    click: function (options, $target) {
                        let obj = {
                            'page': options.current,
                            'pageSize': options.length,
                            "userId": userId

                        }

                        $.ajax({
                            url: `${host}/api/v1/admin/user/userCredit-List?userId=${obj.userId}&page=${obj.page}&pageSize=${obj.pageSize}`,
                            type: 'Get',
                            contentType: 'application/json',
                            data: JSON.stringify(obj),
                            beforeSend: function (xhr) {
                                xhr.setRequestHeader('Authorization', token);
                            },
                            dataType: 'json',
                            success: function (data, status) {
                                if (data.code == 200) {
                                    $("#issueTable").html(' ');
                                    for (var i = 0; i < data.data.issue.length; i++) {

                                        var index = i + 1 + (obj.pageSize * (obj.page - 1));
                                        document.getElementById('issueTable').innerHTML += '<tr >' +
                                            '<td >' + index + '<td>' + data.data.issue[i].issueId + '<td>' + data.data.issue[i].title +
                                            '<td>' + data.data.issue[i].description + '<td>' + data.data.issue[i].status + '<td>' + data.data.issue[i].role
                                        '<td class="table-dropdown">' +
                                            '<div class="dropdown">' +
                                            '<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                                            '<img src="' + "../../admin/assets/img/moreicon1.png" + '" >  </button > ' +
                                            '<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">' +
                                            // '<a class="dropdown-item"  onclick ="UpdatedataStatus(' + '\'' + data.result[i]._id + '\'' + ')">Active</a>' +

                                            '</div></div>'
                                    }
                                }

                            }

                        })
                        $target.next(".show").text('Current: ' + options.current);

                    }
                })
                $("#issueTable").html(' ');

                for (var i = 0; i < data.data.issue.length; i++) {

                    var index = i + 1
                    document.getElementById('issueTable').innerHTML += '<tr >' +
                        '<td >' + index + '<td>' + data.data.issue[i].issueId + '<td>' + data.data.issue[i].title +
                        '<td>' + data.data.issue[i].description + '<td>' + data.data.issue[i].status + '<td>' + data.data.issue[i].role
                    '<td class="table-dropdown">' +
                        '<div class="dropdown">' +
                        '<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                        '<img src="' + "../../admin/assets/img/moreicon1.png" + '" >  </button > ' +
                        '<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">' +
                        // '<a class="dropdown-item"  onclick ="UpdatedataStatus(' + '\'' + data.result[i]._id + '\'' + ')">Active</a>' +

                        '</div></div>'
                }
            } else {
                $("#table").html(' ');
                $("#table2").addClass("hide");
                $("#noData").addClass("show");
                $("#page2").hide();
            }
        }
    });
}

function scoreDetail() {
    var obj = {
        'page': 1,
        'pageSize': 10,
        "userId": userId
    }
    $.ajax({
        url: `${host}/api/v1/admin/user/viewdetail/${userId}`,
        type: 'Get',
        contentType: 'application/json',
        data: JSON.stringify(obj),
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        dataType: 'json',

        success: function (data, status) {

            if (data.code == 200) {
                $("#table2").removeClass("hide")
                $("#noData").removeClass("show")
                $("#page1").removeClass("hide")
                var x = data.data.response.length

                $('#example-1').pagination({
                    total: x,
                    current: 1,
                    length: 10,
                    prev: 'Previous',
                    next: 'Next',
                    click: function (options, $target) {
                        let obj = {
                            'page': options.current,
                            'pageSize': options.length,
                            "userId": userId

                        }

                        $.ajax({
                            url: `${host}/api/v1/admin/user/viewdetail/${userId}`,
                            type: 'Get',
                            contentType: 'application/json',
                            data: JSON.stringify(obj),
                            beforeSend: function (xhr) {
                                xhr.setRequestHeader('Authorization', token);
                            },
                            dataType: 'json',
                            success: function (data, status) {
                                if (data.code == 200) {
                                    $("#creditTable").html(' ');

                                    var index = 1
                                    if (data.data.response.email == undefined) {
                                        var eMail = "N/A"
                                    } else {
                                        var eMail = data.data.response.email
                                    }
                                    document.getElementById('creditTable').innerHTML += '<tr >' +
                                        '<td >' + index + '<td>' + data.data.response.identity + '<td>' + data.data.response.name + '<td><span>' + eMail + '<span>' + '<br>' + '<span >' + data.data.response.phoneNumber + '<span>' + '<td style="color: #000000; font-weight: 600;">' + creditScore + '<td>' + formatDate(data.data.response.createdAt)
                                    '<td class="table-dropdown">' +
                                        '<div class="dropdown">' +
                                        '<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                                        '<img src="' + "../assets/img/moreicon1.png" + '" >  </button > ' +
                                        '<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">' +
                                        // '<a class="dropdown-item"  onclick ="UpdatedataStatus(' + '\'' + data.result[i]._id + '\'' + ')">Active</a>' +

                                        '</div></div>'

                                }

                            }

                        })
                        $target.next(".show").text('Current: ' + options.current);

                    }
                })
                $("#creditTable").html(' ');

                if (data.data.response.creditScore) {
                    var creditScore = Number(data.data.response.creditScore).toFixed(2)
                } else {
                    var creditScore = Number(0).toFixed(2)
                }
                if (data.data.response.email == undefined) {
                    var eMail = "N/A"
                } else {
                    var eMail = data.data.response.email
                }

                var index = 1
                document.getElementById('creditTable').innerHTML += '<tr >' +
                    '<td >' + index + '<td>' + data.data.response.identity + '<td>' + data.data.response.name + '<td><span>' + eMail + '<span>' + '<br>' + '<span >' + data.data.response.phoneNumber + '<span>' + '<td style="color: #000000; font-weight: 600;">' + creditScore + '<td>' + formatDate(data.data.response.createdAt)
                '<td class="table-dropdown">' +
                    '<div class="dropdown">' +
                    '<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                    '<img src="' + "../assets/img/moreicon1.png" + '" >  </button > ' +
                    '<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">' +
                    // '<a class="dropdown-item"  onclick ="UpdatedataStatus(' + '\'' + data.result[i]._id + '\'' + ')">Active</a>' +

                    '</div></div>'

            } else {
                $("#table").html(' ');
                $("#table2").addClass("hide");
                $("#noData").addClass("show");
                $("#page1").hide();
            }
        }
    });
}

function UpdatedataStatus(user_id) {
    var num = (user_id)
    $(document).on('click', '.dropdown-menu a', function () {
        var a = ($(this).text());
        if (a === 'Active') {
            var updte = 'Active'
        } else if (a == 'Deactive') {
            var updte = 'Deactive'
        } else {
            var updte = 'Delete'
        }

        let obj = {
            "userId": num,
            "status": updte
        };
        swal({
            title: "Are you sure?",
            text: "Ready to Action!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, Take Action!",
            cancelButtonText: "No, leave pls!",
            closeOnConfirm: false,
            closeOnCancel: true
        },
            function (isConfirm) {
                if (isConfirm) {
                    $.ajax({
                        url: host + '/api/v1/admin/userPetUpdateStatus',
                        type: 'Post',
                        contentType: 'application/json',
                        data: JSON.stringify(obj),
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader('Authorization', token);
                        },
                        dataType: 'json',
                        success: function (data, status) {

                            if (data.code == 200) {
                                window.location.reload()
                            } else {
                                alert(data.message)
                            }
                        }
                    });
                } else {
                    swal("Cancelled", "Your file is safe :");
                }
            });

    })
}