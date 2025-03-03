function logout() {
    localStorage.removeItem("name");
    localStorage.removeItem("token");
    unSubscribeFromTopic("admin_web_app_development")
    setTimeout(() => {
        window.location.replace('/admin/login');
    }, 1000)
}