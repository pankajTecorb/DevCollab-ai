function getValue() {
    this.setTimeout(() => {
        document.getElementById('app-nav')?.classList.add("active");
    })
    $.ajax({
        url: host + '/api/v1/admin/setting/detail',
        type: 'Get',
        // data: formData,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        contentType: false,
        processData: false,
        success: function (data, status) {
            if (data.code == 200) {
                document.getElementById('user_A').value = data.data.andriodUserVersion;
                document.getElementById('user_Ios').value = data.data.iosUserVersion;
                document.getElementById('vendor_A').value = data.data.andriodVendorVersion;
                document.getElementById('Ios_V').value = data.data.iosVendorVersion;
                document.getElementById('opts').value = data.data.andriodUserUpdate;
                document.getElementById('opts1').value = data.data.iosUserUpdate;
                document.getElementById('opts2').value = data.data.andriodVendorUpdate;
                document.getElementById('opts3').value = data.data.iosVendorUpdate;
                document.getElementById('driverAV').value = data.data.andriodDriverVersion;
                document.getElementById('driverIosV').value = data.data.iosDriverVersion;
                document.getElementById('driverAU').value = data.data.andriodDriverUpdate;
                document.getElementById('driverIosU').value = data.data.iosDriverUpdate;
                document.getElementById('adminCommision').value = data.data.adminCommision
                document.getElementById('quotationExpireTime').value = data.data.quotationExpireTime
                document.getElementById('updatedAt').value = formatDate(data.data.updatedAt)
                document.getElementById('updatedAt1').value = formatDate(data.data.updatedAt)
            } else {
                alert("Something Wrong Try Again")
            }
        }
    });
}




function update() {
    var A_user = document.getElementById('user_A').value;
    var I_user = document.getElementById('user_Ios').value;
    var A_vendor = document.getElementById('vendor_A').value;
    var I_vendor = document.getElementById('Ios_V').value;
    var Auser_updt = document.getElementById('opts').value;
    var Iuser_updt = document.getElementById('opts1').value;
    var Avendor_updt = document.getElementById('opts2').value;
    var Ivendor_updt = document.getElementById('opts3').value;
    var andriodDriverVersion = document.getElementById('driverAV').value;
    var andriodDriverUpdate = document.getElementById('driverAU').value;
    var iosDriverVersion = document.getElementById('driverIosV').value;
    var iosDriverUpdate = document.getElementById('driverIosU').value;
    var adminCommision = document.getElementById('adminCommision').value;
    var quotationExpireTime = document.getElementById('quotationExpireTime').value;
    var obj = {
        "andriodUserVersion": A_user,
        "andriodVendorVersion": A_vendor,
        "iosUserVersion": I_user,
        "iosVendorVersion": I_vendor,
        'andriodUserUpdate': Auser_updt,
        'andriodVendorUpdate': Avendor_updt,
        'iosUserUpdate': Iuser_updt,
        'iosVendorUpdate': Ivendor_updt,
        'andriodDriverVersion': andriodDriverVersion,
        'andriodDriverUpdate': andriodDriverUpdate,
        'iosDriverVersion': iosDriverVersion,
        'iosDriverUpdate': iosDriverUpdate,
        'adminCommision': adminCommision,
        'quotationExpireTime': quotationExpireTime
    }

    $.ajax({
        url: host + '/api/v1/admin/setting/edit',
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(obj),
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', token);
        },
        dataType: 'json',
        success: function (data, status) {
            if (data.code == 200) {

                window.location.reload();
            } else {
                alert("Something Wrong Try Again");
            }
        }
    })
}


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
