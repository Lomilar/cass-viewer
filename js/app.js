/*
 Copyright 2017 Eduworks Corporation and other contributing parties.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

var error = function (error) {
    console.log(error);
}

var repo = new EcRepository();
repo.selectedServer = "";

EcRepository.caching = true;

var frameworkId = "";

var servers = ["http://cass.credentialfinder.net/api/custom"];

var repos = [];

function refreshFrameworks() {
    var searchTerm = $("#search").val();
    if (searchTerm == null || searchTerm == "")
        searchTerm = "*";
    var me = this;
    me.loading = 0;
    $("#sidebar").find("#loading").show();
    $("#sidebar").find("a,br").remove();
    for (var i = 0; i < servers.length; i++) {
        var r = new EcRepository();
        r.selectedServer = servers[i];
        loading++;
        EcFramework.search(r, searchTerm, function (frameworks) {
            for (var v = 0; v < frameworks.length; v++) {
                $("#frameworks").append("<p><a style='display:none'/></p>").children().last().children().last().attr("id", frameworks[v].shortId()).text(frameworks[v].name).click(click);
            }
            loading--;
            if (loading == 0) {
                $("#sidebar").find("#loading").hide();
                $("#sidebar").find("a").show();
            }
        }, error, {
            size: 5000
        });
    }
}

function click(evt) {
    hideAll();
    frameworkId = $(evt.target).attr("id");
    repo = null;
    for (var i = 0; i < servers.length; i++)
        if (frameworkId.startsWith(servers[i])) {
            repo = new EcRepository();
            repo.selectedServer = servers[i];
        }
    if (repo == null) {
        repo = new EcRepository();
        repo.selectedServer = servers[0];
    }
    refreshFramework();

}

function refreshFramework() {
    var me = this;
    $("#tree").html("");
    me.fetches = 0;
    EcRepository.get(frameworkId, function (framework) {
        $("#title").text(framework.name);
        if (framework.competency == null)
            framework.competency = [];
        if (framework.relation == null)
            framework.relation = [];
        $("#frameworkLink").attr("href", framework.shortId()).show();
        //repo.precache(framework.competency.concat(framework.relation), function (success) {
        if (framework.competency.length == 0)
            showAll();
        else
            for (var i = 0; i < framework.competency.length; i++) {
                me.fetches++;
                EcCompetency.get(framework.competency[i], function (competency) {
                    me.fetches--;
                    var treeNode = $("#tree").append("<li class = 'competency'><ul></ul></li>").children().last();
                    treeNode.attr("id", competency.shortId());
                    if (competency.description != null && competency.description != "NULL" && competency.description != competency.name)
                        treeNode.prepend("<br><small>" + competency.description + "</small>");
                    treeNode.prepend(" <a target='_blank' href='" + competency.shortId() + "'>🔗</a>");
                    treeNode.prepend("<span>" + competency.name + "</span>").children().first().click(function (evt) {
                        $(evt.target).parent().children("ul").slideToggle();
                    });
                    treeNode.prepend("<input type='checkbox'>").children().first().click(function (evt) {
                        console.log(evt);
                        $(evt.target).parent().find("input").prop("checked", evt.target.checked);
                    });
                    if (me.fetches == 0) {
                        if (framework.relation != undefined && framework.relation.length > 0) {
                            for (var i = 0; i < framework.relation.length; i++) {
                                me.fetches++;
                                EcAlignment.get(framework.relation[i], function (relation) {
                                    me.fetches--;
                                    if (relation.source !== undefined) {
                                        if (relation.relationType == "narrows") {
                                            $("[id=\"" + relation.target + "\"]").children().last().append($("[id=\"" + relation.source + "\"]"));
                                        }
                                        if (me.fetches == 0) {
                                            for (var i = 0; i < framework.relation.length; i++) {
                                                me.fetches++;
                                                EcAlignment.get(framework.relation[i], function (relation) {
                                                    me.fetches--;
                                                    if (relation.source !== undefined) {
                                                        if (relation.relationType == "requires") {
                                                            if ($("[id=\"" + relation.target + "\"]").prevAll("[id=\"" + relation.source + "\"]").length > 0)
                                                                $("[id=\"" + relation.target + "\"]").insertBefore($("[id=\"" + relation.source + "\"]"));
                                                        }
                                                    }
                                                    if (me.fetches == 0) {
                                                        showAll();
                                                    }
                                                }, error);
                                            }
                                        }
                                    }
                                }, error);
                            }
                        } else
                            showAll();
                    }
                }, error);
            }
            //});
    }, error);
}


function showAll() {
    $("button").show();
    $("#main").find("#loading").hide();
    $("#tree").show();
    $("#sidetitle").show();
    $("#sidelog").show();
    $("#sidedevicestitle").show();
    $("#sidedevices").show();
    $("select").show();
    $("#totalContainer").show();
    $("#total").show();
    $("#totalText").show();
}

function hideAll() {
    $('.done').show();
    $("button").hide();
    $("#sidetitle").hide();
    $("#sidelog").hide();
    $("#sidedevicestitle").hide();
    $("#sidedevices").hide();
    $("#main").find("#loading").show();
    $("#tree").hide();
    $("select").hide();
    $("#totalContainer").hide();
    $("#total").hide();
    $("#totalText").hide();
}

$("#search").keyup(function (event) {
    if (event.keyCode == '13') {
        refreshFrameworks();
    }
    return false;
});

refreshFrameworks();
