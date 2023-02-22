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