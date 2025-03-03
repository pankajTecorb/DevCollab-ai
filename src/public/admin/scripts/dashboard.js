function Details() {
    $('#ibox1').children('.ibox-content').toggleClass('sk-loading');
    this.setTimeout(() => {
        document.getElementById('dashboard-nav')?.classList.add("active");
    })
    $.ajax({
        url: `${host}/api/v1/admin/dashboard/count`,
        type: 'GET',
        contentType: 'application/json',
        // data: JSON.stringify(obj),
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        dataType: 'json',

        success: function (data, status) {
            $('#ibox1').children('.ibox-content').toggleClass('sk-loading');

            if (data.code == 200) {
                document.getElementById('user').innerHTML = data.data.User;
                document.getElementById('vendor').innerHTML = data.data.Vendor;
                document.getElementById('BookingComplete').innerHTML = data.data.BookingComplete;
                document.getElementById('BookingInProgress').innerHTML = data.data.BookingInProgress;

            } else {
                alert("Something Wrong, Try again")
            }

            if (data.data.NewVendor) {
                //***************Table For New Vendor************ */
                for (var i = 0; i < data.data.NewVendor.length; i++) {
                    var index = i + 1;
                    if (data.data.NewVendor[i].quotationsCount == 0) {
                        var quotes = '<span class="label label-warning">' + 0 + '</span>'
                    } else {
                        var quotes = '<span class="label label-info">' + data.data.NewVendor[i].quotationsCount + '</span>'
                    }
                    if (data.data.NewVendor[i].resorcesCount == 0) {
                        var resource = '<span class="label label-warning">' + 0 + '</span>'
                    } else {
                        var resource = '<span class="label label-info">' + data.data.NewVendor[i].resorcesCount + '</span>'
                    }
                    if (data.data.NewVendor[i].name) {
                        var name = '<a  href="#"   onclick= profile(' + '\'' + data.data.NewVendor[i]._id + '\'' + ')>' + capitalize(data.data.NewVendor[i].name) + '</a>'

                    } else {
                        var name = "N/A"
                    }
                    document.getElementById('tableVendor').innerHTML += '<tr >' +
                        '<td>' + formatDate(data.data.NewVendor[i].createdAt) + '<td>' + name +
                        '<td >' + quotes + '<td>' + resource + '</tr>'


                }
            }

            if (data.data.NewUser) {
                //***************Table For New Customer************ */
                for (var i = 0; i < data.data.NewUser.length; i++) {
                    var index = i + 1;
                    if (data.data.NewUser[i].quotationsCount == 0) {
                        var quotes = '<span class="label label-warning">' + 0 + '</span>'
                    } else {
                        var quotes = '<span class="label label-info">' + data.data.NewUser[i].quotationsCount + '</span>'
                    }
                    if (data.data.NewUser[i].identity == undefined) {
                        var identity = "-"
                    } else {
                        var identity = data.data.NewUser[i].identity
                    }
                    if (data.data.NewUser[i].name) {
                        var name = '<a  href="#"  onclick= profile(' + '\'' + data.data.NewUser[i]._id + '\'' + ') >' + capitalize(data.data.NewUser[i].name) + '</a>'

                    }
                    document.getElementById('tableCustomer').innerHTML += '<tr >' +
                        '<td>' + identity + '<td>' + name + '<td >' + formatDate(data.data.NewUser[i].createdAt) +
                        '<td >' + quotes + '</tr>'

                }
            }

            if (data.data.CustomerQuotes) {
                //***************Table For New Quotation By Customer************ */
                for (var i = 0; i < data.data.CustomerQuotes.length; i++) {
                    var index = i + 1;
                    if (data.data.CustomerQuotes[i].identity == undefined) {
                        var identity = "-"
                    } else {
                        var identity = '<span class="label label-warning">' + data.data.CustomerQuotes[i].identity + '</span>'
                    }
                    if (data.data.CustomerQuotes[i].PicupAddress[0]) {
                        var PicupCity = data.data.CustomerQuotes[i].PicupAddress[0].city
                    } else {
                        var PicupCity = "N/A"
                    }
                    if (data.data.CustomerQuotes[i].DropAddress[0]) {
                        var DropCity = data.data.CustomerQuotes[i].DropAddress[0].city
                    } else {
                        var DropCity = "N/A"
                    }
                    if (data.data.CustomerQuotes[i]._id) {
                        var quoteView = '<button type="button" class="btn btn-sm btn-info ml-1" id="Action_button" style="margin: 5px;color:black" onclick= "quotationView(' + '\'' + data.data.CustomerQuotes[i]._id + '\'' + ' ) ">' + '<i class="fa fa-eye"></i>' + '</button>'

                    } if (data.data.CustomerQuotes[i].Users[0]) {
                        var userName = data.data.CustomerQuotes[i].Users[0].name
                    } else {
                        var userName = "N/A"
                    }
                    document.getElementById('tableWaitingQuotation').innerHTML += '<tr >' +
                        '<td>' + identity + '<td>' + capitalize(userName) +
                        '<td><span>' + PicupCity + '  ' + 'To' + '<span>' + '<br>' + '<span >' + DropCity + '</span>' +
                        '<td>' + data.data.CustomerQuotes[i].Vehicles[0].title + '<td><span>' + data.data.CustomerQuotes[i].pickupTime + '<span>' + '<br>' + '<span >' + data.data.CustomerQuotes[i].pickupDate + '</span>' + '<td >' + quoteView + '</tr>'


                }
            }
            if (data.data.VendorQuotes) {
                //***************Table For New Quotation By Vendor************ */
                for (var i = 0; i < data.data.VendorQuotes.length; i++) {
                    var index = i + 1;
                    if (data.data.VendorQuotes[i].amount == 0) {
                        var amount = '<span class="label label-warning">' + Number(0).toFixed(2) + '  ' + 'Rs.' + '</span>'
                    } else {
                        var amount = '<span class="label label-info">' + Number(data.data.VendorQuotes[i].amount).toFixed(2) + ' ' + 'Rs.' + '</span>'
                    }
                    if (data.data.VendorQuotes[i].vendorQuote[0]._id) {
                        var quoteView = '<button type="button" class="btn btn-sm btn-info ml-1" id="Action_button" style="margin: 5px;color:black" onclick= "quotationView(' + '\'' + data.data.VendorQuotes[i].vendorQuote[0]._id + '\'' + ' ) ">' + '<i class="fa fa-eye"></i>' + '</button>'

                    }
                    if (data.data.VendorQuotes[i].vendorName.length == 0) {
                        var vName = "N/A"
                    } else {
                        var vName = capitalize(data.data.VendorQuotes[i].vendorName[0].name);
                    }
                    document.getElementById('tableQuotation').innerHTML += '<tr >' +
                        '<td>' + index + '<td>' + vName + '<td>' + data.data.VendorQuotes[i].identity +
                        '<td >' + amount + '<td >' + quoteView + '</tr>'

                }
            }


        }
    });
}


//***********Category Wise Vendor******** */

function categoryWiseVendor() {
    $.ajax({
        url: host + '/api/v1/admin/dashboard/vendorCategroyWise',
        type: 'GET',
        contentType: 'application/json',
        // data: JSON.stringify({ "type": type}),
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        dataType: 'json',
        success: function (data) {
            if (data.code == 200) {
                var data1 = data.data
                c3.generate({
                    bindto: '#pie',
                    data: {
                        columns: data1,
                        type: 'pie'
                    }
                });
            }
        }
    })
}

//********Vendor Profile*********/
function profile(user_id) {
    window.location.href = host + "/admin/userView?id=" + user_id
}

//********Quotation Views*********/
function quotationView(user_id) {
    window.location.href = host + "/admin/VendorList?id=" + user_id
}

//*********Capital title***********/
function capitalize(input) {
    return input.toLowerCase().split(' ').map(s => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
}
//***********Date Function************* */
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