var GroupHome=function(groupId, lazyLoading) {
    var self=this;
    var bulkAssignSupport;
    var dtable;
    var grouplib = new GroupLib();

    function showSpinner() {
        $("div.groups-spinner").show();
    }

    function hideSpinner() {
        $("div.groups-spinner").hide();
    }

    function disableSubmitButtons() {
        $("input.edit-app-submit-link").prop("disabled", true);
    }

    function enableSubmitButtons() {
        $("input.edit-app-submit-link").prop("disabled", false);
    }

    function createUserTable() {
        var userList = new saasure.Widget.UserList();
        userList.options.columns["user.email"].visible = false;
        userList.options.statusTemplate = "{{= status.statusLabel}}";
        userList.options.useManagedBy = true;

        var opt = userList.initTableOpt();

        opt.urlParam = function() {
            return {groupId:groupId};
        };
        opt.oLanguage = { "sEmptyTable" : "No members found" };

        dtable = $('#group-members').dataTable(opt);

    }

    function createAppList() {
        $('.edit-app-link').live("click", function(e) {
            e.preventDefault();

            var instanceId = this.id.split("-").pop();
            var propertiesElm = $("#edit-app-div-" + instanceId);
            var doneLinkElm = $("#edit-app-link-done-" + instanceId);
            var linkElm = $("#edit-app-link-" + instanceId);

            propertiesElm.show();
            linkElm.hide();
            doneLinkElm.show();

            if (lazyLoading) {
              var instanceItem = $('#' + instanceId);
              var appName = instanceItem.attr('class').split(' ').pop();
              var addAppInstanceGroup = instanceItem.find('div[id^="add-app-instance-group-"]');
              var groupAssignmentId = addAppInstanceGroup.attr('id').split('-').pop();

              addAppInstanceGroup.load('/app/' + appName + '/user/group_app_assignment/' + instanceId + '/' +
                groupAssignmentId, function () {
                AjaxForm.bind_events();
              });
            }
        });

        $('.edit-app-submit-link').live("click", function(e) {
            e.preventDefault();

            disableSubmitButtons();
            showSpinner();

            var instanceId = this.id.split("-").pop();
            var propertiesElm = $("#edit-app-div-" + instanceId);
            var doneLinkElm = $("#edit-app-link-done-" + instanceId);
            var linkElm = $("#edit-app-link-" + instanceId);

            var assignments = {};
            assignments[instanceId] = grouplib.createAssignments(instanceId);

            var data = {
                assignments: assignments
            };

            var errorMsgs = {
                'blank': "The field cannot be left blank",
                'app.ldap.invalidDn': "The Provisioning Destination DN is invalid. The specified Distinguished Name must be RFC2253 compliant."
            }

            $.postJson({
                url: "/admin/group/" + groupId + "/editApp",
                data: data,
                success: function(response) {
                    $(".error").hide();
                    var displayError = false;
                    if (!$.isEmptyObject(response.fielderrors)) {
                        var errorBulletList = $("#" + response.instanceId + "\\.edit\\.errors").find(".bullets");
                        errorBulletList.empty();
                        var fieldErrors = response.fielderrors;
                        var form = $("#" + response.instanceId + "\\.edit\\.form");
                        $.each(fieldErrors, function(prop, val) {
                            var label = form.find("label[for=" + prop + "]");
                            label.children().first().addClass("error-field");
                            var field = label.parent().siblings().text().trim();
                            var errorText = val;
                            errorBulletList.append("<li>" + field + ": " + errorText + "</li>");
                            displayError = true;
                        });
                        if (displayError) {
                            errorBulletList.parent().show();
                        }
                    }
                    if (!displayError) {
                        propertiesElm.hide();
                        doneLinkElm.hide();
                        linkElm.show();
                    }
                    enableSubmitButtons();
                    hideSpinner();
                }
            });
        });
    }

    function createTabs() {
    	if ($("#group-tabs")) {
    		var tab = window.tab = new saasure.Widget.Tab();
    		tab.create("#tabs", "#tab-content");
    		saasure.done("done", $("body"));
    	}
    }

    function bindEvents() {
        $("#group_info\\.cancel_link").live("click", function(e) {
            e.preventDefault();
            AjaxForm.cancel_edit("group_info");
        });
        $("#group_info\\.confirm_link").live("click", function(e) {
            e.preventDefault();
            AjaxForm.submit("group_info");
        });

        $("#manage-members").live("click", function(e) {
        	e.preventDefault();
        	$.postJson({
        		url: "/admin/group/" + groupId + "/workingSet",
        		success: function(response) {
        			window.location = "/admin/group/" + groupId + "/workingSet/" + response.workingSetId;
        		}
        	});
        });

        $("#manage-directories").live("click", function(e) {
            e.preventDefault();
            $.postJson({
                url: "/admin/group/" + groupId + "/workingSetApps",
                success: function(response) {
                    window.location = "/admin/group/" + groupId + "/workingSetApps/" + response.workingSetId + "/directories";
                }
            });
        });

        $("#delete-group-ok-button").live("click", function(e) {
            $.postJson({
                url: "/admin/group/" + groupId + "/delete",
                success: function() {
                    var form = $('#delete-group-form');
                    form.submit();
                }
            });
        });

        $("#delete-group-cancel-button").live("click", function(e) {
            ModalDialog.close();
        });

        ModalDialog.launchModalOnClick('#delete-group', '#delete-group-modal', { minWidth: 450, keepOpen: true });
    }

    this.init = function() {
        createUserTable();
        createAppList();
        bindEvents();
        createTabs();
    };
};
