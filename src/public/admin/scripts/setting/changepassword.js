
function changePassword() {
    this.setTimeout(() => {
        document.getElementById('changepassword-nav')?.classList.add("active");
    })
    var oldpassword = document.getElementById('oldpass').value;
    var newpassword = document.getElementById('password').value;
    var cpassword = document.getElementById('cpassword').value;
    if (newpassword !== cpassword) {
        swal({
            title: "Error",
            text: "Confirm Password should be same as new password"
        });
    } else if (newpassword === oldpassword) {
        swal({
            title: "Error",
            text: "New Password should not be same as old password"
        });
    } else if (!newpassword && !oldpassword) {
        swal({
            title: "Error",
            text: "Please Fill Password"
        });
    }
    else {
        let obj = {
            "password": oldpassword,
            "newPassword": newpassword
        }
        $.ajax({
            url: host + '/api/v1/admin/auth/change-password',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(obj),
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', token);
            },
            dataType: 'json',
            success: function (data, status) {

            }
        })
            .done(function (data) {
                if (data.code == 200) {
                    swal({
                        title: "Success",
                        text: "You have changed Password Successfully ! redirecting you to login page...",
                        type: "success"
                    });
                    localStorage.removeItem("name");
                    localStorage.removeItem("token");
                    setTimeout(() => {
                        window.location.replace('/login');
                    }, 2000)
                }
            }).fail(function (jqXHR, textStatus, errorThrown) {
                swal({
                    title: "Error!",
                    text: `${jqXHR.responseJSON.error}`
                });
            })
    }
}

//**********Button Disable Untill Confirm Password not filled*************** */
function success() {
    if (document.getElementById("cpassword").value === "") {
        document.getElementById('button').disabled = true;
    } else {
        document.getElementById('button').disabled = false;
    }
}

