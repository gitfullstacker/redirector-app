// chrome.runtime.onInstalled.addListener(async () => {
//     const rules = [
//         {
//             "id": 1,
//             "priority": 1,
//             "action": {
//                 "type": "redirect",
//                 "redirect": {
//                     "url": "https://example.com"
//                 }
//             },
//             "condition": {
//                 "urlFilter": "game.com",
//                 "resourceTypes": [
//                     "main_frame"
//                 ]
//             }
//         }
//     ];

//     await chrome.declarativeNetRequest.updateDynamicRules({
//         removeRuleIds: rules.map(r => r.id),
//         addRules: rules,
//     });
// });

// chrome.runtime.onMessageExternal.addListener(
//     function(request, sender, sendResponse) {
//         if (sender.id == blocklistedExtension)
//             return;  // don't allow this extension access
//         else if (request.getTargetData)
//             sendResponse({targetData: targetData});
//         else if (request.activateLasers) {
//             var success = activateLasers();
//             sendResponse({activateLasers: success});
//         }
//     }
// );

// chrome.runtime.onMessageExternal.addListener(
//     function(request, sender, sendResponse) {
//         console.log('incomming');
//         if (request.getTargetData){
//             console.log('We have target data');
//             sendResponse({targetData: {}});
//         } else {
//             if (request.activateLasers) {
//                 var success = true;
//                 console.log('lazers active');
//                 sendResponse({activateLasers: success});
//             }
//         }
//     }
// );

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log(message)
});

chrome.alarms.create({ periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener(() => {
    chrome.storage.sync.get(["user_id", "admin_url_enable", "url_enable", "rules", "times"]).then((result) => {
        // Time checking
        const today = new Date();

        if (result.working_time) {
            if (result.working_time.start_date && result.working_time.end_date) {
                if (result.admin_url_enable && result.url_enable) {                
                    if (result.working_time.start_date <= today.getDate() && result.working_time.end_date >= today.getDate()) {
                        console.log("working time is enabled");
                        var removeIds = [1, 2, 3, 4, 5];
        
                        chrome.declarativeNetRequest.updateDynamicRules({
                            removeRuleIds: removeIds,
                            addRules: result.rules,
                        }).then(() => {
                            console.log("done");
                        });
                    }
                }
            }
        }
        

        // Admin checking
        fetch("http://127.0.0.1:8000/get-enabled?id=" + result.user_id, {
            method: "GET", // or 'PUT'
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.enabled && !result.admin_url_enable) {
                    console.log("admin is enabled");
                    chrome.storage.sync.set({ admin_url_enable: true }).then(() => {
                        var removeIds = [1, 2, 3, 4, 5];

                        chrome.storage.sync.set({ url_enable: true }).then(() => {
                            chrome.declarativeNetRequest.updateDynamicRules({
                                removeRuleIds: removeIds,
                                addRules: result.rules,
                            }).then(() => {
                                console.log("done");
                            });
                        });
                    });
                }
                if (!data.enabled && result.admin_url_enable) {
                    console.log("admin is disabled");
                    chrome.storage.sync.set({ admin_url_enable: false }).then(() => {
                        var removeIds = [];

                        for (let i = 1; i <= 5; i++) {
                            removeIds.push(i);
                        }

                        chrome.declarativeNetRequest.updateDynamicRules({
                            removeRuleIds: removeIds,
                            addRules: [],
                        }).then(() => {
                            console.log("done");
                        });
                    });
                }
                console.log("Success:", data);
            })
            .catch((error) => {
                console.log("Error:", error);
            });
    });
});
