
var AddGroupController= function() {
    var dtable;

    function setupCreateGroupDialog(){
        if ($("#create-group-dialog").length == 0) return; //user has no permission to create groups

        ModalDialog.launchModalOnClick('#add-group', '#create-group-dialog', { minWidth: 450, keepOpen: true });

        $("#add-group-button").click(function(){
        	saveGroup(true);
        });

        $("#add-group-no-close-button").click(function(){
        	saveGroup(false);
        });
    }

    function saveGroup(close) {
        AjaxForm.submit("newgroup", {callback:function(success, id, response_json){
            if (success){
            	if (close) {
            		ModalDialog.close();
            	}
            	dtable.fnDraw();
            }
        }});
    }

    this.init=function(dtableArg){
        dtable=dtableArg;

        setupCreateGroupDialog();
    };
};


var AdminGroupListPageController = function() {
    var dtable;

    this.init=function(){

        var groupList = new saasure.Widget.GroupList();
        var opt = groupList.initTableOpt();

        dtable = $('.data-grid').dataTable(opt);

        var dropDown=new saasure.Widget.DropDown();
        dropDown.options={
            showCheckSign: false,
            events:{
                onSelected:null
            }
        };
        dropDown.create();

        var addGroupController=new AddGroupController();
        addGroupController.init(dtable);

        setTimeout(function() {
        	$("#deleteMessage").fadeOut("slow");
        }, 5000);

    };
};

