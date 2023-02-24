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

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    console.log(message)
});