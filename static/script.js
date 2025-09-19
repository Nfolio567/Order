"use strict";
window.addEventListener('DOMContentLoaded', () => {
    const headerBack = document.getElementById("headerBack");
    headerBack === null || headerBack === void 0 ? void 0 : headerBack.classList.add(location.pathname.substring(1));
});
