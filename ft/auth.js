var application = {
    url: "http://localhost:8000"
};

var loginPage = {
    body: "body",
    username: "input[name=username]",
    password: "input[name=password]",
    loginButton: "button.btn",
    logoutLink: "a.logout",
    loginLink: "a.login"
};
var homePage = {
    usersLink: "li#top-menu-users>a"
};
var login = function(browser) {
    return browser.waitForElementVisible(loginPage.loginLink, 1000)
        .click(loginPage.loginLink)
        .setValue(loginPage.username, "a@a.com")
        .setValue(loginPage.password, "a")
        .waitForElementVisible(loginPage.loginButton, 1000)
        .click(loginPage.loginButton)
        .waitForElementVisible(loginPage.logoutLink, 1000)
        .assert.containsText(".container", "LOGOUT");
};

module.exports = {
    "Login": function(browser) {
        browser.url(application.url);
        login(browser);
    },
    "Logout": function(browser) {
        browser
            .waitForElementVisible(loginPage.logoutLink, 1000)
            .click(loginPage.logoutLink)
            .waitForElementVisible(loginPage.loginLink, 1000);
    },
    "List Users": function(browser) {
        login(browser)
            .waitForElementVisible(homePage.usersLink, 1000)
            .click(homePage.usersLink)
            .end();
    }
};