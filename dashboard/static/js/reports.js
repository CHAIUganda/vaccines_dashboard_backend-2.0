$(document).ready(function() {
    $("#main-report").DataTable({
        info: false,
        paging: true,
        filter: false,
        sort: false,
        bLengthChange: false,
        fixedColumns: {
            leftColumns: 4
        },
        scrollY: 500,
        scrollX: true
    });
});