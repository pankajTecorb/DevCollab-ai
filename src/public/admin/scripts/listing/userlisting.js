//********Date picker******/
var jqOld = jQuery.noConflict();
jqOld(function () {
    jqOld("#fromDate").datepicker({
        dateFormat: 'yy-mm-dd'
    });
})
var jqOld = jQuery.noConflict();
jqOld(function () {
    jqOld("#toDate").datepicker({
        dateFormat: 'yy-mm-dd'
    });
})



//*********Listing Table Data**************/

function catDetails() {
    this.setTimeout(() => {
        document.getElementById('user-nav')?.classList.add("active");
    })
    var obj = {
        'page': 1,
        'pageSize': 10,
        'search': document.getElementById('fog').value,
        'toDate': document.getElementById('toDate').value,
        'fromDate': document.getElementById('fromDate').value
    }
  $('#ibox1').children('.ibox-content').toggleClass('sk-loading');
    $.ajax({
        url: `${host}/api/v1/admin/user/list?search=${obj.search}&fromDate=${obj.fromDate}&toDate=${obj.toDate}`,
        type: 'GET',
        contentType: 'application/json',
        data: JSON.stringify(obj),
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        dataType: 'json',
        success: function (data, status) {
            if (data.code == 200) {
                $('#ibox1').children('.ibox-content').toggleClass('sk-loading');
            }
            if (data.data.Total == 0 && data.code == 200) {
                $("#noData").addClass("show");
            }
            if (data.code == 200 && data.data.Total > 0) {
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
                            'search': document.getElementById('fog').value,
                            'toDate': document.getElementById('toDate').value,
                            'fromDate': document.getElementById('fromDate').value
                        }

                        $('#ibox1').children('.ibox-content').toggleClass('sk-loading');
                        $.ajax({
                            url: `${host}/api/v1/admin/user/list?search=${obj.search}&fromDate=${obj.fromDate}&toDate=${obj.toDate}&page=${obj.page}&pageSize=${obj.pageSize}`,
                            type: 'GET',
                            contentType: 'application/json',
                            data: JSON.stringify(obj),
                            beforeSend: function (xhr) {
                                xhr.setRequestHeader('Authorization', token);
                            },
                            dataType: 'json',
                            success: function (data, status) {
                                if (data.code == 200) {
                                    $('#ibox1').children('.ibox-content').toggleClass('sk-loading');
                                    $("#table").html(' ');
                                    for (var i = 0; i < data.data.response.length; i++) {

                                        if (data.data.response[i].status == true) {
                                            var x = 'Deactive'
                                            var y = 'Active'
                                        } else {
                                            var x = 'Active'
                                            var y = 'Deactive'
                                        }
                                        if (data.data.response[i].businessName == undefined) {
                                            var business = "-"
                                        } else {
                                            var business = data.data.response[i].businessName
                                        }
                                        if (data.data.response[i].isAutomate == true) {
                                            var agreement = '<button type="button" class="btn btn-sm btn-warning" style="margin: 5px;"     onclick= agreement(' + '\'' + data.data.response[i]._id + '\'' + ')>' + 'Agreement' + '</button>'
                                        } else {
                                            var agreement = ''
                                        }
                                        var index = i + 1 + (obj.pageSize * (obj.page - 1));
                                        document.getElementById('table').innerHTML += '<tr >' +
                                            '<td >' + index + '<td><span>' + business + '<span>' + '<br>' + '<span style="color: #000000; font-weight: 600;">' + capitalize(data.data.response[i].name) + '</span>' + '<td><span>' + data.data.response[i].email + '<span>' + '<br>' + '<span style="color: #000000; font-weight: 600;">' + data.data.response[i].phoneNumber + '</span>' +
                                            '<td>' + data.data.userCounts[i].userPicupAddressCount + '<td>' + data.data.userCounts[i].userDropAddressCount + '<td>' + data.data.userCounts[i].userBookingCount + '<td>' + formatDate(data.data.response[i].createdAt) +
                                            '<td><span class="label label-primary">' + y +
                                            '<td> <button type="button" class="btn btn-sm btn-success" id="Action_button" style="margin: 5px;"  data-target="' + data.data.response[i].status + '" onclick= "update(' + '\'' + data.data.response[i]._id + '\'' + ')">' + x + '</button>' +
                                            // '<button type="button" class="btn btn-sm btn-danger" id="Action_button" style="margin: 5px;" onclick= del(' + '\'' + data.data.response[i]._id + '\'' + ')>' + 'Delete   ' + '</button>' +
                                            '<button type="button" class="btn btn-sm btn-info" style="margin: 5px;"  data-toggle="modal" data-target="#myModal2"    onclick= View(' + '\'' + data.data.response[i]._id + '\'' + ')>' + 'Edit' + '</button>' +
                                            '<button type="button" class="btn btn-sm btn-warning" style="margin: 5px;"     onclick= profile(' + '\'' + data.data.response[i]._id + '\'' + ')>' + 'View' + '</button>' + agreement + '</tr>'


                                    }
                                }

                            }

                        })
                        $target.next(".show").text('Current: ' + options.current);

                    }
                })
                $("#table").html(' ');
                for (var i = 0; i < data.data.response.length; i++) {
                    for (var i = 0; i < data.data.userCounts.length; i++) {

                        if (data.data.response[i].businessName == undefined) {
                            var business = "-"
                        } else {
                            var business = data.data.response[i].businessName
                        }

                        if (data.data.response[i].status == true) {
                            var x = 'Deactive'
                            var y = 'Active'
                        } else {
                            var x = 'Active'
                            var y = 'Deactive'
                        }
                        if (data.data.response[i].isAutomate == true) {
                            var agreement = '<button type="button" class="btn btn-sm btn-warning" style="margin: 5px;"     onclick= agreement(' + '\'' + data.data.response[i]._id + '\'' + ')>' + 'Agreement' + '</button>'
                        } else {
                            var agreement = ''
                        }
                        var index = i + 1
                        document.getElementById('table').innerHTML += '<tr >' +
                            '<td >' + index + '<td><span>' + business + '<span>' + '<br>' + '<span style="color: #000000; font-weight: 600;">' + capitalize(data.data.response[i].name) + '</span>' + '<td><span>' + data.data.response[i].email + '<span>' + '<br>' + '<span style="color: #000000; font-weight: 600;">' + data.data.response[i].phoneNumber + '</span>' +
                            '<td>' + data.data.userCounts[i].userPicupAddressCount + '<td>' + data.data.userCounts[i].userDropAddressCount + '<td>' + data.data.userCounts[i].userBookingCount + '<td>' + formatDate(data.data.response[i].createdAt) +
                            '<td><span class="label label-primary">' + y +
                            '<td> <button type="button" class="btn btn-sm btn-success" id="Action_button" style="margin: 5px;"  data-target="' + data.data.response[i].status + '" onclick= "update(' + '\'' + data.data.response[i]._id + '\'' + ')">' + x + '</button>' +
                            // '<button type="button" class="btn btn-sm btn-danger" id="Action_button" style="margin: 5px;" onclick= del(' + '\'' + data.data.response[i]._id + '\'' + ')>' + 'Delete   ' + '</button>' +
                            '<button type="button" class="btn btn-sm btn-info" style="margin: 5px;"  data-toggle="modal" data-target="#myModal2"    onclick= View(' + '\'' + data.data.response[i]._id + '\'' + ')>' + 'Edit' + '</button>' +
                            '<button type="button" class="btn btn-sm btn-warning" style="margin: 5px;"     onclick= profile(' + '\'' + data.data.response[i]._id + '\'' + ')>' + 'View' + '</button>' + agreement + '</tr>'

                    }
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

//**********Satus Update***************/

function update(user_id) {
    var userId = (user_id)
    $(document).on('click', "#Action_button", function () {
        var a = ($(this).text());
        if (a === 'Active') {
            var status = true
        } else {
            var status = false
        }
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
                        type: "PUT",
                        data: { status, userId },
                        dataType: 'json',
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader('Authorization', token);
                        },
                        url: `${host}/api/v1/admin/user/status/${userId}`,
                    }).done(function (data) {
                        // If successful
                        // alert("Success")
                        window.location.reload();
                    }).fail(function (jqXHR, textStatus, errorThrown) {
                        // If fail
                        alert(jqXHR.responseJSON.error)

                    })
                } else {
                    swal("Cancelled", "Your file is safe :");
                }
            });

    })
}


//********User Profile*********/
function profile(user_id) {
    window.location.href = host + "/admin/userView?id=" + user_id + '&role=' + "Customer";
}
//**********User Agreement********* */
function agreement(user_id) {
    window.location.href = host + "/admin/userAgreement?id=" + user_id
}

//***********User Tel Picker****** */
function mobileNoselect() {
    // let x = document.forms["form"]["countryCode"].value;
    if ($('#form1').length) {
        $(".mobile").intlTelInput();
        $(".mobile").intlTelInput("setNumber", "+91");

    };
};

setTimeout(mobileNoselect, 200);
//* Select js
function nice_Select() {
    if ($('.product_select').length) {
        $('select').niceSelect();
    };
};
// Function Calls* 
// verificationForm ();
mobileNoselect();
nice_Select()

//*************Edit Function********** */
function updateReason() {
    var name = document.getElementById('name1').value;
    var businessName = document.getElementById('businessName').value;
    var email = document.getElementById('email1').value;
    var countryCode = document.getElementById('countryCode').value;
    var phoneNumber = document.getElementById('mobile').value;
    var gstNumber = document.getElementById('gstNumber').value;
    var status = document.getElementById('status1').value;
    var isAutomate = document.getElementById('types').value;
    var userId = document.getElementById('userId').value;

    $.ajax({
        type: "PUT",
        data: { name, businessName, email, countryCode, phoneNumber, gstNumber, status, isAutomate },
        dataType: 'json',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        url: `${host}/api/v1/admin/user/${userId}/edit`,
    }).done(function (data) {
        // If successful
        // alert("Success")
        window.location.reload('/user');
    }).fail(function (jqXHR, textStatus, errorThrown) {
        // If fail
        alert(jqXHR.responseJSON.error)

    })
}
//************Details View functions************ */

function View(user_id) {
    var userId = user_id

    $.ajax({
        type: "get",
        data: { userId },
        dataType: 'json',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        url: `${host}/api/v1/admin/user/detail/${user_id}`,
    }).done(function (data) {
        // If successful
        document.getElementById('name1').value = data.data.name ? data.data.name : "N/A",
            document.getElementById('businessName').value = data.data.businessName ? data.data.businessName : "N/A",
            document.getElementById('email1').value = data.data.email ? data.data.email : "N/A";
        document.getElementById('mobile').value = data.data.phoneNumber ? data.data.phoneNumber : "N/A";
        document.getElementById('countryCode').value = data.data.countryCode ? data.data.countryCode : "N/A";
        document.getElementById('gstNumber').value = data.data.gstNumber ? data.data.gstNumber : "N/A";
        document.getElementById('status1').value = data.data.status;
        document.getElementById('types').value = data.data.isAutomate;
        // document.getElementById('blah1').src = data.data.image ? data.data.image:"../../admin/assets/img/emptyphoto.png";
        document.getElementById('userId').value = data.data._id


    }).fail(function (jqXHR, textStatus, errorThrown) {
        // If fail
        // alert(jqXHR.responseJSON.error)
        alert("Data Not Found")
        window.location.reload()

    })

}

//*********Capital title***********/
function capitalize(input) {
    return input.toLowerCase().split(' ').map(s => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
}

//**********Date Format**********/

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

    return [day, monthNames[month - 1], year].join('-');
}


function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#blah')
                .attr('src', e.target.result)
                .width(200)
                .height(200);
        };

        reader.readAsDataURL(input.files[0]);
    }
}

function readURL1(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#blah1')
                .attr('src', e.target.result)
                .width(200)
                .height(200);
        };

        reader.readAsDataURL(input.files[0]);
    }
}

// *****************Export Excel File of user Data Function*****
function convertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','

            line += array[i][index];
        }

        str += line + '\r\n';
    }

    return str;
}

function exportCSVFile(headers, items, fileTitle) {
    if (headers) {
        items.unshift(headers);
    }

    // Convert Object to JSON
    var jsonObject = JSON.stringify(items);

    var csv = this.convertToCSV(jsonObject);

    var exportedFilenmae = fileTitle + '.csv' || 'export.csv';

    var blob = new Blob([csv], {
        type: 'text/csv;charset=utf-8;'
    });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", exportedFilenmae);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}


function download() {
    //let type = document.getElementById('opts').value;
    var type = 'Customer'
    $.get(host + '/api/v1/admin/user/user-excelData?type=Customer', {


    }, function (data, status) {
        if (data) {
            var headers = {

                identity: "ID Number",
                name: "Full Name",
                email: "Email",
                countryCode: "Country Code",
                phoneNumber: 'Mobile',
                // dob: 'D.O.B',
                // createdAt: 'Joining Date',
                image: 'Profile Image',

            };

            itemsNotFormatted = data.data;

            var fileTitle = 'users'; // or 'my-unique-title'

            exportCSVFile(headers, itemsNotFormatted, fileTitle); // call the exportCSVFile() function to process the JSON and trigger the download
        }
    })
}

 //*****************Search bar not empty******************/
function fogData() {
    var fog = document.getElementById('fog').value
    var fromDate = document.getElementById('fromDate').value
    var toDate = document.getElementById('toDate').value
    if (fromDate && toDate) {
        if (fromDate > toDate) {
            alert(" To Date should be after From Date")
            return
        }
    }
    if (fog && fromDate && toDate) {
        catDetails()
        return
    }
    if (fog) {
        if (!fog) {
            alert("Please Write Something in Search bar")
            return
        } else {
            catDetails()
            return
        }
    } else {
        if (!fromDate) {
            alert("Please Select From Date")
            return
        } else {
            if (!toDate) {
                alert("Please Select To Date")
                return
            } else {
                catDetails()
                return
            }
        }
    }

}