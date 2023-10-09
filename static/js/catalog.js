/**
 * @author Patricia Mariaca Hajducek (axolote14)
 * @version 1.2
 * @license http://opensource.org/licenses/MIT
 */
$(document).ready(function () {
    var flgIni = 0;
    var tabSendSql;
    MoreTabs.init('resultShow2');
    MoreTabs.init('resultShow');

    // action botons
    $("#findSrv").on('click', function () {
        doAjax('/findServer', 'db', this.id, 'json', $("#form_nav").serializeArray());
    });
    $("#selectDb").on('change', function () {
        doAjax('/getTables', 'db', 'showTbl', 'json', $("#form_content,#form_nav").serializeArray(), ['divShow', 'showList']);
    });
    $("#sendSql").on('click', function () {
        if ($.trim(MoreTabs.getTabActive('oTextarea').val()) == "" || $("#selectDb").val() == null) return;
        var data = $("#form_content .selectDb,#form_nav").serializeArray();
        data.push(MoreTabs.getTabActive('oStrSql'));
        tabSendSql = MoreTabs.getTabActive('sIdTab');
        doAjax('/resultSql', 'db', this.id, 'json', data);
    });
    $("#explainSql").on('click', function () {
        if ($.trim(MoreTabs.getTabActive('oTextarea').val()) == "" || $("#selectDb").val() == null) return;
        var data = $("#form_content .selectDb,#form_nav").serializeArray();
        data.push(MoreTabs.getTabActive('oStrSql'));
        doAjax('/url', 'db', this.id, 'json', data);
        $('#mdlExplain').modal('show');
    });

    $('#mdlExplain').on('show.bs.modal', function () {
        $('#divExplain').empty();
    });
    $(document).on("change", "#divShow select", function () {
        var strSql = MoreTabs.getTabActive('oTextarea');
        var iniPos = strSql.prop("selectionStart");
        var iniEndSelect = strSql.prop("selectionEnd");
        var txt = " " + $("#divShow option:selected").text() + " ";
        var endPos = iniPos + txt.length;
        strSql.val(strSql.val().slice(0, iniPos) + txt + strSql.val().slice(iniEndSelect));
        //document.getElementById('strSql').setSelectionRange(endPos,endPos);
    });

    $("#showMoreTab").on('click', function () {
        if ($('#resultShow2').is(":visible")) {
            $('#resultShow2').hide();
            $(this).html("SHOW SECOND TAB");
            $('#resultShow textarea').focus();
        } else {
            $('#resultShow2').show();
            $(this).html("HIDE SECOND TAB");
            $('#resultShow2 textarea').focus();
        }
    });

    $("#showProcessList").on('click', function () {
        if ($(this).hasClass("active")) {
            //if ($('#navHelp').is(":visible")) {   
            $(this).attr('value', SHOW_PROCESSLIST);
            $('#navProcList').hide();
            if (!$("#showHelp").hasClass("active")) {
                $('#navBottom').hide();
            }
        } else {
            $(this).attr('value', HIDE_PROCESSLIST);
            $('#navProcList').show();
            $('#navBottom').show();
        }
    });


    $("#showHelp").on('click', function () {
        if ($('#navHelp').is(":visible")) {
            $('#navHelp').hide();
            if (!$("#showProcessList").hasClass("active")) {
                $('#navBottom').hide();
            }
        } else {
            if (flgIni == 0) {
                flgIni = 1;
                doAjax('/url', 'db', 'showHlp', 'json', $("#form_content,#form_nav").serializeArray(), ['divShowHelp', 'showListHelp', 90]);
            }
            $('#navHelp').show();
            $('#navBottom').show();
        }
    });

    $(document).on("change", "#divShowHelp select", function () {
        var data = $("#form_nav").serializeArray();
        data.push({ name: 'showListHelp', value: $("#divShowHelp li.selected .option-name").text() });
        doAjax('/url', 'db', this.id, 'json', data);
    });

    $("#btnModAdd").on('click', function () {
        var id = this.id;
        var title = $("#itemGroup").val();
        if ($.trim(MoreTabs.getTabActive('oTextarea').val()) == "") {
            $("#divAlert").show();
            return;
        }
        if (title === null || $.trim(title) == ""){ 
            $("#divAlert").show();
            return;
        }else {
            //var data = $("#form_content").serializeArray(); OjO aqui
            var data = $("#form_menu2").serializeArray();
            data.push(MoreTabs.getTabActive('oStrSql'));
            data.push({ name: 'name', value: title});
            doAjax('/addItemGroup', 'cat', id, 'html', data, ["addItem&title=" + title]);
        }
        $('#mmodal_add').modal('hide');
    });
    $('#mmodal_add').on('show.bs.modal', function () {
        $("#divAlert").hide();
        $("#itemGroup").val('');
    });
    //+++++++++++++++++++++++++++++++++++++++++++++++++++ nav
    $("#btnMod").on('click', function () {
        var tabn = $("ul#ttab li a.active").attr('href');
        if (tabn == '#tab1') {
            if ($.trim($("#nameGroup").val()) == "") return;
            doAjax('/addGroup', 'cat', 'addGroup', 'html', $("#tab1 :input").serializeArray(), ["addGroup&title=" + $("#nameGroup").val()]);

        } else if (tabn == '#tab2') {
            doAjax('/delGroup', 'cat', 'delGroup', 'html', $("#tab2 :input").serializeArray());
        }
        $('#mmodal').modal('hide');
    });

    $("#form_mod #tab2 :checkbox").on('click', function () {
        var arr = this.name.split("_");
//console.log(' ---  checkbox   --- ');console.log(arr);
        if (arr[0] == 'grp') {
            $("#headingOnex" + arr[1] + " input").prop('checked', $(this).prop('checked'));
        } else {
            var arr = this.name.split("_");
            $("#grp_" + arr[1]).prop('checked', false);
        }
    });

    $('#mmodal').on('show.bs.modal', function () {
        $("#nameGroup").prop('value', "");
        $("#form_mod input:checkbox").prop('checked', false);
        $("#form_mod input:text").prop('value', '');
        $('#ttab a[href="#tab1"]').tab('show');
    });

    /*
        $(".strSql").asuggest(suggests, {
            'minChunkSize': 2,
            'stopSuggestionKeys': [$.asuggestKeys.RETURN],
        });*/
    //+++++++++++++++++++++++++++++++++++++++++++++++++++ nav

    function doAjax(url, go, id, dataType, data) {
        var sendType = id;
        var extraParam;
        if (arguments.length == 6) { // showTbl, showHlp
            extraParam = arguments[5];
            if (go == 'cat') { // addItem, addGroup
                sendType = arguments[5];
            }
        }
        $('.divMsgDb').hide();
        //console.log('===============================================');
        //console.log('arguments: '); console.log(arguments); // yoyome
        //console.log('extraParam: '); console.log(extraParam); // yoyome
        $.ajax({
            url: url,
            type: "POST",
            dataType: dataType,
            data: data,
            beforeSend: function () {
                if (id == 'findSrv') {
                    beforeFindSrv(id);
                } else if (id == 'sendSql') {
                    startLoad(id);
                    hideMsgs(MoreTabs.getTabActive('oResultError'));
                } else if (id == 'explainSql' || id == 'btnModAdd' || id == 'saveSrv'
                    || id == 'delGroup' || id == 'addGroup' || id == 'newView') {
                    hideMsgs(1);
                } else if (id == 'showTbl' || id == 'showHlp') {
                    $('#' + extraParam[1] + ' .list-group').empty();
                } else if (id == 'showListHelp') {
                    //$('#divExpainHelp').empty();
                }
            },
            success: function (json) {
//console.log(id); console.log(json);// yoyome
                if (id == 'findSrv') {
                    successFindSrv(id, json);
                } else if (id == 'sendSql') {
                    successSendSql(id, json);
                } else if (id == 'explainSql') {
                    //successExplainSql(id, json);
                } else if (id == 'showTbl' || id == 'showHlp') {
                    successShow(json, extraParam[0], extraParam[1]);
                } else if (id == 'btnModAdd') {// 'addItem'
                    successAddItem(id, json);
                } else if (id == 'saveSrv' || id == 'newView') {
                    //if (!msgError(id, json)) window.location.reload();
                } else if (id == 'delGroup' || id == 'addGroup') {
                    if (!msgError(id, json)) {
                        $("#menu_div").load(location.href + " #menu_div>*", "");
                        $("#accordionA .list-group").load(location.href + " #accordionA .list-group>*", "");
                        $("#accordionMod").load(location.href + " #accordionMod>*", "");
                    }
                } else if (id == 'showListHelp') {
                    //successShowListHelp(id, json);
                }
            },
            error: function (e) {
                console.log('buuu'+e.responseText)
                stopLoad(1);
                $('.divMsgDb div').addClass('alert-danger');
                $('.divMsgDb div span').text('ups, an error has occurred, verificar login/pass');
                $('.divMsgDb').show();
            },
        });
    }

    function beforeFindSrv(id) {
        //startLoad(id);
        hideMsgs(1);
        $('#selectDb option').remove();
        $('.divSelectDb').hide();
    }
    function successFindSrv(id, json) {
        stopLoad(id);
        if (msgError(id, json)) return;
        jQuery.each(json['row'], function (k, v) {
            $('#selectDb').append('<option>' + v + '</option>');
        });
        $('.divSelectDb').show();
        $('#selectDb').trigger('change');
    }
    function successShow(json, div, list) {
        $('#' + div).html('<select size="16" class="form-control " id="' + list + '" name="' + list + '"></select>');
        jQuery.each(json.row, function (k, v) {
            $('#' + list).append('<option>' + v + '</option>');
        });
        $('#' + div).show();
        $('.' + div).show();
    }
    function successSendSql(id, json) {
        stopLoad(id);
        $('#' + tabSendSql + ' .divResult').html('<table class="table table-striped table-hover table-dark" id="' + tabSendSql + '_tblResult"></table>');
        if (msgError(id, json)) return;
        MoreTabs.createResult(json, tabSendSql);
    }
    function successAddItem(id, msg) {
        if (msgError(id, msg)) return;
        $("#menu_div").load(location.href + " #menu_div>*", "");
        $("#accordionMod").load(location.href + " #accordionMod>*", "");
        $("#accordionA").removeClass("in");
    }
    //+++++++++++++++++++++++++++++++++++++++++++
    function startLoad(id) {
        $('#loading').show();
        $('#' + id).button('loading');
    }
    function stopLoad(id) {
        $('#loading').hide();
        $('#' + id).button('reset');
        $('#' + id).dequeue();
    }
    function hideMsgs(tabn) {
        if (tabn != 1) {
            tabn.hide();
        }
        $('.divMsgDb').hide();
        $('.divExplainError').hide();
    }
    function msgError(id, data) {

        //console.log($.type(data));console.log(id); console.log(data);
        if ($.trim(data) == "null") return true;
        var json = data;
        try {
            if ((id == "saveSrv" || id == 'delGroup' || id == "addItem" || id == 'newView' || id== 'addGroup')
                && $.type(data) === "string" && $.trim(data) != "") {
                json = JSON.parse(data);
            }
        } catch (err) {
            json = { error: data };
        }
        //console.log(json)
        //console.log(json.error)
        if ($.trim(json.error) != '') {
            if (id == "sendSql") {
                MoreTabs.sendError(json.error, tabSendSql);
            } else if (id == "explainSql") {
                $('.divExplainError').empty();
                $('.divExplainError').append(json.error);
                $('.divExplainError').show();
            } else {
                mje = json.message
                if($.type(json.error[0])=='string'){
                    mje = json.error[0];
                } 
                $('.divMsgDb div').addClass('alert-warning');
                $('.divMsgDb div span').text(mje);
                $('.divMsgDb').show();
            }
            return true;
        }
        return false;
    }
});
function putSql(sql) {
    MoreTabs.getTabActive('oTextarea').val(sql);
}

function buscaenLista(myInput, myCont) {
    var input, filter, i, txtValue, select;
    input = document.getElementById(myInput);
    filter = input.value.toUpperCase();
    select = document.getElementById(myCont);
    opt = select.getElementsByTagName("option");
    for (i = 0; i < opt.length; i++) {
        txtValue = opt[i].text
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            opt[i].style.display = "";
        } else {
            opt[i].style.display = "none";
        }
    }
}
