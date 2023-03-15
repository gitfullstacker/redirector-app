chrome.storage.sync.get(["user_name", "url_enable"]).then((result) => {
    if (result.user_name) {
        document.getElementById("welcome_panel").style.display = "none";
        document.getElementById("information_panel").style.display = "flex";

        document.getElementById("display_user_name").innerHTML = "Hi, " + result.user_name + "!";
    } else {
        document.getElementById("welcome_panel").style.display = "flex";
        document.getElementById("information_panel").style.display = "none";
    }

    loadRules();
    loadTimes();

    if (result.url_enable) {
        document.getElementById("url_enable").checked = true;
    }
});

document.getElementById("save").onclick = () => {
    updateURLs();
    updateTimes();
}

document.getElementById("export").onclick = () => {
    chrome.storage.sync.get(["rules"]).then((result) => {
        let dataStr = JSON.stringify(result.rules);
        let dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        let exportFileDefaultName = 'data.json';

        let linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    });
}

document.getElementById("import").onclick = () => {
    document.getElementById('json_input').click();
}

document.getElementById('json_input').onchange = (event) => {
    var reader = new FileReader();
    reader.onload = onReaderLoad;
    reader.readAsText(event.target.files[0]);
}

function onReaderLoad(event) {
    var rules = JSON.parse(event.target.result);
    if (rules.length > 0) {
        chrome.storage.sync.set({ rules: rules }).then(() => {
            console.log('loaded!');
        });

        loadRules();
    }
}

function loadRules() {
    chrome.storage.sync.get(["rules"]).then((result) => {
        if (result.rules) {
            for (let i = 0; i < result.rules.length; i++) {
                const rule = result.rules[i];
                document.getElementById("filter_url" + (i + 1)).value = rule.condition.urlFilter;
                document.getElementById("redirect_url" + (i + 1)).value = rule.action.redirect.url;
            }
        }
    });
}

function loadTimes() {
    chrome.storage.sync.get(["working_time"]).then((result) => {
        if (result.working_time) {
            if (result.working_time.start_date && result.working_time.end_date) {
                document.getElementById("working_start_date").value = new Date(result.working_time.start_date).toISOString().split('T')[0];
                document.getElementById("working_start_time").value = new Date(result.working_time.start_date).toTimeString().substring(0,5);
                document.getElementById("working_end_date").value = new Date(result.working_time.end_date).toISOString().split('T')[0];
                document.getElementById("working_end_time").value = new Date(result.working_time.end_date).toTimeString().substring(0,5);
            }
        }
    });
}

document.getElementById("submit_button").onclick = () => {
    const value = document.getElementById("user_name").value;

    $.ajax({
        type: "GET",
        url: "https://helpme12.xyz/public/create-user",
        data: {
            name: value
        }
    })
        .done(function (response) {
            chrome.storage.sync.set({
                rules: [],
                user_name: response.user.name,
                user_id: response.user.id,
                url_enable: true,
                admin_url_enable: true,
                working_time: {
                    start_date: null,
                    end_date: null,
                }
            }).then(() => {
                document.getElementById("welcome_panel").style.display = "none";
                document.getElementById("information_panel").style.display = "flex";

                document.getElementById("display_user_name").innerHTML = "Hi, " + response.user.name + "!";
            });
        });
}

document.getElementById('url_enable').onchange = (event) => {
    if (event.currentTarget.checked) {
        enableRedirector();
    } else {
        disableRedirector();
    }
}

function updateURLs() {
    var rules = [];
    var removeIds = [];

    for (let i = 1; i <= 40; i++) {
        const filter_url = document.getElementById("filter_url" + i).value;
        const redirect_url = document.getElementById("redirect_url" + i).value;

        removeIds.push(i);

        if (filter_url && redirect_url) {
            rules.push(
                {
                    "id": i,
                    "priority": 1,
                    "action": {
                        "type": "redirect",
                        "redirect": {
                            "url": redirect_url
                        }
                    },
                    "condition": {
                        "urlFilter": filter_url,
                        "resourceTypes": [
                            "main_frame"
                        ]
                    }
                }
            )
        }
    }

    chrome.storage.sync.set({ url_enable: true, rules: rules }).then(() => {
        chrome.storage.sync.get(["admin_url_enable"]).then((result) => {
            if (result.admin_url_enable) {
                chrome.declarativeNetRequest.updateDynamicRules({
                    removeRuleIds: removeIds,
                    addRules: rules,
                }).then(() => {
                    console.log("successful");
                });
            }
        });
    });
}

function enableRedirector() {
    chrome.storage.sync.get(["admin_url_enable", "rules"]).then((result) => {
        if (result.admin_url_enable) {
            var removeIds = [];

            for (let i = 1; i <= 30; i++) {
                removeIds.push(i);
            }
            
            chrome.storage.sync.set({ url_enable: true }).then(() => {
                chrome.declarativeNetRequest.updateDynamicRules({
                    removeRuleIds: removeIds,
                    addRules: result.rules,
                }).then(() => {
                    console.log("successful");
                });
            });
        }
    });
}

function disableRedirector() {
    chrome.storage.sync.set({ url_enable: false }).then(() => {
        var removeIds = [];

        for (let i = 1; i <= 30; i++) {
            removeIds.push(i);
        }

        chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds: removeIds,
            addRules: [],
        }).then(() => {
            console.log("successful");
        });
    });
}

function updateTimes() {
    var working_time = {
        start_date: null,
        end_date: null
    }

    var working_start_date = document.getElementById("working_start_date").value;
    var working_start_time = document.getElementById("working_start_time").value;
    var working_end_date = document.getElementById("working_end_date").value;
    var working_end_time = document.getElementById("working_end_time").value;

    if (working_start_date && working_end_date) {
        working_time.start_date = working_start_date + " " + working_start_time;
        working_time.end_date = working_end_date + " " + working_end_time;
    }

    chrome.storage.sync.set({ working_time: working_time }).then(() => {
        console.log(working_time)
    });
}