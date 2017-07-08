/**
 * Group list datatable.
 *
 * usage: <div id='root'><table id='table'/></div>
 * var datatableOption = {};
 *
 * var groupList = saasure.Widget.GroupList();
 * groupList.initTableOpt(datatableOption);
 *
 * var dtable = $("#table").datatable(datatableOption);
 * 
 *
 */
saasure.Widget.GroupList = function(){
    var self = this;
    var rootElement;
    var nameTemplate = "<span class='logo-{{= appName}} icon icon-24 group-logos-24 float-l' " +
            "title='User membership for this group is managed in {{= appDisplayName}}'></span>" +
            "<a href='/admin/group/{{= id}}'>{{= name}}</a><p>{{= description}}</p>";
    var superUserNameTemplate = "<span class='logo-{{= appName}} icon icon-24 group-logos-24 float-l' " +
        "title='User membership for this group is managed in {{= appDisplayName}}'></span>" +
        "{{= name}}<p>{{= description}}</p>";
    var userCountTemplate = "{{= userCount}}";
    var appCountTemplate = "{{= appCount}}";
    var dirCountTemplate = "{{= dirCount}}";
    
    function formatGroupName(obj, tr, td, index) {
        var tdElm=$(td);
        tdElm.html($.tmpl("nameTemplate", obj));
        tdElm.addClass("grouplist-name");
        tr.id="grouplist-" + obj.id;
    }

    function formatCount(obj, tr, td, index) {
    	var tdElm=$(td);
    	tdElm.html($.tmpl("userCountTemplate", obj));
    	tdElm.addClass("grouplist-usercount");
    }

    function formatApp(obj, tr, td, index) {
    	var tdElm=$(td);
    	tdElm.html($.tmpl("appCountTemplate", obj));
    	tdElm.addClass("grouplist-appcount");
    }

    function formatDir(obj, tr, td, index) {
        var tdElm=$(td);
        tdElm.html($.tmpl("dirCountTemplate", obj));
        tdElm.addClass("grouplist-directorycount");
    }

    function initTableOpt()  {
    	/* Set up templates */
        $.template("superUserNameTemplate", superUserNameTemplate);
        $.template("nameTemplate", nameTemplate);
        $.template("userCountTemplate", userCountTemplate);
        $.template("appCountTemplate", appCountTemplate);
        $.template("dirCountTemplate", dirCountTemplate);

        /* Apply custom classes to table headers */
        $.fn.dataTableExt.oJUIClasses.sSortAsc = "sorted_asc";
        $.fn.dataTableExt.oJUIClasses.sStripOdd = "gradeU";
        $.fn.dataTableExt.oJUIClasses.sStripEven = "gradeU";
        $.fn.dataTableExt.oJUIClasses.sSortDesc = "sorted_desc";

   	
        return (new saasure.DataTables()).serverSide({
            sPaginationType	: 'full_numbers',
            iDisplayLength	: self.options.iDisplayLength,
            aaSorting: [[ 0, 'asc' ]],
            aoColumns: self.options.aoColumns,
            bJQueryUI	 : true,
            bAutoWidth: false,
            sAjaxSource: self.options.sAjaxSource,
            aFormatters: self.options.aFormatters,
            "fnDataComplete": function() {
                $('.data-grid').addClass('data-complete');
            },
            clientSide: self.options.clientSide
       });
}

    /*
     * Public variables
     */
    this.options = {
        clientSide: false,
        sAjaxSource: "/admin/groups/search",
        events: {},
        aoColumns: [
            { sName: "name", iDataSort: 0, sOrderBy: "name", sWidth: "585px", sTitle: "Name"},
            { sName: "userCount", bSortable: false, sWidth: "60px", sTitle: "People"},
            { sName: "appCount", bSortable: false, sWidth: "60px", sTitle: "Apps"},
            { sName: "dirCount", bSortable: false, sWidth: "60px", sTitle: "Directories"},
            { sName: "id", bVisible: false },
            { sName: "appName", bVisible: false },
            { sName: "appDisplayName", bVisible: false },
            { sName: "description", bVisible: false }
        ],
        aFormatters: {
            name : formatGroupName,
            userCount : formatCount,
            appCount : formatApp,
            dirCount : formatDir
        },
        iDisplayLength: 50
    };

    /*
     * Public functions
     */
    this.initTableOpt = initTableOpt;


    return this;
};
