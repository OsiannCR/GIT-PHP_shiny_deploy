(function() {
    'use strict';

    angular
        .module('shinyDeploy')
        .factory('auth', auth);

    auth.$inject = ['ws', '$location', 'jwtHelper'];

    /* @ngInject */
    function auth(ws, $location, jwtHelper) {

        var service = {
            init: init,
            login: login,
            setToken: setToken
        };

        return service;

        var isAuthenticated = false;

        function init() {
            checkAuth();
        }

        function checkAuth() {
            if (!validateToken()) {
                $location.path('/login');
                return false;
            }
            isAuthenticated = true;
            return true;
        }

        /**
         * Validates the JWT.
         *
         * @returns {Boolean}
         */
        function validateToken() {

            // check if token exists:
            var token = getToken();
            if (token === null) {
                $location.path('/login');
                return false;
            }

            // check if token is expired:
            if (jwtHelper.isTokenExpired(token)) {
                $location.path('/login');
                return false;
            }

            // check client-id and issuer:
            var clientId = sessionStorage.getItem('uuid');
            var tokenDecoded = jwtHelper.decodeToken(token);
            if (!tokenDecoded.hasOwnProperty('iss') || tokenDecoded.iss !== 'ShinyDeploy') {
                return false;
            }
            if (!tokenDecoded.hasOwnProperty('jti') || tokenDecoded.jti !== clientId) {
                return false;
            }

            return true;
        }

        function login(password) {
            var requestParams = {
                password: password
            };
            return ws.sendDataRequest('login', requestParams);
        }

        function setToken(token) {
            sessionStorage.setItem('token', token);
        }

        function getToken() {
            return sessionStorage.getItem('token');
        }
    }
})();