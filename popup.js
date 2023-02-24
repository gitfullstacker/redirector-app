chrome.storage.sync.get(["user_name", "rules", "url_enable"]).then((result) => {
    if (result.user_name) {
        document.getElementById("welcome_panel").style.display = "none";
        document.getElementById("information_panel").style.display = "flex";

        document.getElementById("display_user_name").innerHTML = "Hi, " + result.user_name + "!";
    } else {
        document.getElementById("welcome_panel").style.display = "flex";
        document.getElementById("information_panel").style.display = "none";
    }

    if (result.rules) {
        console.log(result.rules);
        loadRules(result.rules);
    }

    if (result.url_enable) {
        document.getElementById("url_enable").checked = true;
    }
});

var value = "kkk"
document.getElementById("save").onclick = () => {
    var rules = [];
    var removeIds = [];

    for (let i = 1; i <= 5; i++) {
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

    chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: removeIds,
        addRules: rules,
    }).then(() => {
        console.log("successful");
    });

    chrome.storage.sync.set({ rules: rules }).then(() => {
        loadRules(rules);
    });
}

function loadRules (rules) {
    for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];
        document.getElementById("filter_url" + (i + 1)).value = rule.condition.urlFilter;
        document.getElementById("redirect_url" + (i + 1)).value = rule.action.redirect.url;
    }
}

document.getElementById("submit_button").onclick = () => {
    const value = document.getElementById("user_name").value;
    chrome.storage.sync.set({ user_name: value }).then(() => {
        document.getElementById("welcome_panel").style.display = "none";
        document.getElementById("information_panel").style.display = "flex";

        document.getElementById("display_user_name").innerHTML = "Hi, " + value + "!";
    });
}

document.getElementById('url_enable').onchange = (event) => {
    if (event.currentTarget.checked) {
        chrome.storage.sync.set({ url_enable: true }).then(() => {
            var rules = [];
            var removeIds = [];

            for (let i = 1; i <= 5; i++) {
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
    
            chrome.declarativeNetRequest.updateDynamicRules({
                removeRuleIds: removeIds,
                addRules: rules,
            }).then(() => {
                console.log("successful");
            });
        });
    } else {
        chrome.storage.sync.set({ url_enable: false }).then(() => {
            var rules = [];
            var removeIds = [];

            for (let i = 1; i <= 5; i++) {
                removeIds.push(i);
            }
            
            chrome.declarativeNetRequest.updateDynamicRules({
                removeRuleIds: removeIds,
                addRules: rules,
            }).then(() => {
                console.log("successful");
            });
        });
    }
}